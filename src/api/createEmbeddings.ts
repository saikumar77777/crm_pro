import { OpenAI } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { getAllDeals } from "./getAllDeals";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OPENAI_API_KEY, CHROMA_DB_URL, DEALS_COLLECTION } from '../config/env';

// Initialize OpenAI embeddings with environment variable API key
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: OPENAI_API_KEY,
  modelName: "text-embedding-3-small"
});

// Collection name for ChromaDB
const COLLECTION_NAME = DEALS_COLLECTION;

// In-memory vector store for when ChromaDB is not available
let memoryVectorStore = null;

// LocalStorage keys
const EMBEDDINGS_KEY = "deal_embeddings";
const EMBEDDINGS_TIMESTAMP_KEY = "deal_embeddings_timestamp";

// Define filter types
interface FilterCondition {
  [key: string]: any;
}

interface QueryFilters {
  not?: FilterCondition;
  [key: string]: any;
}

/**
 * Formats a deal into text suitable for embedding
 */
function formatDealForEmbedding(deal: any) {
  return `
Deal: ${deal.name}
Stage: ${deal.stage}
Value: $${deal.value.toLocaleString()}
Company: ${deal.company || 'N/A'}
Priority: ${deal.priority || 'Standard'}
Expected Close: ${deal.expected_close_date || 'Not set'}
Days in Stage: ${deal.days_in_stage || 'Unknown'}
Probability: ${deal.probability || 'Unknown'}%

Contact Information:
${deal.contact ? `
Name: ${deal.contact.first_name} ${deal.contact.last_name}
Position: ${deal.contact.position || 'Unknown'}
Email: ${deal.contact.email || 'Unknown'}
Phone: ${deal.contact.phone || 'Unknown'}
Company: ${deal.contact.company || 'Unknown'}
Status: ${deal.contact.status || 'Unknown'}
` : 'No contact associated with this deal'}

Notes:
${deal.notes || 'No notes available for this deal'}

Communications:
${deal.communications && deal.communications.length > 0 ? 
  deal.communications.map((c: any) => 
    `- ${new Date(c.created_at).toLocaleDateString()}: ${c.type} - ${c.subject}
     ${c.content || ''}`
  ).join('\n\n') : 
  'No communications recorded for this deal'
}
  `;
}

/**
 * Save embeddings to localStorage
 */
function saveEmbeddingsToLocalStorage(documents: Document[], embeddingVectors: number[][]) {
  try {
    const dataToSave = documents.map((doc, index) => ({
      content: doc.pageContent,
      metadata: doc.metadata,
      embedding: embeddingVectors[index]
    }));
    
    localStorage.setItem(EMBEDDINGS_KEY, JSON.stringify(dataToSave));
    localStorage.setItem(EMBEDDINGS_TIMESTAMP_KEY, new Date().toISOString());
    
    console.log(`Successfully saved ${dataToSave.length} embeddings to localStorage`);
    console.log(`Sample embedding (first 5 dimensions):`, 
      embeddingVectors[0]?.slice(0, 5) || "No embeddings available");
    
    // Calculate total storage used
    const storageSize = new Blob([JSON.stringify(dataToSave)]).size;
    console.log(`Total localStorage usage: ${(storageSize / (1024 * 1024)).toFixed(2)} MB`);
    
    return true;
  } catch (error) {
    console.error("Error saving embeddings to localStorage:", error);
    return false;
  }
}

/**
 * Get embeddings from localStorage
 */
function getEmbeddingsFromLocalStorage() {
  try {
    const storedData = localStorage.getItem(EMBEDDINGS_KEY);
    if (!storedData) return null;
    
    const timestamp = localStorage.getItem(EMBEDDINGS_TIMESTAMP_KEY);
    console.log(`Loading embeddings from localStorage (saved on ${timestamp})`);
    
    const parsedData = JSON.parse(storedData);
    console.log(`Loaded ${parsedData.length} embeddings from localStorage`);
    
    return parsedData;
  } catch (error) {
    console.error("Error loading embeddings from localStorage:", error);
    return null;
  }
}

/**
 * Creates embeddings for all deals and stores them in a vector store
 */
export async function createDealEmbeddings() {
  try {
    console.log("Starting to create deal embeddings...");
    
    // Fetch all deals with related information
    const result = await getAllDeals();
    
    if (!result.success || !result.deals || result.deals.length === 0) {
      throw new Error("Failed to fetch deals or no deals found");
    }
    
    console.log(`Fetched ${result.deals.length} deals for embedding`);
    
    // Prepare documents for embedding
    const documents = result.deals.map(deal => {
      const dealText = formatDealForEmbedding(deal);
      
      return new Document({
        pageContent: dealText,
        metadata: {
          deal_id: deal.id,
          stage: deal.stage,
          value: deal.value,
          company: deal.company || '',
          contact_id: deal.contact_id || '',
          is_closed: ['closed-won', 'closed-lost'].includes(deal.stage),
          outcome: deal.stage === 'closed-won' ? 'won' : 
                  deal.stage === 'closed-lost' ? 'lost' : 'in_progress'
        }
      });
    });
    
    console.log(`Prepared ${documents.length} documents for embedding`);
    
    // Generate embeddings for all documents
    console.log("Generating embeddings with OpenAI...");
    const embeddingVectors = await Promise.all(
      documents.map(doc => embeddings.embedQuery(doc.pageContent))
    );
    
    console.log(`Generated ${embeddingVectors.length} embedding vectors`);
    console.log(`Embedding dimensions: ${embeddingVectors[0]?.length || 0}`);
    
    // Save embeddings to localStorage
    saveEmbeddingsToLocalStorage(documents, embeddingVectors);
    
    // Try to use ChromaDB first, fall back to in-memory if not available
    try {
      // Store documents in ChromaDB
      const vectorStore = await Chroma.fromDocuments(documents, embeddings, {
        collectionName: COLLECTION_NAME,
        url: CHROMA_DB_URL, // Use environment variable
      });
      
      console.log(`Successfully created embeddings and stored in ChromaDB collection: ${COLLECTION_NAME}`);
      
      return { 
        success: true, 
        count: documents.length,
        collectionName: COLLECTION_NAME,
        storageType: "chromadb",
        sampleEmbedding: embeddingVectors[0]?.slice(0, 5) || []
      };
    } catch (error) {
      console.warn("ChromaDB not available, falling back to in-memory vector store:", error);
      
      // Fall back to in-memory vector store
      memoryVectorStore = await MemoryVectorStore.fromDocuments(
        documents,
        embeddings
      );
      
      console.log(`Successfully created embeddings and stored in memory`);
      
      return { 
        success: true, 
        count: documents.length,
        collectionName: "memory-store",
        storageType: "memory",
        sampleEmbedding: embeddingVectors[0]?.slice(0, 5) || []
      };
    }
  } catch (error) {
    console.error("Error creating deal embeddings:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Query similar deals from the vector store
 */
export async function querySimilarDeals(queryText: string, filters: QueryFilters = {}, limit = 5) {
  try {
    console.log(`Querying similar deals with: "${queryText}"`);
    
    // Try to load from localStorage first if memory store is not available
    if (!memoryVectorStore) {
      const storedEmbeddings = getEmbeddingsFromLocalStorage();
      if (storedEmbeddings) {
        console.log("Creating in-memory vector store from localStorage embeddings");
        
        // Convert stored data back to Documents
        const documents = storedEmbeddings.map((item: any) => 
          new Document({
            pageContent: item.content,
            metadata: item.metadata
          })
        );
        
        // Create memory store from documents
        memoryVectorStore = await MemoryVectorStore.fromDocuments(
          documents,
          embeddings
        );
        
        console.log("Successfully created in-memory vector store from localStorage");
      }
    }
    
    // Check if we have an in-memory store
    if (memoryVectorStore) {
      console.log("Using in-memory vector store for query");
      
      // For in-memory store, we need to handle filtering manually
      const results = await memoryVectorStore.similaritySearch(queryText, limit);
      
      // Apply filters manually if needed
      let filteredResults = results;
      if (Object.keys(filters).length > 0) {
        filteredResults = results.filter(doc => {
          // Handle exclusion filters
          if (filters.not) {
            for (const [key, value] of Object.entries(filters.not)) {
              if (doc.metadata[key] === value) {
                return false;
              }
            }
          }
          
          // Handle inclusion filters
          for (const [key, value] of Object.entries(filters)) {
            if (key !== 'not' && doc.metadata[key] !== value) {
              return false;
            }
          }
          
          return true;
        });
      }
      
      console.log(`Found ${filteredResults.length} similar deals`);
      
      return filteredResults.map(doc => ({
        content: doc.pageContent,
        metadata: doc.metadata,
      }));
    }
    
    // Try to use ChromaDB if available
    try {
      // Connect to existing collection
      const vectorStore = await Chroma.fromExistingCollection(embeddings, {
        collectionName: COLLECTION_NAME,
        url: CHROMA_DB_URL,
      });
      
      // Prepare filter if needed
      const filterObj = {};
      if (Object.keys(filters).length > 0) {
        Object.entries(filters).forEach(([key, value]) => {
          if (key === 'not') {
            // Handle exclusion filters
            Object.entries(value as Record<string, any>).forEach(([notKey, notValue]) => {
              filterObj[`metadata.${notKey}`] = { $ne: notValue };
            });
          } else {
            // Handle regular filters
            filterObj[`metadata.${key}`] = value;
          }
        });
      }
      
      // Perform similarity search
      const results = await vectorStore.similaritySearch(
        queryText,
        limit,
        Object.keys(filterObj).length > 0 ? filterObj : undefined
      );
      
      console.log(`Found ${results.length} similar deals`);
      
      return results.map(doc => ({
        content: doc.pageContent,
        metadata: doc.metadata,
      }));
    } catch (error) {
      console.error("Error connecting to ChromaDB:", error);
      throw new Error("Vector database is not available. Please generate embeddings first.");
    }
  } catch (error) {
    console.error("Error querying similar deals:", error);
    throw error;
  }
}

/**
 * Function to get deal coach context using embeddings
 */
export async function getDealCoachContext(dealId: string) {
  try {
    // Get all deals data
    const allDealsResult = await getAllDeals();
    if (!allDealsResult.success) {
      throw new Error("Failed to fetch deals data");
    }
    
    // Find current deal
    const currentDeal = allDealsResult.deals.find(deal => deal.id === dealId);
    if (!currentDeal) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    // Query similar deals using embeddings
    const similarDealsQuery = `Deal in ${currentDeal.stage} stage with value around ${currentDeal.value}`;
    const similarDeals = await querySimilarDeals(
      similarDealsQuery,
      { not: { deal_id: currentDeal.id } },
      5
    );
    
    // Get contact deals directly from the fetched data
    const contactDeals = currentDeal.contact_id ? 
      allDealsResult.deals.filter(deal => 
        deal.contact_id === currentDeal.contact_id && deal.id !== currentDeal.id
      ) : [];
    
    return {
      currentDeal,
      similarDeals,
      contactDeals
    };
  } catch (error) {
    console.error("Error getting deal coach context:", error);
    throw error;
  }
} 
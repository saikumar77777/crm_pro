// Customer Persona Builder System using OpenAI SDK v4+ with Agent Architecture
// Agents:
// 1. ProfileAnalyzerAgent: Analyzes communication and engagement patterns
// 2. PersonaGeneratorAgent: Builds structured persona with confidence scores
// 3. CommunicationAdvisorAgent: Gives tailored messaging guidance
// 4. OrchestratorAgent: Coordinates the multi-agent flow

import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env';
import { getContactContext } from './contactContext';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allow API usage in browser environment
});

// Define interfaces for type safety
interface PersonaTrait {
  trait: string;
  description: string;
  confidence: number;
}

interface PersonaData {
  summary: string;
  communicationStyle: string;
  decisionFactors: string;
  painPoints: string[];
  interests: string[];
  traits: PersonaTrait[];
}

interface CustomerPersonaResult {
  persona: PersonaData;
  communicationAdvice: string;
}

// Utility: Makes chat completion call with enforced brevity
async function callAgent(systemPrompt: string, userPrompt: string, model: string = 'gpt-4o') {
  console.log(`Calling agent with system prompt: ${systemPrompt.substring(0, 100)}...`);
  console.log(`User prompt: ${userPrompt.substring(0, 100)}...`);
  
  try {
    const chat = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });
    
    const response = chat.choices[0].message.content?.trim() || "";
    console.log(`Agent response length: ${response.length} characters`);
    return response;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error generating response. Please try again.";
  }
}

// Agent 1: Profile Analyzer Agent
async function ProfileAnalyzerAgent(contactContext: any) {
  console.log("Starting ProfileAnalyzerAgent...");
  
  const system = `You are an expert CRM data analyst specializing in behavioral analysis. Your task is to analyze contact data and communication history to identify patterns and insights about the customer's behavior, preferences, and needs.

YOUR TASK:
1. Analyze all available contact information, communication history, and deal history
2. Identify patterns in:
   - Communication style (formal/informal, brief/detailed, technical/non-technical)
   - Response patterns (quick/delayed, thorough/brief)
   - Preferred communication channels
   - Decision-making approach (analytical, emotional, consensus-driven, etc.)
   - Topics of interest and engagement levels
   - Pain points and challenges mentioned
3. Look for evidence of personality traits, work style, and professional motivations
4. Consider how they interact with different types of content and messaging

IMPORTANT: Base your analysis ONLY on the actual data provided. If there's limited data, acknowledge the limitations and provide insights based on what's available. Do not make unfounded assumptions.

FORMAT YOUR RESPONSE:
- Provide a structured analysis with clear sections for different behavioral aspects
- Support observations with specific examples from the data
- Note the confidence level for each insight based on available evidence
- Keep your entire response under 800 words`;

  const contextString = JSON.stringify({
    contact: contactContext.contact,
    communications: contactContext.communications,
    deals: contactContext.deals,
    activities: contactContext.activities
  });

  const user = `Contact Context: ${contextString}
Analyze this contact's behavioral patterns based on the available data.`;

  console.log("ProfileAnalyzerAgent - Sending request to OpenAI");
  const response = await callAgent(system, user);
  console.log("ProfileAnalyzerAgent - Received response");
  return response;
}

// Agent 2: Persona Generator Agent
async function PersonaGeneratorAgent(contactContext: any, profileAnalysis: string) {
  console.log("Starting PersonaGeneratorAgent...");
  
  const system = `You are a sales psychologist specializing in customer persona development. Your task is to create a detailed behavioral profile based on contact data and analysis.

YOUR TASK:
1. Create a comprehensive customer persona with the following components:
   - summary: Brief overview of who this person is professionally (max 100 words)
   - communicationStyle: Their preferred communication approach (max 50 words)
   - decisionFactors: What drives their decision-making (max 50 words)
   - painPoints: Array of 3 likely professional pain points
   - interests: Array of 3 likely professional interests
   - traits: Array of objects with {trait, description, confidence} where confidence is 1-100

2. For each trait:
   - trait: Name of the behavioral trait (e.g., "Analytical Thinking")
   - description: Brief explanation of how this trait manifests (1-2 sentences)
   - confidence: Numerical score (1-100) reflecting how confident we are in this trait based on available data

IMPORTANT: Return ONLY a valid JSON object. DO NOT use markdown formatting, code blocks, or backticks. Return raw JSON only.

CONFIDENCE SCORING GUIDELINES:
- 90-100: Extremely strong evidence across multiple interactions
- 70-89: Strong evidence from several data points
- 50-69: Moderate evidence, reasonably confident
- 30-49: Some indications but limited evidence
- 1-29: Speculative, based on minimal data

If there's very limited data available, be honest about the confidence scores and don't overstate certainty.`;

  const contactString = JSON.stringify({
    name: `${contactContext.contact.first_name} ${contactContext.contact.last_name}`,
    position: contactContext.contact.position,
    company: contactContext.contact.company
  });

  const user = `Contact Information: ${contactString}
Profile Analysis: ${profileAnalysis}
Generate a detailed customer persona in JSON format.`;

  console.log("PersonaGeneratorAgent - Sending request to OpenAI");
  const output = await callAgent(system, user);
  console.log("PersonaGeneratorAgent - Received response");
  
  try {
    // Clean the response by removing markdown code block markers if present
    const cleanedOutput = output
      .replace(/```(?:json)?\s*/g, '') // Remove opening code block markers with or without language
      .replace(/\s*```/g, '')          // Remove closing code block markers
      .trim();                         // Remove any extra whitespace
    
    console.log("PersonaGeneratorAgent - Parsing JSON response");
    return JSON.parse(cleanedOutput) as PersonaData;
  } catch (error) {
    console.error("Error parsing Persona Generator response:", error);
    console.error("Raw response:", output);
    
    // Return a fallback persona
    return {
      summary: "Unable to generate complete persona due to insufficient data or parsing error.",
      communicationStyle: "Consider direct, clear communication until more interaction data is available.",
      decisionFactors: "Unknown based on current data.",
      painPoints: ["Insufficient data to determine specific pain points"],
      interests: ["Insufficient data to determine specific interests"],
      traits: [
        {
          trait: "Data Availability",
          description: "Limited data available to create accurate persona",
          confidence: 100
        }
      ]
    };
  }
}

// Agent 3: Communication Advisor Agent
async function CommunicationAdvisorAgent(contactContext: any, persona: PersonaData) {
  console.log("Starting CommunicationAdvisorAgent...");
  
  const system = `You are a communication strategist specializing in sales and customer engagement. Your task is to provide tailored communication recommendations based on a customer's persona.

YOUR TASK:
1. Analyze the customer persona and provide specific recommendations for effective communication
2. Include guidance on:
   - Best communication channels (email, phone, in-person, etc.)
   - Optimal message structure and length
   - Tone and formality level
   - Frequency and timing of communications
   - Key talking points that will resonate
   - Topics or approaches to avoid
   - How to build rapport with this specific individual
3. Tailor your advice to their specific traits, communication style, and decision factors

FORMAT YOUR RESPONSE:
- Use clear headings for different aspects of your recommendations
- Provide specific examples of language or approaches that would work well
- Include both dos and don'ts
- Keep your entire response under 400 words and focused on practical advice`;

  const personaString = JSON.stringify(persona);
  const contactString = JSON.stringify({
    name: `${contactContext.contact.first_name} ${contactContext.contact.last_name}`,
    position: contactContext.contact.position,
    company: contactContext.contact.company
  });

  const user = `Contact Info: ${contactString}
Customer Persona: ${personaString}
Provide tailored communication recommendations.`;

  console.log("CommunicationAdvisorAgent - Sending request to OpenAI");
  const response = await callAgent(system, user);
  console.log("CommunicationAdvisorAgent - Received response");
  return response;
}

// Main Orchestrator
export async function CustomerPersonaOrchestrator(contactId: string): Promise<CustomerPersonaResult> {
  console.log("Starting Customer Persona Builder process for contact:", contactId);
  
  try {
    // Step 1: Retrieve contact context using the RAG system
    console.log("Retrieving contact context...");
    const contactContext = await getContactContext(contactId);
    console.log("Contact context retrieved with:", {
      contactInfo: !!contactContext.contact,
      communicationsCount: contactContext.communications.length,
      dealsCount: contactContext.deals.length,
      activitiesCount: contactContext.activities.length
    });
    
    // Step 2: Analyze profile
    console.log("Analyzing contact profile...");
    const profileAnalysis = await ProfileAnalyzerAgent(contactContext);
    console.log("Profile analysis complete");
    
    // Step 3: Generate persona
    console.log("Generating customer persona...");
    const persona = await PersonaGeneratorAgent(contactContext, profileAnalysis);
    console.log("Persona generation complete");
    
    // Step 4: Get communication advice
    console.log("Generating communication recommendations...");
    const communicationAdvice = await CommunicationAdvisorAgent(contactContext, persona);
    console.log("Communication recommendations complete");
    
    const result: CustomerPersonaResult = {
      persona,
      communicationAdvice
    };
    
    console.log("Customer Persona Builder process complete");
    return result;
  } catch (error) {
    console.error("Error in Customer Persona Builder process:", error);
    throw error;
  }
} 
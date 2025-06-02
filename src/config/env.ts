// Environment variables configuration
// This file centralizes access to environment variables and provides fallbacks

/**
 * OpenAI API Key
 * Required for all AI features including:
 * - Deal Coach
 * - Win-Loss Explainer
 * - Objection Handler
 * - Customer Persona Builder
 * - Vector embeddings
 */
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 
  "your_open_api_key";

/**
 * ChromaDB configuration
 * URL for the vector database used to store and query embeddings
 * Default is localhost:8000 for local development
 */
export const CHROMA_DB_URL = import.meta.env.VITE_CHROMA_DB_URL || "http://localhost:8000";

/**
 * Collection names for ChromaDB
 * These define the namespaces for different vector collections
 */
export const DEALS_COLLECTION = "deals";

/**
 * Function to check if environment is properly configured
 * Returns an object with:
 * - isValid: boolean indicating if all required variables are set
 * - issues: array of strings describing configuration problems
 * 
 * Usage:
 * const envCheck = checkEnvironment();
 * if (!envCheck.isValid) {
 *   console.error("Environment issues:", envCheck.issues);
 * }
 */
export function checkEnvironment(): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_open_api_key") {
    issues.push("OpenAI API Key is not configured");
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
} 
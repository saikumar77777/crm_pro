// Objection Handler Recommender System using OpenAI SDK v4+ with Agent Architecture
// Agents:
// 1. OrchestratorAgent: Manages the loop and coordinates agents
// 2. ResponseGeneratorAgent: Creates convincing responses
// 3. CustomerSimulatorAgent: Returns { is_convinced: boolean, rationale: string }
// 4. FinalResponseAgent: Refines and matches tone to objection

import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env';
import { getDealCoachContext } from './createEmbeddings';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allow API usage in browser environment
});

// Define interfaces for type safety
interface CustomerFeedback {
  is_convinced: boolean;
  rationale: string;
}

interface ObjectionHandlerResult {
  attempts: number;
  finalResponse: string;
  wasConvinced: boolean;
  rawResponse: string;
  rationale: string | null;
}

// Utility: Makes chat completion call with enforced brevity
async function callAgent(systemPrompt: string, userPrompt: string, model: string = 'gpt-4o') {
  console.log(`Calling agent with system prompt: ${systemPrompt.substring(0, 50)}...`);
  console.log(`User prompt: ${userPrompt.substring(0, 50)}...`);
  
  try {
    const chat = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt + '\nRespond in ≤50 words.' },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });
    
    const response = chat.choices[0].message.content?.trim() || "";
    console.log(`Agent response: ${response}`);
    return response;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error generating response. Please try again.";
  }
}

// Agent 1: Response Generator
async function ResponseGeneratorAgent(objection: string, dealContext: any, rationale: string | null = null, iteration: number = 0) {
  const system = `You are a Response Generator for sales objections. Generate convincing responses to overcome customer objections using deal context provided.

YOUR TASK:
1. Create a persuasive response addressing the specific objection
2. Focus on value proposition and benefits
3. Use relevant context from the deal information
4. If receiving feedback, improve your response accordingly

IMPORTANT: Limit your response to exactly 50 words or less.`;

  const contextString = JSON.stringify({
    dealName: dealContext.currentDeal.name,
    dealStage: dealContext.currentDeal.stage,
    dealValue: dealContext.currentDeal.value,
    company: dealContext.currentDeal.company,
    probability: dealContext.currentDeal.probability,
    contact: dealContext.currentDeal.contact,
  });

  const user = rationale
    ? `Iteration: ${iteration + 1}/3
Customer Objection: "${objection}"
Deal Context: ${contextString}
Previous feedback: ${rationale}
Generate improved response.`
    : `Iteration: 1/3
Customer Objection: "${objection}"
Deal Context: ${contextString}
Generate initial response.`;

  console.log(`Response Generator Agent - Iteration ${iteration + 1}`);
  return await callAgent(system, user);
}

// Agent 2: Customer Simulator
async function CustomerSimulatorAgent(objection: string, response: string, dealContext: any, iteration: number) {
  const system = `You are a Customer Simulator evaluating sales responses to objections. Analyze responses as if you were the actual customer.

YOUR TASK:
1. Determine if the response would convince the customer
2. Return a structured evaluation with:
   - is_convinced: boolean (true/false)
   - rationale: brief explanation (max 50 words)

Be realistic and critical. Consider if the response addresses core concerns, provides value, and feels authentic.

IMPORTANT: Return ONLY a valid JSON object with these two fields. DO NOT use markdown formatting, code blocks, or backticks. Return raw JSON only.`;

  const contextString = JSON.stringify({
    company: dealContext.currentDeal.company,
    contact: dealContext.currentDeal.contact,
  });

  const user = `Iteration: ${iteration + 1}/3
Objection: "${objection}"
Response: "${response}"
Customer Context: ${contextString}
Evaluate if this response would convince the customer. Return JSON only without any markdown formatting or code blocks.`;

  console.log(`Customer Simulator Agent - Iteration ${iteration + 1}`);
  const output = await callAgent(system, user);
  
  try {
    // Clean the response by removing markdown code block markers if present
    const cleanedOutput = output
      .replace(/```(?:json)?\s*/g, '') // Remove opening code block markers with or without language
      .replace(/\s*```/g, '')          // Remove closing code block markers
      .trim();                         // Remove any extra whitespace
    
    console.log("Cleaned output for parsing:", cleanedOutput);
    return JSON.parse(cleanedOutput) as CustomerFeedback;
  } catch (error) {
    console.error("Error parsing Customer Simulator response:", error);
    console.error("Raw response:", output);
    return { 
      is_convinced: false, 
      rationale: 'Invalid format from simulator. Treating as not convinced.' 
    };
  }
}

// Agent 3: Final Response Matcher
async function FinalResponseAgent(objection: string, bestResponse: string, dealContext: any) {
  const system = `You are a Final Response Refiner for sales objections. Your task is to polish the best response generated through the iteration process.

YOUR TASK:
1. Review the final response from the Response Generator
2. Make minor improvements to tone, clarity, and persuasiveness
3. Ensure the response directly addresses the original objection
4. Maintain the core message and selling points

IMPORTANT: Keep the final response to exactly 50 words or less. Focus on refinement, not complete rewriting.`;

  const contextString = JSON.stringify({
    dealName: dealContext.currentDeal.name,
    dealStage: dealContext.currentDeal.stage,
    company: dealContext.currentDeal.company,
  });

  const user = `Objection: "${objection}"
Best Response: "${bestResponse}"
Deal Context: ${contextString}
Refine tone and phrasing.`;

  console.log("Final Response Agent");
  return await callAgent(system, user);
}

// Agent 4: Orchestrator
export async function ObjectionHandlerOrchestrator(objection: string, dealId: string): Promise<ObjectionHandlerResult> {
  console.log(`Starting Objection Handler process for objection: "${objection}"`);
  
  // Get deal context
  console.log(`Retrieving deal context for deal ID: ${dealId}`);
  const dealContext = await getDealCoachContext(dealId);
  console.log("Deal context retrieved");
  
  let attempt = 0;
  let rationale: string | null = null;
  let bestResponse = '';
  let isConvinced = false;

  console.log("Starting iteration process");
  while (attempt < 3) {
    console.log(`Attempt ${attempt + 1} of 3`);
    
    // Generate response
    const response = await ResponseGeneratorAgent(objection, dealContext, rationale, attempt);
    console.log(`Generated response: ${response}`);
    
    // Simulate customer feedback
    const feedback = await CustomerSimulatorAgent(objection, response, dealContext, attempt);
    console.log(`Customer feedback:`, feedback);

    bestResponse = response;
    isConvinced = feedback.is_convinced;
    rationale = feedback.rationale;

    if (isConvinced) {
      console.log("Customer convinced! Breaking iteration loop.");
      break;
    }

    attempt++;
  }

  // Final refinement
  console.log("Generating final refined response");
  const finalResponse = await FinalResponseAgent(objection, bestResponse, dealContext);

  const result: ObjectionHandlerResult = {
    attempts: attempt + 1,
    finalResponse,
    wasConvinced: isConvinced,
    rawResponse: bestResponse,
    rationale,
  };
  
  console.log("Objection Handler process complete:", result);
  return result;
}

// Export the main function
export default ObjectionHandlerOrchestrator; 
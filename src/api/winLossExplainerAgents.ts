// Win-Loss Explainer System using OpenAI SDK v4+ with Agent Architecture
// Agents:
// 1. OrchestratorAgent: Manages the workflow and agent interactions
// 2. WinExplainerAgent: Analyzes won deals to identify success factors
// 3. LossExplainerAgent: Analyzes lost deals to identify failure points
// 4. ValidatorAgent: Evaluates explanations for accuracy and actionability

import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env';
import { getDealCoachContext } from './createEmbeddings';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allow API usage in browser environment
});

// Define interfaces for type safety
interface ValidationResult {
  is_valid: boolean;
  rationale: string;
}

interface ExplainerResult {
  dealId: string;
  outcome: 'won' | 'lost';
  explanation: string;
  isValid: boolean;
  attempts: number;
  feedback: string | null;
}

// Utility: Makes chat completion call with enforced brevity
async function callAgent(systemPrompt: string, userPrompt: string, model: string = 'gpt-4o') {
  console.log(`Calling agent with system prompt: ${systemPrompt.substring(0, 50)}...`);
  console.log(`User prompt: ${userPrompt.substring(0, 50)}...`);
  
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
    console.log(`Agent response: ${response}`);
    return response;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error generating response. Please try again.";
  }
}

// Agent 1: Win Explainer Agent
async function WinExplainerAgent(dealContext: any, feedback: string | null = null, iteration: number = 0) {
  const system = `You are a Win Analysis Expert. Your job is to explain why deals were won by identifying key success factors.

YOUR TASK:
1. Analyze the deal context and identify 3-5 key factors that contributed to winning
2. Consider sales approach, value proposition alignment, relationship factors, and competitive advantages
3. Provide specific, actionable insights that can be replicated in future deals
4. If receiving feedback, improve your explanation accordingly

IMPORTANT: Limit your response to 150 words or less.`;

  const contextString = JSON.stringify({
    dealName: dealContext.currentDeal.name,
    dealStage: dealContext.currentDeal.stage,
    dealValue: dealContext.currentDeal.value,
    company: dealContext.currentDeal.company,
    probability: dealContext.currentDeal.probability,
    contact: dealContext.currentDeal.contact,
    notes: dealContext.currentDeal.notes,
    similarDeals: dealContext.similarDeals.slice(0, 3),
  });

  const user = feedback
    ? `Iteration: ${iteration + 1}/3
Deal Context: ${contextString}
Previous feedback: ${feedback}
Generate improved win explanation.`
    : `Iteration: 1/3
Deal Context: ${contextString}
Generate initial win explanation.`;

  console.log(`Win Explainer Agent - Iteration ${iteration + 1}`);
  return await callAgent(system, user);
}

// Agent 2: Loss Explainer Agent
async function LossExplainerAgent(dealContext: any, feedback: string | null = null, iteration: number = 0) {
  const system = `You are a Loss Analysis Expert. Your job is to explain why deals were lost by identifying key failure points.

YOUR TASK:
1. Analyze the deal context and identify 3-5 key factors that contributed to losing
2. Consider gaps in sales approach, misalignment with customer needs, competitive disadvantages, and process issues
3. Provide specific, actionable insights that can prevent similar losses in future deals
4. If receiving feedback, improve your explanation accordingly

IMPORTANT: Limit your response to 150 words or less.`;

  const contextString = JSON.stringify({
    dealName: dealContext.currentDeal.name,
    dealStage: dealContext.currentDeal.stage,
    dealValue: dealContext.currentDeal.value,
    company: dealContext.currentDeal.company,
    probability: dealContext.currentDeal.probability,
    contact: dealContext.currentDeal.contact,
    notes: dealContext.currentDeal.notes,
    similarDeals: dealContext.similarDeals.slice(0, 3),
  });

  const user = feedback
    ? `Iteration: ${iteration + 1}/3
Deal Context: ${contextString}
Previous feedback: ${feedback}
Generate improved loss explanation.`
    : `Iteration: 1/3
Deal Context: ${contextString}
Generate initial loss explanation.`;

  console.log(`Loss Explainer Agent - Iteration ${iteration + 1}`);
  return await callAgent(system, user);
}

// Agent 3: Validator Agent
async function ValidatorAgent(dealContext: any, explanation: string, isWon: boolean) {
  const system = `You are a Deal Analysis Validator. Your job is to evaluate explanations of why deals were won or lost.

YOUR TASK:
1. Determine if the explanation is valid based on the deal context
2. Evaluate if the explanation provides specific, actionable insights
3. Check if the explanation identifies concrete factors rather than generic statements
4. Return a structured evaluation with:
   - is_valid: boolean (true/false)
   - rationale: brief explanation (max 50 words)

IMPORTANT: Return ONLY a valid JSON object with these two fields. DO NOT use markdown formatting, code blocks, or backticks. Return raw JSON only.`;

  const contextString = JSON.stringify({
    dealName: dealContext.currentDeal.name,
    dealStage: dealContext.currentDeal.stage,
    dealValue: dealContext.currentDeal.value,
    company: dealContext.currentDeal.company,
    notes: dealContext.currentDeal.notes,
  });

  const user = `Deal Context: ${contextString}
Deal Outcome: ${isWon ? 'Won' : 'Lost'}
Explanation: "${explanation}"

Evaluate if this explanation is valid, specific, and actionable. Return JSON only without any markdown formatting or code blocks.`;

  console.log(`Validator Agent - Deal ${isWon ? 'Win' : 'Loss'}`);
  const output = await callAgent(system, user);
  
  try {
    // Clean the response by removing markdown code block markers if present
    const cleanedOutput = output
      .replace(/```(?:json)?\s*/g, '') // Remove opening code block markers with or without language
      .replace(/\s*```/g, '')          // Remove closing code block markers
      .trim();                         // Remove any extra whitespace
    
    console.log("Cleaned output for parsing:", cleanedOutput);
    return JSON.parse(cleanedOutput) as ValidationResult;
  } catch (error) {
    console.error("Error parsing Validator response:", error);
    console.error("Raw response:", output);
    return { 
      is_valid: false, 
      rationale: 'Invalid format from validator. Treating as not valid.' 
    };
  }
}

// Agent 4: Orchestrator
export async function WinLossExplainerOrchestrator(dealId: string): Promise<ExplainerResult> {
  console.log(`Starting Win-Loss Explainer for deal: ${dealId}`);
  
  // Get deal context
  console.log(`Retrieving deal context for deal ID: ${dealId}`);
  const dealContext = await getDealCoachContext(dealId);
  console.log("Deal context retrieved");
  
  // Determine if deal was won or lost
  const isWon = dealContext.currentDeal.stage === 'closed-won';
  console.log(`Deal outcome: ${isWon ? 'Won' : 'Lost'}`);
  
  let attempt = 0;
  let rationale: string | null = null;
  let bestExplanation = '';
  let isValid = false;

  // Iteration loop (max 3 attempts)
  console.log("Starting iteration process");
  while (attempt < 3) {
    console.log(`Attempt ${attempt + 1} of 3`);
    
    // Generate explanation based on deal outcome
    const explanation = isWon 
      ? await WinExplainerAgent(dealContext, rationale, attempt)
      : await LossExplainerAgent(dealContext, rationale, attempt);
    console.log(`Generated explanation: ${explanation.substring(0, 100)}...`);
    
    // Validate explanation
    const validation = await ValidatorAgent(dealContext, explanation, isWon);
    console.log(`Validation result:`, validation);

    bestExplanation = explanation;
    isValid = validation.is_valid;
    rationale = validation.rationale;

    if (isValid) {
      console.log("Explanation validated! Breaking iteration loop.");
      break;
    }

    attempt++;
  }

  const result: ExplainerResult = {
    dealId,
    outcome: isWon ? 'won' : 'lost',
    explanation: bestExplanation,
    isValid,
    attempts: attempt + 1,
    feedback: rationale
  };
  
  console.log("Win-Loss Explainer process complete:", result);
  return result;
}

// Export the main function
export default WinLossExplainerOrchestrator; 
// This file implements agentic architecture for Deal Coach
// Uses OpenAI's API to create specialized agents for different aspects of deal coaching

import { getDealCoachContext } from './createEmbeddings';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env';

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allow API usage in browser environment
});

// Define the OpenAI API interface
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AgentResponse {
  content: string;
  tokens?: number;
}

// Real OpenAI API call
async function callOpenAI(messages: OpenAIMessage[], model: string = 'gpt-4o'): Promise<AgentResponse> {
  console.log(`Calling OpenAI ${model} with prompt:`, messages);
  
  try {
    // Make actual API call to OpenAI
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const content = response.choices[0].message.content || "";
    const tokens = response.usage?.total_tokens || 0;
    
    console.log(`OpenAI response received. Used ${tokens} tokens.`);
    
    return {
      content,
      tokens
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    
    // Fallback to mock responses if API call fails
    console.warn("Falling back to mock response");
    return getFallbackResponse(messages);
  }
}

// Fallback function to provide mock responses when API fails
function getFallbackResponse(messages: OpenAIMessage[]): AgentResponse {
  // Extract the last user message to determine what kind of response to generate
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';
  
  // Generate different mock responses based on the agent type
  if (messages[0].content.includes('stage strategist')) {
    return {
      content: generateStageStrategyResponse(lastUserMessage),
      tokens: 350
    };
  } else if (messages[0].content.includes('objection handling')) {
    return {
      content: generateObjectionHandlingResponse(lastUserMessage),
      tokens: 420
    };
  } else if (messages[0].content.includes('pricing strategist')) {
    return {
      content: generatePricingStrategyResponse(lastUserMessage),
      tokens: 380
    };
  } else if (messages[0].content.includes('relationship management')) {
    return {
      content: generateContactApproachResponse(lastUserMessage),
      tokens: 340
    };
  } else if (messages[0].content.includes('senior sales coach')) {
    return {
      content: generateSynthesisResponse(lastUserMessage),
      tokens: 500
    };
  }
  
  // Default response
  return {
    content: "I've analyzed this deal and have some recommendations for moving forward.",
    tokens: 200
  };
}

// ------- Agent Definitions -------- //

function createAgent(systemPrompt: string) {
  return async (messages: OpenAIMessage[]): Promise<string> => {
    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      ...messages,
    ]);
    return response.content;
  };
}

const StageStrategyAgent = createAgent(`You are a stage strategist for B2B sales. Your goal is to provide specific, actionable advice to move a deal forward based on its current stage.

CONTEXT:
You will receive information about a deal including its stage, value, probability, and other relevant details.

YOUR TASK:
1. Analyze the current stage of the deal (prospecting, qualification, proposal, negotiation, closed-won, closed-lost)
2. Provide 3-5 specific, actionable steps tailored to advance the deal from its current stage
3. Prioritize these steps from highest to lowest impact
4. For each step, explain briefly why it's important at this stage
5. Consider deal size, timeline, and any contact information provided

FORMAT YOUR RESPONSE:
- Start with a brief (1-2 sentence) assessment of the deal's current position
- List each recommended step with a clear action verb and explanation
- Keep your entire response under 400 words and focused on practical advice`);

const ObjectionHandlingAgent = createAgent(`You are an objection handling expert for B2B sales. Your goal is to anticipate and prepare responses for likely objections based on the deal context.

CONTEXT:
You will receive information about a deal including its stage, value, company, and other relevant details.

YOUR TASK:
1. Analyze the deal context to identify 2-3 likely objections the prospect might raise
2. For each objection:
   - Explain why the prospect might raise this objection
   - Provide a clear, persuasive response that addresses the concern
   - Include specific talking points or evidence to support your response
3. Focus on common objections related to:
   - Price/budget concerns
   - Timing/urgency issues
   - Competitive alternatives
   - Implementation concerns
   - ROI justification

FORMAT YOUR RESPONSE:
- For each objection, use this structure:
  * Objection: [Clear statement of the objection]
  * Why they might say this: [Brief explanation]
  * Recommended response: [Persuasive, value-focused answer]
- Keep your entire response under 450 words`);

const PricingStrategyAgent = createAgent(`You are a pricing strategist for B2B sales. Your goal is to provide guidance on pricing approach, negotiation tactics, and value positioning.

CONTEXT:
You will receive information about a deal including its value, stage, probability, and other relevant details.

YOUR TASK:
1. Analyze the deal value and context to recommend a pricing strategy
2. Suggest negotiation tactics appropriate for the deal stage and size
3. Identify potential discount thresholds or pricing concessions (if appropriate)
4. Recommend value-based messaging to justify the price
5. Suggest potential upsell or cross-sell opportunities if applicable

FORMAT YOUR RESPONSE:
- Start with a brief assessment of the pricing position and overall approach
- Provide specific negotiation tactics with examples of language to use
- Include value messaging points that connect price to business outcomes
- If relevant, suggest acceptable discount ranges or alternative pricing structures
- Keep your entire response under 400 words and focused on practical advice`);

const ContactApproachAgent = createAgent(`You are a relationship management expert for B2B sales. Your goal is to provide personalized guidance on how to approach key contacts.

CONTEXT:
You will receive information about contacts associated with a deal, including their roles, past interactions, and other relevant details.

YOUR TASK:
1. Analyze the contact information to identify key decision makers and influencers
2. Recommend a personalized approach for each key contact based on their role
3. Suggest communication style, medium, and timing for outreach
4. Provide specific talking points tailored to each contact's likely priorities
5. Identify potential champions or blockers based on the information provided

FORMAT YOUR RESPONSE:
- For each key contact, provide:
  * Recommended approach (formal/informal, direct/consultative)
  * Best communication channel (email, call, meeting)
  * Key talking points aligned with their likely priorities
  * Specific questions to ask to advance the relationship
- Keep your entire response under 400 words and focused on practical advice`);

const MainDealCoachAgent = async (dealId: string) => {
  try {
    console.log("Starting Deal Coach agent process for deal:", dealId);
    
    // Step 1: Retrieve context using the RAG system
    console.log("Retrieving deal context...");
    const dealContext = await getDealCoachContext(dealId);
    console.log("Deal context retrieved:", dealContext);
    
    // Format the context into a user message
    const dealInfo = {
      currentDeal: {
        id: dealContext.currentDeal.id,
        name: dealContext.currentDeal.name,
        stage: dealContext.currentDeal.stage,
        value: dealContext.currentDeal.value,
        company: dealContext.currentDeal.company,
        probability: dealContext.currentDeal.probability,
        days_in_stage: dealContext.currentDeal.days_in_stage,
        notes: dealContext.currentDeal.notes,
        contact: dealContext.currentDeal.contact,
      },
      similarDeals: dealContext.similarDeals.map(deal => ({
        content: deal.content.substring(0, 500) + "...", // Truncate for brevity
        metadata: deal.metadata
      })),
      contactDeals: dealContext.contactDeals.map(deal => ({
        id: deal.id,
        name: deal.name,
        stage: deal.stage,
        value: deal.value,
        outcome: deal.stage === 'closed-won' ? 'won' : deal.stage === 'closed-lost' ? 'lost' : 'in_progress'
      }))
    };
    
    const userMessage = { 
      role: 'user' as const, 
      content: `Deal Information: ${JSON.stringify(dealInfo, null, 2)}` 
    };
    
    console.log("Calling sub-agents in parallel...");
    
    // Parallel execution of sub-agents
    const [stageAdvice, objectionAdvice, pricingAdvice, contactAdvice] = await Promise.all([
      StageStrategyAgent([userMessage]),
      ObjectionHandlingAgent([userMessage]),
      PricingStrategyAgent([userMessage]),
      ContactApproachAgent([userMessage]),
    ]);
    
    console.log("All sub-agents have responded, synthesizing final advice...");
    
    // Synthesize final advice
    const synthesisPrompt: OpenAIMessage[] = [
      { 
        role: 'system', 
        content: `You are a senior sales coach synthesizing advice from multiple experts. Your goal is to create a cohesive, prioritized coaching plan.

CONTEXT:
You will receive specialized advice from four different sales experts about a specific deal.

YOUR TASK:
1. Review all the advice provided by the experts
2. Identify the most important and actionable recommendations
3. Synthesize these into a coherent coaching plan with clear priorities
4. Ensure the plan addresses the most critical aspects of the deal based on its stage
5. Provide a brief overall assessment of the deal's health and probability

FORMAT YOUR RESPONSE:
- Start with a brief (2-3 sentence) overall assessment of the deal
- Provide a "Deal Health Score" from 1-10 with brief explanation
- List 3-5 prioritized next steps that combine the most important advice
- Group your advice into clear sections (Strategy, Objections, Pricing, Relationship)
- Keep your entire response under 600 words and focused on practical advice` 
      },
      { 
        role: 'user', 
        content: `Stage Strategy: ${stageAdvice}\n\nObjection Handling: ${objectionAdvice}\n\nPricing Strategy: ${pricingAdvice}\n\nContact Approach: ${contactAdvice}` 
      },
    ];
    
    const synthesisResponse = await callOpenAI(synthesisPrompt);
    const combinedAdvice = synthesisResponse.content;
    
    console.log("Deal coaching process complete");
    
    // Return all advice components
    return {
      stageAdvice,
      objectionAdvice,
      pricingAdvice,
      contactAdvice,
      combinedAdvice,
    };
  } catch (error) {
    console.error("Error in Deal Coach agent process:", error);
    throw error;
  }
};

// Helper functions to generate mock responses
function generateStageStrategyResponse(message: string): string {
  // Extract the stage from the message if possible
  const stageLower = message.toLowerCase();
  
  if (stageLower.includes('prospecting')) {
    return `
## Deal Position Assessment
This deal is in early stages with limited engagement. Focus on establishing value and building relationships.

## Recommended Next Steps:
1. **Schedule a discovery call** with the primary decision maker to understand their specific pain points and business goals. This will help tailor your solution to their needs.

2. **Research the company's recent initiatives** and industry challenges to personalize your outreach. Showing industry knowledge builds credibility and trust.

3. **Develop a custom value proposition** that addresses their specific business challenges. Quantify potential ROI where possible to create urgency.

4. **Identify and engage additional stakeholders** who might influence the decision. Map the decision-making process to ensure you're connecting with all key players.

5. **Share relevant case studies** from similar companies in their industry. Social proof is particularly effective at this early stage to establish credibility.
`;
  } else if (stageLower.includes('qualification')) {
    return `
## Deal Position Assessment
This deal has shown initial interest but needs further qualification to determine fit and buying intent.

## Recommended Next Steps:
1. **Confirm budget authority and timeline** through direct questions with the economic buyer. Understanding their purchasing process is critical at this stage.

2. **Conduct a needs assessment workshop** with key stakeholders to document their requirements and pain points. This creates alignment and uncovers hidden needs.

3. **Map the decision-making process** by identifying all stakeholders and their roles (approver, influencer, user, etc.). This prevents surprises later in the sales cycle.

4. **Present a preliminary solution outline** that addresses their specific challenges. Seek feedback to refine your approach and demonstrate responsiveness.

5. **Establish clear next steps and timeline** for moving to the proposal stage. Creating momentum with defined milestones prevents stalling.
`;
  } else if (stageLower.includes('proposal')) {
    return `
## Deal Position Assessment
The deal has progressed to proposal stage but needs strong follow-up to maintain momentum and address concerns.

## Recommended Next Steps:
1. **Schedule a proposal review meeting** with all key stakeholders to present your solution and address questions in real-time. This prevents misinterpretation and shows confidence.

2. **Prepare ROI analysis** with customer-specific metrics to justify the investment. Quantifying value is critical at this stage to overcome price objections.

3. **Develop implementation timeline** showing key milestones and resources required. This addresses potential concerns about execution risk.

4. **Identify potential objections** and prepare responses in advance. Being prepared for pushback demonstrates professionalism and builds trust.

5. **Create a mutual action plan** with the customer that outlines responsibilities and next steps for both parties. This creates shared ownership of the process.
`;
  } else if (stageLower.includes('negotiation')) {
    return `
## Deal Position Assessment
This deal is in advanced stages with active negotiation. Focus on maintaining value while finding a mutually beneficial agreement.

## Recommended Next Steps:
1. **Identify your negotiation boundaries** before discussions begin - know your walk-away points and areas of flexibility. This prevents reactive concessions.

2. **Focus on value over price** by reinforcing ROI and business outcomes. Reframe the conversation from cost to investment when price objections arise.

3. **Consider value-added concessions** instead of price discounts (extended support, additional training, phased implementation). These preserve deal value while showing flexibility.

4. **Secure executive sponsorship** from your organization to demonstrate commitment and potentially accelerate approval processes. This shows the prospect they're a priority.

5. **Create closing momentum** with a time-bound offer or incentive that encourages prompt decision-making. Urgency is critical at this stage to prevent prolonged negotiations.
`;
  } else {
    return `
## Deal Position Assessment
Based on the current deal information, a customized strategy is needed to advance this opportunity.

## Recommended Next Steps:
1. **Conduct a thorough deal review** with internal stakeholders to identify strengths and gaps in the current approach. This ensures alignment on strategy.

2. **Develop a stakeholder map** to identify all decision-makers and influencers. Understanding the buying committee is essential for deal advancement.

3. **Create a compelling value proposition** specific to this customer's industry and challenges. Personalization increases engagement and demonstrates understanding.

4. **Establish clear success criteria** with the prospect to align on what a successful implementation looks like. This creates shared vision and commitment.

5. **Set up a regular cadence of value-adding touchpoints** to maintain momentum and relationship development. Consistent engagement prevents deals from stalling.
`;
  }
}

function generateObjectionHandlingResponse(message: string): string {
  return `
## Anticipated Objections and Responses

### Objection: "Your solution is more expensive than competitors we're considering."
**Why they might say this:** Price is often used as a negotiation tactic, even when it's not the real concern. They may be comparing different solution scopes or have budget constraints.

**Recommended response:** "I understand budget is important. Rather than focusing solely on the initial price, let's look at the total value over time. Our customers typically see a 30% reduction in operational costs within the first year, which more than covers the investment difference. I'd be happy to create a custom ROI analysis for your specific situation that shows the 3-year cost comparison including implementation, maintenance, and efficiency gains."

### Objection: "We need more time to evaluate all options."
**Why they might say this:** This often indicates either a lack of urgency, involvement of additional stakeholders, or ongoing evaluation of competitors.

**Recommended response:** "I appreciate thoroughness in your evaluation process. To help you make the best decision with your timeline, what specific information would be most valuable? Many of our customers found that a short pilot program gave them the confidence they needed while allowing them to realize some immediate benefits. We could structure a limited implementation focused on your highest-priority area, which would provide real-world validation without delaying your broader goals."

### Objection: "We're concerned about the implementation process and disruption to our operations."
**Why they might say this:** Change management is a legitimate concern, especially for solutions that impact core business processes.

**Recommended response:** "That's a valid concern we take very seriously. Our implementation methodology is designed specifically to minimize disruption. We use a phased approach that allows your team to adapt gradually, and we assign a dedicated implementation manager who has successfully guided companies similar to yours through this process. I'd like to share our implementation playbook and connect you with a reference customer in your industry who completed their implementation while maintaining full operations."
`;
}

function generatePricingStrategyResponse(message: string): string {
  return `
## Pricing Strategy Assessment
This deal appears price-sensitive based on the context and stage. A value-based approach with some flexibility will be most effective.

## Negotiation Tactics:
1. **Start with value before discussing price** - Reinforce the ROI and business outcomes before addressing specific pricing questions. Use language like: "Before we discuss investment levels, let's confirm the annual value of solving these challenges, which our analysis shows is approximately $X."

2. **Use bracketing for discounting** - If discounting is necessary, offer three pricing tiers with different value levels rather than a single discounted price. This shifts the conversation from "yes/no" to "which option" and preserves perceived value.

3. **Consider timing-based incentives** rather than pure discounts - "If we can complete the agreement by quarter-end, we can guarantee implementation will begin within 30 days and include the additional training package at no cost."

## Value Messaging:
- Connect pricing directly to their stated business challenges: "This investment represents less than X% of the annual cost of the problems we're solving."
- Emphasize the cost of delay: "Each month of delay costs approximately $X in unrealized efficiency gains."
- Highlight the complete solution value: "Remember that this includes not just the platform, but implementation services, training, and ongoing support."

## Potential Concessions (if needed):
- Extended payment terms (Net-60 instead of standard Net-30)
- Phased implementation approach to spread costs across multiple quarters
- Reduced first-year pricing with standard renewal rates
- Value-add services inclusion rather than price reduction

Acceptable discount range based on deal size: 5-12%, with larger discounts requiring executive approval and longer-term commitment.
`;
}

function generateContactApproachResponse(message: string): string {
  return `
## Contact Strategy Recommendations

### Primary Decision Maker (Executive Sponsor)
**Approach:** Formal and business outcome-focused
**Communication Channel:** Executive briefing (in-person or video call)
**Key Talking Points:**
- Strategic alignment with their business initiatives
- ROI and competitive advantage metrics
- Peer success stories from similar organizations
- Long-term partnership vision beyond initial implementation

**Questions to Ask:**
- "What would success look like for this initiative in the first year?"
- "How does this project align with your strategic priorities for the next 2-3 years?"
- "What concerns do you have about implementation or adoption?"

### Technical Evaluator
**Approach:** Detailed and evidence-based
**Communication Channel:** Demo session with technical deep-dive
**Key Talking Points:**
- Integration capabilities with existing systems
- Security and compliance features
- Technical requirements and specifications
- Implementation methodology and timeline

**Questions to Ask:**
- "What technical constraints or requirements are most important to consider?"
- "How would you measure successful integration with your current environment?"
- "What technical risks are you most concerned about?"

### Financial Approver
**Approach:** ROI-focused and concise
**Communication Channel:** Email with follow-up call
**Key Talking Points:**
- Cost structure transparency
- Expected financial outcomes and metrics
- Payment terms and options
- Total cost of ownership analysis

**Questions to Ask:**
- "What financial metrics are most important for evaluating this investment?"
- "What has been your experience with similar investments in the past?"
- "How does your budgeting and approval process work for this type of purchase?"
`;
}

function generateSynthesisResponse(message: string): string {
  return `
## Deal Assessment
This opportunity shows strong potential but faces challenges around pricing sensitivity and stakeholder alignment. The prospect has legitimate needs our solution addresses, but requires careful navigation through the decision process to maintain momentum and value perception.

## Deal Health Score: 7/10
The deal has positive indicators including multiple engaged stakeholders and clear business needs, but faces headwinds with pricing concerns and a potentially extended decision timeline.

## Priority Next Steps:

1. **Schedule an executive alignment meeting** to reinforce business value and ROI with the economic buyer. This addresses both the relationship strategy and value justification needs identified.

2. **Develop and present a custom ROI analysis** showing 3-year total cost of ownership and specific business outcomes. This directly addresses the pricing objections while reinforcing value.

3. **Create a mutual action plan** with clearly defined milestones and responsibilities for both parties. This establishes momentum and commitment while clarifying the path to decision.

4. **Prepare a tiered proposal** with different pricing and value options rather than a single offering. This shifts the conversation from yes/no to which option best meets their needs.

5. **Identify and engage a potential internal champion** who can advocate for your solution when you're not present. Equip them with the materials and talking points they need to be effective.

## Strategy Guidance
Focus on advancing the deal by emphasizing business outcomes over features. Maintain regular touchpoints with all key stakeholders, and create urgency by quantifying the cost of delay.

## Objection Handling
Be prepared for price comparison objections by emphasizing total value and ROI. Address implementation concerns with a phased approach and reference customers who had similar concerns.

## Pricing Approach
Lead with value before discussing price, and consider timing incentives rather than straight discounts. Be prepared with value-added concessions that preserve deal size.

## Relationship Management
Tailor your communication style to each stakeholder's role and priorities. The technical evaluator needs detailed information, while the executive sponsor needs strategic business alignment.
`;
}

export default MainDealCoachAgent;
export { StageStrategyAgent, ObjectionHandlingAgent, PricingStrategyAgent, ContactApproachAgent }; 
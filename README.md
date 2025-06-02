# AI-Powered CRM Application

This project is a modern CRM (Customer Relationship Management) application built with React, TypeScript, and Supabase, featuring AI-powered capabilities to enhance sales and customer management.

## Features

### Core CRM Functionality
- **Contact Management**: Store and organize detailed customer information
- **Deal Pipeline**: Track sales opportunities through customizable stages
- **Analytics Dashboard**: Visualize performance metrics and sales data
- **User Authentication**: Secure login and role-based access

### AI-Powered Add-ons

1. **Deal Coach AI**
   - Click on any deal to get AI-generated next steps
   - Provides customized suggestions based on deal stage, value, and probability
   - Helps improve close probability with actionable recommendations

2. **Customer Persona Builder**
   - Automatically generates behavioral profiles for leads based on interaction history
   - Identifies communication preferences, decision factors, and pain points
   - Provides insights to help tailor your approach to each contact

3. **Objection Handler Recommender**
   - Paste customer objections to receive AI-suggested convincing responses
   - Categorizes objections by type (price, competitor, timing, etc.)
   - Offers multiple response options with different approaches

4. **Win-Loss Explainer**
   - Analyzes why deals were won or lost based on data patterns
   - Identifies key success factors and loss factors
   - Provides actionable recommendations to improve win rates

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL, Authentication)
- **State Management**: React Query, Custom Hooks
- **Routing**: React Router
- **AI Integration**: OpenAI API, LangChain, ChromaDB for vector embeddings

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- ChromaDB (optional, for vector embeddings)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd crm-ai-application
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with your API keys and configurations:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_CHROMA_DB_URL=http://localhost:8000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Environment Configuration

The application uses a centralized environment configuration system in `src/config/env.ts`. This file:

- Provides a single point of access for all environment variables
- Includes fallback values for development and testing
- Exports configuration constants used throughout the application
- Contains a validation function to check if the environment is properly configured

### Key Environment Variables

- **OPENAI_API_KEY**: Required for all AI features (Deal Coach, Persona Builder, etc.)
- **CHROMA_DB_URL**: URL for the ChromaDB vector database (defaults to localhost:8000)
- **DEALS_COLLECTION**: Collection name for storing deal embeddings in ChromaDB

### Environment Validation

The application includes a `checkEnvironment()` function that validates whether all required environment variables are properly configured. This helps prevent runtime errors due to missing API keys or configuration values.

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Main application pages
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and configurations
  - `/integrations`: External service integrations
  - `/config`: Configuration files including environment variables
  - `/api`: API integration and AI agent implementations

## AI Features Implementation

### Deal Coach AI
Located in the DealDetails page, this feature analyzes the current deal and provides tailored suggestions to increase close probability based on the deal's stage, value, and other factors.

### Customer Persona Builder
Accessible from the Contacts page by clicking the "AI Persona" button on any contact. It generates a comprehensive behavioral profile including communication style, decision factors, pain points, and personality traits.

### Objection Handler Recommender
Found in the Communications page under the "Objection Handler" tab. Users can input customer objections and receive AI-generated response suggestions tailored to the specific type of objection.

### Win-Loss Explainer
Located in the DealsAnalytics page, this tool analyzes closed deals to identify patterns in won and lost opportunities, providing insights and recommendations to improve future performance.

## AI Agent Architecture

The application implements a sophisticated multi-agent architecture:

1. **Deal Coach Agents**: A system of specialized agents (StageStrategyAgent, ObjectionHandlingAgent, PricingStrategyAgent, ContactApproachAgent) that work together to provide comprehensive deal coaching.

2. **Win-Loss Explainer Agents**: Analyzes why deals were won or lost using WinExplainerAgent, LossExplainerAgent, and ValidatorAgent in an iterative improvement process.

3. **Objection Handler Agents**: Generates convincing responses to customer objections with a feedback loop from a CustomerSimulatorAgent.

4. **Customer Persona Agents**: Builds customer personas using ProfileAnalyzerAgent, PersonaGeneratorAgent, and CommunicationAdvisorAgent.

## Vector Embedding System

The application uses vector embeddings to enable semantic search and similarity matching:

1. **Embedding Creation**: Converts deal data into vector embeddings using OpenAI's embedding API
2. **Storage Options**: 
   - ChromaDB (primary vector database)
   - LocalStorage (fallback)
   - In-memory store (runtime only)
3. **Similarity Search**: Finds semantically similar deals to provide context for AI agents
4. **RAG Implementation**: Retrieval-Augmented Generation for more accurate and contextual AI responses

## License

[MIT License](LICENSE)

## Acknowledgments

- This project was created as an assignment for demonstrating AI integration in business applications
- UI design inspired by modern SaaS applications
- AI features designed to solve real sales and customer management challenges

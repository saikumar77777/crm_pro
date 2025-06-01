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
- **AI Integration**: Simulated AI responses (can be connected to real AI services)

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

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
Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Main application pages
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions and configurations
  - `/integrations`: External service integrations

## AI Features Implementation

### Deal Coach AI
Located in the DealDetails page, this feature analyzes the current deal and provides tailored suggestions to increase close probability based on the deal's stage, value, and other factors.

### Customer Persona Builder
Accessible from the Contacts page by clicking the "AI Persona" button on any contact. It generates a comprehensive behavioral profile including communication style, decision factors, pain points, and personality traits.

### Objection Handler Recommender
Found in the Communications page under the "Objection Handler" tab. Users can input customer objections and receive AI-generated response suggestions tailored to the specific type of objection.

### Win-Loss Explainer
Located in the DealsAnalytics page, this tool analyzes closed deals to identify patterns in won and lost opportunities, providing insights and recommendations to improve future performance.

## Connecting to Real AI Services

The current implementation uses simulated AI responses. To connect to real AI services:

1. Create an account with an AI provider (OpenAI, Azure AI, etc.)
2. Obtain API keys and configure them in your environment
3. Modify the AI feature components to make actual API calls instead of using the simulated responses

## License

[MIT License](LICENSE)

## Acknowledgments

- This project was created as an assignment for demonstrating AI integration in business applications
- UI design inspired by modern SaaS applications
- AI features designed to solve real sales and customer management challenges

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, User2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerPersonaBuilderProps {
  contact: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    company: string | null;
    position: string | null;
    status: string | null;
    notes: string | null;
    created_at: string;
  };
}

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

const CustomerPersonaBuilder: React.FC<CustomerPersonaBuilderProps> = ({ contact }) => {
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePersona = async () => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an AI service with contact data
      // For now, we'll simulate the AI response based on contact information
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate persona based on available contact information
      const mockPersona: PersonaData = {
        summary: `${contact.first_name} is a ${getRandomPersonaType()} who values ${getRandomValue()} and prioritizes ${getRandomPriority()}.`,
        communicationStyle: getRandomCommunicationStyle(),
        decisionFactors: `Primary focus on ${getRandomDecisionFactor()}. Needs to see ${getRandomProof()} before making decisions.`,
        painPoints: [
          getRandomPainPoint(),
          getRandomPainPoint(),
          getRandomPainPoint()
        ],
        interests: [
          getRandomInterest(),
          getRandomInterest(),
          getRandomInterest()
        ],
        traits: [
          {
            trait: "Analytical Thinking",
            description: "Prefers data-driven discussions with clear metrics",
            confidence: Math.floor(Math.random() * 30) + 70
          },
          {
            trait: "Risk Tolerance",
            description: contact.position?.includes("Director") || contact.position?.includes("CEO") 
              ? "Comfortable with calculated risks" 
              : "Prefers proven solutions with minimal risk",
            confidence: Math.floor(Math.random() * 40) + 60
          },
          {
            trait: "Decision Speed",
            description: "Likely to need multiple touchpoints before deciding",
            confidence: Math.floor(Math.random() * 30) + 65
          }
        ]
      };
      
      setPersona(mockPersona);
      
    } catch (error) {
      console.error('Error generating persona:', error);
      toast({
        title: "Error",
        description: "Failed to generate customer persona",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper functions to generate random persona elements
  const getRandomPersonaType = () => {
    const types = ["strategic decision maker", "detail-oriented evaluator", "relationship-focused buyer", "innovative early adopter", "cautious pragmatist"];
    return types[Math.floor(Math.random() * types.length)];
  };
  
  const getRandomValue = () => {
    const values = ["efficiency", "innovation", "reliability", "cost-effectiveness", "quality", "simplicity"];
    return values[Math.floor(Math.random() * values.length)];
  };
  
  const getRandomPriority = () => {
    const priorities = ["quick implementation", "long-term partnerships", "proven results", "technical excellence", "customer service"];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };
  
  const getRandomCommunicationStyle = () => {
    const styles = [
      "Prefers direct, concise communication with focus on facts and results",
      "Values relationship building and personal connection before business discussion",
      "Responds well to detailed explanations with supporting evidence",
      "Appreciates visual presentations and demonstrations over text-heavy content",
      "Likely to ask challenging questions and require thorough answers"
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  };
  
  const getRandomDecisionFactor = () => {
    const factors = ["ROI and financial impact", "implementation ease and timeline", "alignment with current systems", "team adoption and usability", "competitive advantage"];
    return factors[Math.floor(Math.random() * factors.length)];
  };
  
  const getRandomProof = () => {
    const proofs = ["case studies", "testimonials", "live demonstrations", "free trials", "data-backed projections", "peer recommendations"];
    return proofs[Math.floor(Math.random() * proofs.length)];
  };
  
  const getRandomPainPoint = () => {
    const painPoints = [
      "Inefficient manual processes consuming too much time",
      "Lack of visibility into key performance metrics",
      "Difficulty coordinating across departments",
      "Challenges with customer retention and satisfaction",
      "Struggling to scale operations while maintaining quality",
      "Limited resources for implementing new solutions",
      "Pressure to reduce costs while improving outcomes"
    ];
    
    // Get random but unique pain points
    const randomIndex = Math.floor(Math.random() * painPoints.length);
    return painPoints[randomIndex];
  };
  
  const getRandomInterest = () => {
    const interests = [
      "Industry innovation and emerging trends",
      "Process optimization and efficiency",
      "Team development and leadership",
      "Competitive market positioning",
      "Digital transformation initiatives",
      "Sustainable business practices",
      "Customer experience enhancement"
    ];
    
    const randomIndex = Math.floor(Math.random() * interests.length);
    return interests[randomIndex];
  };

  return (
    <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary overflow-hidden">
      <CardHeader className="pb-3 border-b border-crm-tertiary">
        <CardTitle className="flex items-center text-lg font-medium text-white">
          <Brain className="w-5 h-5 mr-2 text-purple-400" />
          Customer Persona Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {!persona ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-crm-tertiary p-4 rounded-full mb-4">
              <User2 className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-crm-text-secondary text-center mb-4 max-w-md">
              Generate an AI-powered behavioral profile for {contact.first_name} based on their interaction history and available data.
            </p>
            <Button
              onClick={generatePersona}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Persona
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-2">Persona Summary</h3>
              <p className="text-crm-text-secondary bg-crm-tertiary p-3 rounded-md">
                {persona.summary}
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">Communication Style</h3>
              <p className="text-crm-text-secondary bg-crm-tertiary p-3 rounded-md">
                {persona.communicationStyle}
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">Decision Making</h3>
              <p className="text-crm-text-secondary bg-crm-tertiary p-3 rounded-md">
                {persona.decisionFactors}
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">Pain Points</h3>
              <ul className="space-y-2">
                {persona.painPoints.map((point, index) => (
                  <li key={index} className="text-crm-text-secondary bg-crm-tertiary p-3 rounded-md">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">Professional Interests</h3>
              <ul className="space-y-2">
                {persona.interests.map((interest, index) => (
                  <li key={index} className="text-crm-text-secondary bg-crm-tertiary p-3 rounded-md">
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">Personality Traits</h3>
              <div className="space-y-4">
                {persona.traits.map((trait, index) => (
                  <div key={index} className="bg-crm-tertiary p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white">{trait.trait}</span>
                      <span className="text-xs text-crm-text-secondary">{trait.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-crm-text-secondary">{trait.description}</p>
                    <div className="w-full bg-crm-primary rounded-full h-1.5 mt-2">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${trait.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={generatePersona}
                disabled={isGenerating}
                className="border-crm-tertiary text-purple-400 hover:bg-crm-tertiary"
              >
                {isGenerating ? "Regenerating..." : "Regenerate Persona"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerPersonaBuilder; 
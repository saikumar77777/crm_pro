import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, User2, Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomerPersonaOrchestrator } from '@/api/customerPersonaAgents';

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
  const [communicationAdvice, setCommunicationAdvice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePersona = async () => {
    setIsGenerating(true);
    
    try {
      toast({
        title: "Processing",
        description: "AI agents are analyzing contact data...",
      });
      
      // Call the agentic workflow orchestrator
      const result = await CustomerPersonaOrchestrator(contact.id);
      
      setPersona(result.persona);
      setCommunicationAdvice(result.communicationAdvice);
      
      toast({
        title: "Persona Generated",
        description: "AI has created a behavioral profile based on interaction history",
      });
    } catch (error) {
      console.error("Error generating persona:", error);
      toast({
        title: "Error",
        description: "Failed to generate customer persona. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
              <h3 className="text-white font-medium mb-2">Key Traits</h3>
              <div className="space-y-3">
                {persona.traits.map((trait, index) => (
                  <div key={index} className="bg-crm-tertiary p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium">{trait.trait}</span>
                      <span className="text-xs text-crm-text-secondary">{trait.confidence}% confidence</span>
                    </div>
                    <p className="text-crm-text-secondary text-sm">{trait.description}</p>
                    <div className="mt-2 h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${trait.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {communicationAdvice && (
              <div>
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-purple-400" />
                  Communication Recommendations
                </h3>
                <div className="text-crm-text-secondary bg-crm-tertiary p-3 rounded-md whitespace-pre-line">
                  {communicationAdvice}
                </div>
              </div>
            )}
            
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => {
                  setPersona(null);
                  setCommunicationAdvice(null);
                }}
                variant="outline"
                className="border-crm-tertiary text-crm-text-secondary hover:bg-crm-tertiary/50 hover:text-white"
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerPersonaBuilder; 
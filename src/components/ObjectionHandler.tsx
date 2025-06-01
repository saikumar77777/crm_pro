import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ObjectionHandlerOrchestrator from '@/api/objectionHandlerAgents';

// Helper function to convert markdown to HTML (simplified version)
function markdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  // Basic markdown conversion
  const processed = markdown
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-bold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em class="text-blue-200">$1</em>')
    // Line breaks
    .replace(/\n/gim, '<br>');

  return `<p class="text-white">${processed}</p>`;
}

interface ObjectionHandlerProps {
  dealId: string;
  dealName: string;
}

const ObjectionHandler: React.FC<ObjectionHandlerProps> = ({ dealId, dealName }) => {
  const [objection, setObjection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!objection.trim()) {
      toast({
        title: "Error",
        description: "Please enter a customer objection",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResponse(null);
    
    try {
      toast({
        title: "Processing",
        description: "AI agents are analyzing the objection...",
      });
      
      // Call the Objection Handler Orchestrator
      const result = await ObjectionHandlerOrchestrator(objection, dealId);
      console.log("Objection handler result:", result);
      
      setResponse(result);
      
      toast({
        title: result.wasConvinced ? "Success" : "Partial Success",
        description: result.wasConvinced 
          ? "Generated a convincing response!" 
          : `Generated best possible response after ${result.attempts} attempts`,
      });
    } catch (error) {
      console.error("Error handling objection:", error);
      toast({
        title: "Error",
        description: "Failed to process objection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary overflow-hidden">
      <CardHeader className="pb-3 border-b border-crm-tertiary">
        <CardTitle className="flex items-center text-lg font-medium text-white">
          <Shield className="w-5 h-5 mr-2 text-crm-electric" />
          Objection Handler AI
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="objection" className="block text-sm font-medium text-crm-text-secondary mb-1">
                Customer Objection
              </label>
              <Textarea
                id="objection"
                placeholder="Enter the customer's objection here..."
                className="w-full bg-crm-tertiary border-crm-tertiary text-white"
                value={objection}
                onChange={(e) => setObjection(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading || !objection.trim()}
              className="w-full bg-crm-electric hover:bg-crm-electric/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Generate Response
                </>
              )}
            </Button>
          </div>
        </form>
        
        {response && (
          <div className="mt-6 space-y-4">
            <div className="bg-crm-tertiary p-4 rounded-lg border border-crm-tertiary/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Recommended Response</h3>
                <div className="flex items-center">
                  {response.wasConvinced ? (
                    <span className="flex items-center text-green-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Convincing
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-400 text-sm">
                      <XCircle className="w-4 h-4 mr-1" />
                      Partially Convincing
                    </span>
                  )}
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: markdownToHTML(response.finalResponse) }} />
              </div>
            </div>
            
            <div className="bg-crm-tertiary/50 p-4 rounded-lg border border-crm-tertiary/30">
              <h4 className="text-sm font-medium text-crm-text-secondary mb-2">Process Details</h4>
              <div className="text-sm text-crm-text-secondary">
                <p>Attempts: {response.attempts} of 3</p>
                {response.rationale && (
                  <p className="mt-2">
                    <span className="text-crm-text-white">Last feedback:</span> {response.rationale}
                  </p>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => setResponse(null)}
              variant="outline"
              className="w-full border-crm-tertiary text-crm-text-secondary hover:bg-crm-tertiary/50 hover:text-white"
            >
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectionHandler; 
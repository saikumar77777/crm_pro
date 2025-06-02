import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, FileQuestion, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import WinLossExplainerOrchestrator from '@/api/winLossExplainerAgents';

// Helper function to convert markdown to HTML (simplified version)
function markdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  // Basic markdown conversion
  const processed = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mt-5 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-6 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-bold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em class="text-blue-200">$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="text-white ml-4">$1</li>')
    .replace(/<\/li>\n<li class="text-white ml-4">/gim, '</li><li class="text-white ml-4">')
    .replace(/<\/li>\n/gim, '</li></ul>\n')
    .replace(/\n<li class="text-white ml-4">/gim, '\n<ul class="my-3 space-y-1 list-disc list-inside">$&')
    // Line breaks
    .replace(/\n/gim, '<br>');

  return `<div class="text-white">${processed}</div>`;
}

interface WinLossExplainerProps {
  dealId: string;
  dealName: string;
  dealStage: string;
}

const WinLossExplainer: React.FC<WinLossExplainerProps> = ({ dealId, dealName, dealStage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<any>(null);
  const { toast } = useToast();
  
  const isWon = dealStage === 'closed-won';

  const generateExplanation = async () => {
    setIsLoading(true);
    
    try {
      toast({
        title: `Analyzing ${isWon ? 'Win' : 'Loss'}`,
        description: `AI is analyzing why this deal was ${isWon ? 'won' : 'lost'}...`,
      });
      
      // Call the Win-Loss Explainer orchestrator
      const result = await WinLossExplainerOrchestrator(dealId);
      console.log("Win-Loss explainer result:", result);
      
      setExplanation(result);
      
      toast({
        title: "Analysis Complete",
        description: result.isValid 
          ? `AI has identified key factors in this ${isWon ? 'win' : 'loss'}` 
          : `Generated best possible explanation after ${result.attempts} attempts`,
      });
    } catch (error) {
      console.error("Error generating explanation:", error);
      toast({
        title: "Error",
        description: "Failed to analyze deal outcome. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!explanation ? (
        <div className="flex flex-col items-center text-center py-6">
          <div className={`p-4 rounded-full mb-4 ${isWon ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
            {isWon ? (
              <Trophy className={`w-8 h-8 text-green-400`} />
            ) : (
              <FileQuestion className={`w-8 h-8 text-amber-400`} />
            )}
          </div>
          
          <p className="text-crm-text-secondary mb-6 max-w-md">
            {isWon ? (
              <>Analyze why <span className="text-white font-medium">{dealName}</span> was won to replicate success in future deals.</>
            ) : (
              <>Understand why <span className="text-white font-medium">{dealName}</span> was lost to improve future outcomes.</>
            )}
          </p>
          
          <Button
            onClick={generateExplanation}
            disabled={isLoading}
            className={`${isWon 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-amber-600 hover:bg-amber-700'} text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                {isWon ? (
                  <Trophy className="w-4 h-4 mr-2" />
                ) : (
                  <FileQuestion className="w-4 h-4 mr-2" />
                )}
                Generate {isWon ? 'Win' : 'Loss'} Analysis
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg border ${
            isWon 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-medium ${isWon ? 'text-green-400' : 'text-amber-400'}`}>
                {isWon ? 'Success Factors' : 'Areas for Improvement'}
              </h3>
              {explanation.isValid ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  High Confidence
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Medium Confidence
                </Badge>
              )}
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: markdownToHTML(explanation.explanation) }} />
            </div>
          </div>
          
          <div className="bg-crm-tertiary/50 p-4 rounded-lg border border-crm-tertiary/30">
            <h4 className="text-sm font-medium text-crm-text-secondary mb-2">Analysis Details</h4>
            <div className="text-sm text-crm-text-secondary">
              <p>Attempts: {explanation.attempts} of 3</p>
              {explanation.feedback && !explanation.isValid && (
                <p className="mt-2">
                  <span className="text-crm-text-white">Note:</span> {explanation.feedback}
                </p>
              )}
            </div>
          </div>
          
          <Button
            onClick={() => setExplanation(null)}
            variant="outline"
            className={`w-full border-crm-tertiary text-crm-text-secondary hover:bg-crm-tertiary/50 hover:text-white`}
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

export default WinLossExplainer; 
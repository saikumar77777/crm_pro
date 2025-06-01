import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Target, MessageSquare, Users, CheckCircle, Loader2, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import MainDealCoachAgent from '@/api/dealCoachAgents';

// Helper function to convert markdown to HTML (simplified version)
function markdownToHTML(markdown: string): string {
  if (!markdown) return '';
  
  // Basic markdown conversion - headers, bold, italic, lists
  const processed = markdown
    // Headers - using bright colors with text shadow for better visibility
    .replace(/^### (.*$)/gim, '<h3 class="text-white text-xl font-semibold mt-6 mb-2" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-white text-2xl font-bold mt-8 mb-3" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-white text-3xl font-bold mt-6 mb-4" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">$1</h1>')
    // Bold - bright white
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-bold">$1</strong>')
    // Italic - light blue for contrast
    .replace(/\*(.*?)\*/gim, '<em class="text-blue-200">$1</em>')
    // Lists - much brighter text
    .replace(/^\- (.*$)/gim, '<li class="text-white ml-4">$1</li>')
    .replace(/<\/li>\n<li class="text-white ml-4">/gim, '</li><li class="text-white ml-4">')
    .replace(/<\/li>\n/gim, '</li></ul>\n')
    .replace(/\n<li class="text-white ml-4">/gim, '\n<ul class="my-3 space-y-2 list-disc list-inside">$&')
    // Line breaks
    .replace(/\n/gim, '<br>')
    // Numbered lists with high contrast colors
    .replace(/^(\d+)\. (.*$)/gim, '<div class="flex items-start mb-3 bg-crm-tertiary/50 p-2 rounded"><span class="text-crm-electric font-bold mr-2 text-lg">$1.</span><span class="text-white">$2</span></div>')
    // Action/Importance sections with bright colors
    .replace(/Action:/gim, '<span class="text-crm-electric font-bold text-lg">Action: </span>')
    .replace(/Importance:/gim, '<span class="text-yellow-300 font-bold">Importance: </span>')
    // Deal Health Score with prominent styling
    .replace(/Deal Health Score: (\d+)\/10/gim, '<div class="bg-crm-tertiary p-3 rounded-lg my-4"><span class="text-xl font-bold text-white">Deal Health Score: </span><span class="text-2xl font-bold text-crm-electric">$1/10</span></div>');

  // Add additional styling for paragraphs - using white text
  let result = processed.replace(/(<br>){2,}/g, '</p><p class="text-white my-3">');
  result = '<p class="text-white my-3">' + result + '</p>';
  
  // Special styling for "Overall Assessment" section
  result = result.replace(/Overall Assessment:/gim, '<div class="bg-crm-electric/20 p-3 rounded-lg mb-4"><h2 class="text-2xl font-bold text-white">Overall Assessment:</h2></div>');
  
  // Special styling for "Prioritized Next Steps" section
  result = result.replace(/Prioritized Next Steps:/gim, '<div class="bg-crm-electric/20 p-3 rounded-lg mb-4 mt-8"><h2 class="text-2xl font-bold text-white">Prioritized Next Steps:</h2></div>');
  
  // Strategy, Objections, Pricing sections with special styling
  result = result.replace(/Strategy:/gim, '<span class="text-green-400 font-bold text-lg">Strategy: </span>');
  result = result.replace(/Objections:/gim, '<span class="text-amber-400 font-bold text-lg">Objections: </span>');
  result = result.replace(/Pricing:/gim, '<span class="text-purple-400 font-bold text-lg">Pricing: </span>');
  
  return result;
}

interface DealCoachProps {
  dealId: string;
  dealName: string;
  dealStage: string;
}

const DealCoach: React.FC<DealCoachProps> = ({ dealId, dealName, dealStage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('assessment');
  const [coachingData, setCoachingData] = useState<any>(null);
  const { toast } = useToast();

  const generateCoaching = async () => {
    setIsLoading(true);
    
    try {
      console.log(`Generating coaching for deal: ${dealId}`);
      
      toast({
        title: "Generating Coaching",
        description: "AI agents are analyzing your deal...",
      });
      
      // Call the main Deal Coach agent
      const agentResponse = await MainDealCoachAgent(dealId);
      console.log("Agent response:", agentResponse);
      
      // Transform the agent response into UI-friendly format
      const coachingData = {
        combinedAdvice: agentResponse.combinedAdvice,
        stageAdvice: agentResponse.stageAdvice,
        objectionAdvice: agentResponse.objectionAdvice,
        pricingAdvice: agentResponse.pricingAdvice,
        contactAdvice: agentResponse.contactAdvice
      };
      
      setCoachingData(coachingData);
      
      toast({
        title: "Coaching Generated",
        description: "AI-powered deal coaching is ready to review",
      });
    } catch (error) {
      console.error("Error generating coaching:", error);
      toast({
        title: "Error",
        description: "Failed to generate deal coaching. Please try again.",
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
          <Lightbulb className="w-5 h-5 mr-2 text-crm-electric" />
          Deal Coach AI
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {!coachingData ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-crm-tertiary p-4 rounded-full mb-4">
              <Lightbulb className="w-8 h-8 text-crm-electric" />
            </div>
            <p className="text-crm-text-secondary text-center mb-4 max-w-md">
              Generate AI-powered coaching for <span className="text-white font-medium">{dealName}</span> based on similar deals, historical data, and best practices.
            </p>
            <Button
              onClick={generateCoaching}
              disabled={isLoading}
              className="bg-crm-electric hover:bg-crm-electric/90 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Deal...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Deal Coaching
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-crm-tertiary border border-crm-tertiary/50 mb-6 w-full grid grid-cols-5 p-1">
                <TabsTrigger 
                  value="assessment" 
                  className="data-[state=active]:bg-crm-electric data-[state=active]:text-white text-gray-300 font-medium"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Assessment
                </TabsTrigger>
                <TabsTrigger 
                  value="strategy" 
                  className="data-[state=active]:bg-crm-electric data-[state=active]:text-white text-gray-300 font-medium"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Strategy
                </TabsTrigger>
                <TabsTrigger 
                  value="objections" 
                  className="data-[state=active]:bg-crm-electric data-[state=active]:text-white text-gray-300 font-medium"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Objections
                </TabsTrigger>
                <TabsTrigger 
                  value="pricing" 
                  className="data-[state=active]:bg-crm-electric data-[state=active]:text-white text-gray-300 font-medium"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pricing
                </TabsTrigger>
                <TabsTrigger 
                  value="relationship" 
                  className="data-[state=active]:bg-crm-electric data-[state=active]:text-white text-gray-300 font-medium"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Contacts
                </TabsTrigger>
              </TabsList>
              
              {/* Combined Assessment Tab */}
              <TabsContent value="assessment" className="mt-0">
                <div className="prose prose-invert max-w-none bg-crm-secondary p-6 rounded-lg border border-crm-tertiary shadow-lg">
                  <div dangerouslySetInnerHTML={{ __html: markdownToHTML(coachingData.combinedAdvice) }} />
                </div>
                <div className="mt-6 pt-4 border-t border-crm-tertiary">
                  <Button
                    onClick={generateCoaching}
                    disabled={isLoading}
                    variant="outline"
                    className="border-crm-electric text-crm-electric hover:bg-crm-electric/10"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Regenerate Coaching
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Stage Strategy Tab */}
              <TabsContent value="strategy" className="mt-0">
                <div className="prose prose-invert max-w-none bg-crm-secondary p-6 rounded-lg border border-crm-tertiary shadow-lg">
                  <div dangerouslySetInnerHTML={{ __html: markdownToHTML(coachingData.stageAdvice) }} />
                </div>
              </TabsContent>
              
              {/* Objections Tab */}
              <TabsContent value="objections" className="mt-0">
                <div className="prose prose-invert max-w-none bg-crm-secondary p-6 rounded-lg border border-crm-tertiary shadow-lg">
                  <div dangerouslySetInnerHTML={{ __html: markdownToHTML(coachingData.objectionAdvice) }} />
                </div>
              </TabsContent>
              
              {/* Pricing Tab */}
              <TabsContent value="pricing" className="mt-0">
                <div className="prose prose-invert max-w-none bg-crm-secondary p-6 rounded-lg border border-crm-tertiary shadow-lg">
                  <div dangerouslySetInnerHTML={{ __html: markdownToHTML(coachingData.pricingAdvice) }} />
                </div>
              </TabsContent>
              
              {/* Contact Approach Tab */}
              <TabsContent value="relationship" className="mt-0">
                <div className="prose prose-invert max-w-none bg-crm-secondary p-6 rounded-lg border border-crm-tertiary shadow-lg">
                  <div dangerouslySetInnerHTML={{ __html: markdownToHTML(coachingData.contactAdvice) }} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealCoach; 
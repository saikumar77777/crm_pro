import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Sparkles, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ObjectionHandler: React.FC = () => {
  const [objection, setObjection] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const [feedbackGiven, setFeedbackGiven] = useState<{[key: number]: 'up' | 'down' | null}>({});
  const { toast } = useToast();

  const handleGenerateResponses = async () => {
    if (!objection.trim()) {
      toast({
        title: "Error",
        description: "Please enter a customer objection first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // In a real implementation, this would be an API call to an AI service
      // For now, we'll simulate AI-generated responses
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate responses based on the objection type
      const objectionLower = objection.toLowerCase();
      let generatedResponses: string[] = [];
      
      if (objectionLower.includes('price') || objectionLower.includes('expensive') || objectionLower.includes('cost')) {
        generatedResponses = [
          "I understand your concern about the investment. Many of our customers initially felt the same way, but found that the ROI within the first 6 months more than justified the cost. Would you like me to share some specific ROI examples from companies similar to yours?",
          
          "You're right to be concerned about costs. Rather than looking at the upfront price, let's discuss the total value over time. Our solution reduces operational costs by an average of 23%, which typically covers the investment within the first year. Would it be helpful to see a customized cost-benefit analysis for your specific situation?",
          
          "I appreciate you bringing up pricing. We offer flexible payment options that can align with your budget cycle, including quarterly payments and annual subscriptions with discounts. Which approach would work better for your financial planning?"
        ];
      } else if (objectionLower.includes('competitor') || objectionLower.includes('alternative')) {
        generatedResponses = [
          "I'm glad you're exploring all options. While [Competitor] offers some similar features, our solution differentiates in three key areas: better integration capabilities, more comprehensive analytics, and dedicated customer success managers for ongoing support. Which of these areas is most important to your team?",
          
          "That's a good point about [Competitor]. Many of our current customers actually switched from them due to limitations they encountered as their needs grew. The main differences they cite are our platform's scalability, ease of customization, and our 24/7 support team. Would you like me to connect you with a customer who made this switch?",
          
          "I respect that you're considering [Competitor]. They have a solid product. Where we typically stand out is in implementation time (averaging 30% faster) and user adoption rates (our customers report 40% higher adoption). Would these factors impact your decision-making process?"
        ];
      } else if (objectionLower.includes('time') || objectionLower.includes('busy') || objectionLower.includes('later')) {
        generatedResponses = [
          "I completely understand how valuable your time is. Many of our customers were concerned about implementation time as well. That's why we've developed a streamlined onboarding process that requires minimal time from your team. Most clients are fully operational within just 2-3 weeks with only 4-6 hours of their team's involvement.",
          
          "I appreciate you're juggling multiple priorities right now. What if we scheduled a brief 15-minute call just to identify your most pressing challenges? This would help us prepare a focused proposal that addresses only what's most important to you at this moment.",
          
          "Timing is crucial, and I respect your current commitments. Would it be helpful if I shared a case study of how we helped a similarly time-constrained organization implement our solution with minimal disruption? They were able to maintain full operations while transitioning to our platform."
        ];
      } else if (objectionLower.includes('need') || objectionLower.includes('necessary') || objectionLower.includes('required')) {
        generatedResponses = [
          "That's a fair point. Not every solution is right for every business. Based on what you've shared about [mention specific challenge they've discussed], our platform could help you improve efficiency by approximately 30%. Would that level of improvement be significant enough to warrant further discussion?",
          
          "I appreciate your candor. Many of our most successful customers initially questioned whether they needed our solution. What convinced them was seeing the hidden costs and inefficiencies in their current processes. Would it be valuable to conduct a quick assessment to identify potential areas where you might be leaving money on the table?",
          
          "You're right to question whether this is necessary for your business. Rather than assuming it is, let's look at your specific goals for this year. What metrics are you most focused on improving? This will help us determine if there's actually a good fit here."
        ];
      } else {
        // Generic responses for other objection types
        generatedResponses = [
          "I appreciate you sharing that concern. Many of our customers had similar thoughts before they understood how our solution specifically addresses this challenge. Could you tell me more about what's driving this concern so I can provide a more tailored response?",
          
          "That's a valid point. Based on what you've shared, I think there's a specific aspect of our solution that might address this concern directly. Would it be helpful if I focused on how we've helped other customers overcome this exact issue?",
          
          "Thank you for being transparent about your concerns. This gives us an opportunity to address them directly. In similar situations with other clients, we've found that [specific approach] has been effective. Would that approach be relevant to your situation as well?"
        ];
      }
      
      setResponses(generatedResponses);
    } catch (error) {
      console.error('Error generating responses:', error);
      toast({
        title: "Error",
        description: "Failed to generate responses",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard"
    });
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({
      ...prev,
      [index]: type
    }));
    
    toast({
      title: type === 'up' ? "Great!" : "Thanks for the feedback",
      description: type === 'up' 
        ? "We'll prioritize similar responses in the future" 
        : "We'll improve our suggestions based on your feedback"
    });
  };

  return (
    <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary overflow-hidden">
      <CardHeader className="pb-3 border-b border-crm-tertiary">
        <CardTitle className="flex items-center text-lg font-medium text-white">
          <MessageSquare className="w-5 h-5 mr-2 text-orange-400" />
          Objection Handler AI
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="objection" className="block text-sm font-medium text-white mb-2">
              Paste customer objection
            </label>
            <Textarea
              id="objection"
              placeholder="e.g., 'Your product is too expensive' or 'We're already using a competitor'"
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
              className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateResponses}
              disabled={isGenerating || !objection.trim()}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Responses...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Convincing Responses
                </>
              )}
            </Button>
          </div>
          
          {responses.length > 0 && (
            <div className="space-y-6 mt-4">
              <h3 className="text-white font-medium">Suggested Responses:</h3>
              <div className="space-y-4">
                {responses.map((response, index) => (
                  <div key={index} className="bg-crm-tertiary rounded-lg p-4 relative group">
                    <p className="text-white mb-4">{response}</p>
                    <div className="flex justify-between items-center">
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback(index, 'up')}
                          disabled={feedbackGiven[index] !== undefined}
                          className={`border-crm-tertiary hover:bg-crm-secondary ${
                            feedbackGiven[index] === 'up' ? 'text-green-400' : 'text-white'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback(index, 'down')}
                          disabled={feedbackGiven[index] !== undefined}
                          className={`border-crm-tertiary hover:bg-crm-secondary ${
                            feedbackGiven[index] === 'down' ? 'text-red-400' : 'text-white'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard(response)}
                        className="border-crm-tertiary text-white hover:bg-crm-secondary"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    {feedbackGiven[index] && (
                      <div className="absolute top-2 right-2">
                        <span className={`text-xs ${
                          feedbackGiven[index] === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {feedbackGiven[index] === 'up' ? 'Helpful' : 'Not helpful'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectionHandler; 
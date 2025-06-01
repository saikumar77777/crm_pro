import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, CheckCircle, XCircle, Lightbulb, BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";
import { useToast } from "@/hooks/use-toast";

interface WinLossFactors {
  won: {
    factors: { name: string; percentage: number; description: string }[];
    insights: string[];
    recommendations: string[];
  };
  lost: {
    factors: { name: string; percentage: number; description: string }[];
    insights: string[];
    recommendations: string[];
  };
}

const WinLossExplainer: React.FC = () => {
  const { deals } = useDeals();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [winLossFactors, setWinLossFactors] = useState<WinLossFactors | null>(null);
  const { toast } = useToast();

  const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
  const lostDeals = deals.filter(deal => deal.stage === 'closed-lost');
  const totalClosedDeals = wonDeals.length + lostDeals.length;
  const winRate = totalClosedDeals > 0 ? (wonDeals.length / totalClosedDeals) * 100 : 0;

  const analyzeDeals = async () => {
    setIsAnalyzing(true);
    
    try {
      // In a real implementation, this would call an AI service to analyze the deal data
      // For now, we'll simulate the AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock analysis based on the available deal data
      const mockAnalysis: WinLossFactors = {
        won: {
          factors: [
            {
              name: "Relationship Quality",
              percentage: 35,
              description: "Strong relationships with key decision makers were present in most won deals."
            },
            {
              name: "Value Proposition",
              percentage: 28,
              description: "Clear ROI and value demonstration was a significant factor in successful deals."
            },
            {
              name: "Solution Fit",
              percentage: 22,
              description: "Product features aligned well with specific customer needs."
            },
            {
              name: "Competitive Positioning",
              percentage: 15,
              description: "Effective differentiation from competitors influenced buying decisions."
            }
          ],
          insights: [
            "Deals with multiple stakeholder relationships were 2.4x more likely to close",
            "Proposals that included custom ROI calculations had a 40% higher close rate",
            "Deals with shorter sales cycles (under 45 days) had higher win rates",
            "Customers from the technology and healthcare sectors showed highest conversion"
          ],
          recommendations: [
            "Focus on building relationships with multiple stakeholders early in the sales process",
            "Create industry-specific ROI calculators to strengthen value propositions",
            "Develop more case studies highlighting successful implementations",
            "Consider offering proof-of-concept trials for high-value opportunities"
          ]
        },
        lost: {
          factors: [
            {
              name: "Price Sensitivity",
              percentage: 31,
              description: "Budget constraints or perceived high cost relative to alternatives."
            },
            {
              name: "Competitor Selection",
              percentage: 27,
              description: "Competitor offerings were selected due to specific features or existing relationships."
            },
            {
              name: "Decision Inertia",
              percentage: 24,
              description: "Extended decision-making processes leading to no decision or status quo."
            },
            {
              name: "Feature Gaps",
              percentage: 18,
              description: "Missing functionality that was critical for the customer's use case."
            }
          ],
          insights: [
            "Deals without executive sponsor involvement were 3x more likely to be lost",
            "Opportunities with objections around pricing had 65% lower close rates",
            "Deals that stalled for more than 30 days rarely closed successfully",
            "Manufacturing and retail sectors showed higher price sensitivity"
          ],
          recommendations: [
            "Develop more flexible pricing options for price-sensitive segments",
            "Create competitive battle cards to better address competitor strengths",
            "Implement a 'deal at risk' identification process for stalled opportunities",
            "Prioritize product roadmap items that address common feature gaps"
          ]
        }
      };
      
      setWinLossFactors(mockAnalysis);
    } catch (error) {
      console.error('Error analyzing deals:', error);
      toast({
        title: "Error",
        description: "Failed to analyze win/loss patterns",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Reset analysis if deal data changes significantly
    setWinLossFactors(null);
  }, [deals.length]);

  return (
    <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary overflow-hidden">
      <CardHeader className="pb-3 border-b border-crm-tertiary">
        <CardTitle className="flex items-center text-lg font-medium text-white">
          <Lightbulb className="w-5 h-5 mr-2 text-amber-400" />
          Win/Loss Pattern Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {totalClosedDeals < 5 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="w-12 h-12 text-crm-text-secondary mb-4" />
            <h3 className="text-white font-medium mb-2">Not Enough Data</h3>
            <p className="text-crm-text-secondary max-w-md mb-4">
              You need at least 5 closed deals (won or lost) for meaningful analysis. 
              Currently you have {totalClosedDeals} closed deals.
            </p>
            <div className="w-full max-w-md bg-crm-tertiary h-2 rounded-full mb-2">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalClosedDeals / 5) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-crm-text-secondary">
              {totalClosedDeals}/5 closed deals
            </p>
          </div>
        ) : !winLossFactors ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex items-center mb-6">
              <div className="flex flex-col items-center mr-8">
                <div className="text-3xl font-bold text-green-400 mb-1">{wonDeals.length}</div>
                <div className="text-sm text-crm-text-secondary">Won Deals</div>
              </div>
              <div className="h-12 border-r border-crm-tertiary mx-2"></div>
              <div className="flex flex-col items-center mr-8">
                <div className="text-3xl font-bold text-red-400 mb-1">{lostDeals.length}</div>
                <div className="text-sm text-crm-text-secondary">Lost Deals</div>
              </div>
              <div className="h-12 border-r border-crm-tertiary mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-amber-400 mb-1">{winRate.toFixed(0)}%</div>
                <div className="text-sm text-crm-text-secondary">Win Rate</div>
              </div>
            </div>
            
            <p className="text-crm-text-secondary text-center mb-6 max-w-lg">
              Analyze your closed deals to discover patterns and get AI-powered insights on why you're winning or losing deals.
            </p>
            
            <Button
              onClick={analyzeDeals}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Deals...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Analyze Win/Loss Patterns
                </>
              )}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="won" className="w-full">
            <TabsList className="bg-crm-tertiary border-crm-tertiary mb-6 w-full">
              <TabsTrigger value="won" className="flex-1 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 text-crm-text-secondary">
                <CheckCircle className="w-4 h-4 mr-2" />
                Won Deals ({wonDeals.length})
              </TabsTrigger>
              <TabsTrigger value="lost" className="flex-1 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 text-crm-text-secondary">
                <XCircle className="w-4 h-4 mr-2" />
                Lost Deals ({lostDeals.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="won" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <BarChartIcon className="w-4 h-4 mr-2 text-green-400" />
                    Key Success Factors
                  </h3>
                  <div className="space-y-4">
                    {winLossFactors.won.factors.map((factor, index) => (
                      <div key={index} className="bg-crm-tertiary rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{factor.name}</span>
                          <span className="text-green-400 font-bold">{factor.percentage}%</span>
                        </div>
                        <p className="text-sm text-crm-text-secondary">{factor.description}</p>
                        <div className="w-full bg-crm-primary rounded-full h-1.5 mt-3">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${factor.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <PieChartIcon className="w-4 h-4 mr-2 text-green-400" />
                    Key Insights
                  </h3>
                  <div className="bg-crm-tertiary rounded-md p-4">
                    <ul className="space-y-3">
                      {winLossFactors.won.insights.map((insight, index) => (
                        <li key={index} className="text-crm-text-secondary flex items-start">
                          <div className="text-green-400 mr-2 mt-1">•</div>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                    Recommendations
                  </h3>
                  <div className="bg-crm-tertiary rounded-md p-4">
                    <ul className="space-y-3">
                      {winLossFactors.won.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-crm-text-secondary flex items-start">
                          <div className="text-green-400 mr-2 mt-1">→</div>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lost" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <BarChartIcon className="w-4 h-4 mr-2 text-red-400" />
                    Key Loss Factors
                  </h3>
                  <div className="space-y-4">
                    {winLossFactors.lost.factors.map((factor, index) => (
                      <div key={index} className="bg-crm-tertiary rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium">{factor.name}</span>
                          <span className="text-red-400 font-bold">{factor.percentage}%</span>
                        </div>
                        <p className="text-sm text-crm-text-secondary">{factor.description}</p>
                        <div className="w-full bg-crm-primary rounded-full h-1.5 mt-3">
                          <div
                            className="bg-red-500 h-1.5 rounded-full"
                            style={{ width: `${factor.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <PieChartIcon className="w-4 h-4 mr-2 text-red-400" />
                    Key Insights
                  </h3>
                  <div className="bg-crm-tertiary rounded-md p-4">
                    <ul className="space-y-3">
                      {winLossFactors.lost.insights.map((insight, index) => (
                        <li key={index} className="text-crm-text-secondary flex items-start">
                          <div className="text-red-400 mr-2 mt-1">•</div>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-red-400" />
                    Recommendations
                  </h3>
                  <div className="bg-crm-tertiary rounded-md p-4">
                    <ul className="space-y-3">
                      {winLossFactors.lost.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-crm-text-secondary flex items-start">
                          <div className="text-red-400 mr-2 mt-1">→</div>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default WinLossExplainer; 
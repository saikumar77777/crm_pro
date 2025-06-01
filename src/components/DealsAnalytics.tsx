import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import WinLossExplainer from './WinLossExplainer';

const DealsAnalytics = () => {
  return (
    <div className="space-y-8">
      {/* Win/Loss Analysis */}
      <div className="mb-8">
        <WinLossExplainer />
      </div>
      
      {/* Additional Analytics Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-crm-secondary border-crm-tertiary mb-8">
          <TabsTrigger value="overview" className="data-[state=active]:bg-crm-tertiary data-[state=active]:text-white text-crm-text-secondary">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-crm-tertiary data-[state=active]:text-white text-crm-text-secondary">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Pipeline Analysis
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-crm-tertiary data-[state=active]:text-white text-crm-text-secondary">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
            <CardHeader>
              <CardTitle className="text-white">Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">Advanced Analytics Coming Soon</h3>
                  <p className="text-crm-text-secondary">
                    Detailed sales metrics and performance indicators will be available in a future update.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pipeline" className="mt-0">
          <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
            <CardHeader>
              <CardTitle className="text-white">Pipeline Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <PieChartIcon className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">Pipeline Visualization Coming Soon</h3>
                  <p className="text-crm-text-secondary">
                    Visual breakdowns of your sales pipeline by stage, value, and probability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-0">
          <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
            <CardHeader>
              <CardTitle className="text-white">Sales Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">Trend Analysis Coming Soon</h3>
                  <p className="text-crm-text-secondary">
                    Track performance over time with historical data and forecasting.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealsAnalytics;

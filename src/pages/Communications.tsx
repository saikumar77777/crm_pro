import React from 'react';
import CRMSidebar from '../components/CRMSidebar';
import { MessageSquare, Mail, Phone, Video, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ObjectionHandler from '@/components/ObjectionHandler';
import CommunicationHub from '@/components/CommunicationHub';

const Communications = () => {
  return (
    <div className="min-h-screen bg-crm-primary flex">
      <CRMSidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Communications</h1>
          <p className="text-crm-text-secondary">Manage customer interactions and communications</p>
        </div>
        
        <Tabs defaultValue="communication-hub">
          <TabsList className="bg-crm-secondary border-crm-tertiary mb-8">
            <TabsTrigger value="communication-hub" className="data-[state=active]:bg-crm-tertiary data-[state=active]:text-white text-crm-text-secondary">
              <MessageSquare className="w-4 h-4 mr-2" />
              Communication Hub
            </TabsTrigger>
            <TabsTrigger value="objection-handler" className="data-[state=active]:bg-crm-tertiary data-[state=active]:text-white text-crm-text-secondary">
              <MessageSquare className="w-4 h-4 mr-2" />
              Objection Handler
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-crm-tertiary data-[state=active]:text-white text-crm-text-secondary">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="calls" className="data-[state=active]:bg-crm-tertiary data-[state=active]:text-white text-crm-text-secondary">
              <Phone className="w-4 h-4 mr-2" />
              Calls
            </TabsTrigger>
            <TabsTrigger value="meetings" className="data-[state=active]:bg-crm-tertiary data-[state=active]:text-white text-crm-text-secondary">
              <Video className="w-4 h-4 mr-2" />
              Meetings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="communication-hub" className="mt-0">
            <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
              <CardContent className="pt-6">
                <CommunicationHub />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="objection-handler" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ObjectionHandler 
                  dealId="demo-deal-id" 
                  dealName="Demo Deal" 
                />
              </div>
              
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
                  <CardHeader>
                    <CardTitle className="text-white">Objection Handling Tips</CardTitle>
                    <CardDescription className="text-crm-text-secondary">Best practices for handling objections</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-1">Listen actively</h3>
                      <p className="text-crm-text-secondary text-sm">
                        Let customers fully express their concerns before responding.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Acknowledge the concern</h3>
                      <p className="text-crm-text-secondary text-sm">
                        Show empathy and validate their perspective.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Ask clarifying questions</h3>
                      <p className="text-crm-text-secondary text-sm">
                        Understand the root cause of their objection.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Provide evidence</h3>
                      <p className="text-crm-text-secondary text-sm">
                        Use case studies and testimonials to support your response.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Follow up</h3>
                      <p className="text-crm-text-secondary text-sm">
                        Check if your response addressed their concern.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
                  <CardHeader>
                    <CardTitle className="text-white">Common Objections</CardTitle>
                    <CardDescription className="text-crm-text-secondary">Frequently encountered objections</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-crm-text-secondary text-sm cursor-pointer hover:text-white transition-colors">
                      "Your product is too expensive"
                    </p>
                    <p className="text-crm-text-secondary text-sm cursor-pointer hover:text-white transition-colors">
                      "We're already using a competitor"
                    </p>
                    <p className="text-crm-text-secondary text-sm cursor-pointer hover:text-white transition-colors">
                      "We don't have the budget right now"
                    </p>
                    <p className="text-crm-text-secondary text-sm cursor-pointer hover:text-white transition-colors">
                      "I need to consult with my team/boss"
                    </p>
                    <p className="text-crm-text-secondary text-sm cursor-pointer hover:text-white transition-colors">
                      "We're not ready to make a decision yet"
                    </p>
                    <p className="text-crm-text-secondary text-sm cursor-pointer hover:text-white transition-colors">
                      "Your solution is missing a key feature"
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="mt-0">
            <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Mail className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">Email Management</h3>
                    <p className="text-crm-text-secondary">
                      Email features coming soon. Track conversations and manage templates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calls" className="mt-0">
            <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Phone className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">Call Management</h3>
                    <p className="text-crm-text-secondary">
                      Call tracking and recording features coming soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="meetings" className="mt-0">
            <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">Meeting Scheduler</h3>
                    <p className="text-crm-text-secondary">
                      Calendar integration and meeting scheduling coming soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Communications;

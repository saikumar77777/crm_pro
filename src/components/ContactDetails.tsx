import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, MessageSquare, User, Calendar, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CreateCommunicationDialog from './CreateCommunicationDialog';
import { Loader2 } from 'lucide-react';

interface ContactDetailsProps {
  contact: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    position: string | null;
    status: string | null;
    notes: string | null;
    created_at: string;
  };
}

interface Communication {
  id: string;
  type: string;
  subject: string;
  content: string | null;
  created_at: string;
  status: string | null;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ contact }) => {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCommunications();
  }, [contact.id]);

  const fetchCommunications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .eq('contact_id', contact.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setCommunications(data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'text-blue-400';
      case 'call':
        return 'text-emerald-400';
      case 'meeting':
        return 'text-amber-400';
      case 'sms':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary">
      <CardHeader className="pb-3 border-b border-crm-tertiary">
        <CardTitle className="flex items-center justify-between text-lg font-medium text-white">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-crm-electric" />
            {contact.first_name} {contact.last_name}
          </div>
          <span className="text-sm font-normal text-crm-text-secondary">
            {contact.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="bg-crm-tertiary mb-4">
            <TabsTrigger value="info" className="data-[state=active]:bg-crm-secondary">Info</TabsTrigger>
            <TabsTrigger value="communications" className="data-[state=active]:bg-crm-secondary">Communications</TabsTrigger>
            <TabsTrigger value="deals" className="data-[state=active]:bg-crm-secondary">Deals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-crm-text-secondary mb-1">Email</h3>
                  <p className="text-white">{contact.email || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-crm-text-secondary mb-1">Phone</h3>
                  <p className="text-white">{contact.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-crm-text-secondary mb-1">Company</h3>
                  <p className="text-white">{contact.company || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-crm-text-secondary mb-1">Position</h3>
                  <p className="text-white">{contact.position || 'Not provided'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-crm-text-secondary mb-1">Notes</h3>
                <p className="text-white bg-crm-tertiary p-3 rounded-md">
                  {contact.notes || 'No notes available for this contact.'}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="communications">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Communication History</h3>
                <Button 
                  size="sm" 
                  className="bg-crm-electric hover:bg-crm-electric/90 text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Communication
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-crm-electric animate-spin" />
                </div>
              ) : communications.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
                  <p className="text-crm-text-secondary mb-2">No communications yet</p>
                  <Button 
                    size="sm" 
                    className="bg-crm-electric hover:bg-crm-electric/90 text-white"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add First Communication
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {communications.map((comm) => (
                    <div 
                      key={comm.id} 
                      className="bg-crm-tertiary p-3 rounded-md hover:bg-crm-tertiary/70 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded-md bg-crm-secondary ${getTypeColor(comm.type)} mr-3`}>
                            {getTypeIcon(comm.type)}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{comm.subject}</h4>
                            <p className="text-xs text-crm-text-secondary">
                              {formatDate(comm.created_at)}
                            </p>
                          </div>
                        </div>
                        {comm.status && (
                          <span className="text-xs bg-crm-secondary px-2 py-1 rounded-full text-crm-text-secondary">
                            {comm.status}
                          </span>
                        )}
                      </div>
                      {comm.content && (
                        <p className="text-crm-text-secondary text-sm mt-2 pl-9">
                          {comm.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="deals">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
              <p className="text-crm-text-secondary">Deals section coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CreateCommunicationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={fetchCommunications}
        contactId={contact.id}
      />
    </Card>
  );
};

export default ContactDetails; 
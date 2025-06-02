import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, Clock, Eye, MousePointer, Reply, User, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CreateCommunicationDialog from './CreateCommunicationDialog';
import { Loader2 } from 'lucide-react';

interface Communication {
  id: string;
  type: 'email' | 'call' | 'sms' | 'meeting';
  contact: string;
  subject: string;
  timestamp: string;
  status: 'sent' | 'opened' | 'clicked' | 'replied';
  content: string;
  user: string;
}

interface DbCommunication {
  id: string;
  type: string;
  subject: string;
  content: string | null;
  status: string | null;
  created_at: string;
  contact_id: string | null;
  deal_id: string | null;
  direction: string | null;
  contact?: {
    first_name: string;
    last_name: string;
    company: string | null;
  };
  user?: {
    email: string;
  };
}

const CommunicationHub = () => {
  const { user } = useAuth();
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunications();
  }, [user]);

  const fetchCommunications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communications')
        .select(`
          *,
          contact:contact_id (first_name, last_name, company),
          user:user_id (email)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      // Transform data to match our Communication interface
      const formattedComms: Communication[] = (data || []).map((comm: DbCommunication) => ({
        id: comm.id,
        type: comm.type as any,
        contact: comm.contact 
          ? `${comm.contact.first_name} ${comm.contact.last_name}${comm.contact.company ? ` - ${comm.contact.company}` : ''}` 
          : 'No contact',
        subject: comm.subject,
        timestamp: formatTimestamp(comm.created_at),
        status: comm.status as any || 'sent',
        content: comm.content || '',
        user: comm.user?.email || 'Unknown'
      }));
      
      setCommunications(formattedComms);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      email: <Mail className="w-4 h-4" />,
      call: <Phone className="w-4 h-4" />,
      sms: <MessageSquare className="w-4 h-4" />,
      meeting: <User className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons];
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      sent: { color: 'text-crm-text-secondary', bg: 'bg-crm-tertiary', label: 'Sent' },
      opened: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Opened' },
      clicked: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Clicked' },
      replied: { color: 'text-crm-emerald', bg: 'bg-crm-emerald/20', label: 'Replied' }
    };
    return configs[status as keyof typeof configs];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      email: 'text-blue-400',
      call: 'text-emerald-400',
      sms: 'text-purple-400',
      meeting: 'text-amber-400'
    };
    return colors[type as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-crm-text-white mb-2">
            Communication Hub
          </h2>
          <p className="text-crm-text-secondary">
            Track all customer interactions and communications
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-crm-electric to-crm-emerald hover:shadow-electric text-white"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Communication
        </Button>
      </div>

      {/* Communication Timeline */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-crm-electric animate-spin" />
          </div>
        ) : communications.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No communications yet</h3>
            <p className="text-crm-text-secondary">
              Start tracking your customer interactions by adding your first communication.
            </p>
            <Button 
              className="mt-4 bg-crm-electric hover:bg-crm-electric/90 text-white"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Communication
            </Button>
          </div>
        ) : (
          communications.map((comm) => {
            const statusConfig = getStatusConfig(comm.status);
            const typeColor = getTypeColor(comm.type);
            
            return (
              <Dialog key={comm.id}>
                <DialogTrigger asChild>
                  <div className="bg-crm-secondary hover:bg-crm-tertiary/50 border border-crm-tertiary rounded-lg p-4 cursor-pointer transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-crm-tertiary ${typeColor}`}>
                          {getTypeIcon(comm.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-crm-text-white">{comm.subject}</h4>
                          <p className="text-xs text-crm-text-secondary">{comm.contact}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </div>
                        <span className="text-xs text-crm-text-secondary">
                          {comm.timestamp}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-crm-text-secondary line-clamp-2">
                        {comm.content}
                      </p>
                      <span className="text-xs text-crm-text-secondary">
                        by {comm.user}
                      </span>
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="bg-crm-secondary border-crm-tertiary">
                  <DialogHeader>
                    <DialogTitle className="text-crm-text-white flex items-center space-x-2">
                      <div className={`p-2 rounded-lg bg-crm-tertiary ${typeColor}`}>
                        {getTypeIcon(comm.type)}
                      </div>
                      <span>{comm.subject}</span>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div>
                    <div className="flex items-center justify-between p-3 bg-crm-tertiary rounded-lg">
                      <div>
                        <p className="font-medium text-crm-text-white">{comm.contact}</p>
                        <p className="text-sm text-crm-text-secondary">{comm.timestamp}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-crm-primary rounded-lg my-4">
                      <p className="text-crm-text-white leading-relaxed">
                        {comm.content}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="bg-crm-electric hover:bg-crm-electric/80 text-white">
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" className="border-crm-tertiary text-crm-text-white hover:bg-crm-tertiary">
                        Forward
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })
        )}
      </div>
      
      {/* Create Communication Dialog */}
      <CreateCommunicationDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onSuccess={fetchCommunications}
      />
    </div>
  );
};

export default CommunicationHub;

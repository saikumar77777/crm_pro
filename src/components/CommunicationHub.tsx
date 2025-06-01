
import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Clock, Eye, MousePointer, Reply, User, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

const CommunicationHub = () => {
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);

  const communications: Communication[] = [
    {
      id: '1',
      type: 'email',
      contact: 'John Smith - Acme Corp',
      subject: 'Proposal Follow-up',
      timestamp: '2 hours ago',
      status: 'opened',
      content: 'Thank you for reviewing our proposal. I wanted to follow up on the pricing discussion we had last week.',
      user: 'Sarah Wilson'
    },
    {
      id: '2',
      type: 'call',
      contact: 'Maria Garcia - TechStart',
      subject: 'Product Demo Call',
      timestamp: '4 hours ago',
      status: 'replied',
      content: 'Scheduled 30-minute product demonstration call. Discussed key features and pricing.',
      user: 'Mike Johnson'
    },
    {
      id: '3',
      type: 'email',
      contact: 'David Chen - Global Solutions',
      subject: 'Contract Negotiation',
      timestamp: '1 day ago',
      status: 'clicked',
      content: 'Following up on the contract terms we discussed. Please review the updated proposal.',
      user: 'Sarah Wilson'
    }
  ];

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
        <Button className="bg-gradient-to-r from-crm-electric to-crm-emerald hover:shadow-electric text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Communication
        </Button>
      </div>

      {/* Communication Timeline */}
      <div className="space-y-4">
        {communications.map((comm) => {
          const statusConfig = getStatusConfig(comm.status);
          const typeColor = getTypeColor(comm.type);
          
          return (
            <Dialog key={comm.id}>
              <DialogTrigger asChild>
                <div className="crm-card crm-card-hover p-4 cursor-pointer border-l-4 border-crm-electric">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-crm-tertiary ${typeColor}`}>
                        {getTypeIcon(comm.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-crm-text-white">
                          {comm.contact}
                        </h4>
                        <p className="text-sm text-crm-text-secondary">
                          {comm.subject}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-crm-text-secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        {comm.timestamp}
                      </div>
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
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-crm-tertiary rounded-lg">
                    <div>
                      <p className="font-medium text-crm-text-white">{comm.contact}</p>
                      <p className="text-sm text-crm-text-secondary">{comm.timestamp}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-crm-primary rounded-lg">
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
        })}
      </div>
    </div>
  );
};

export default CommunicationHub;

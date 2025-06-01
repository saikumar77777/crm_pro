import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, User, Building, Target, Clock, FileText, Plus, Edit3, Lightbulb, MessageSquare } from 'lucide-react';
import CRMSidebar from '../components/CRMSidebar';
import { useDeals } from '@/hooks/useDeals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ObjectionHandler from '@/components/ObjectionHandler';
import DealCoach from '@/components/DealCoach';

const DealDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deals, updateDeal, loading } = useDeals();
  const { toast } = useToast();
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  console.log('DealDetails: Current deal ID from URL:', id);
  console.log('DealDetails: Available deals:', deals);

  const deal = deals.find(d => d.id === id);
  console.log('DealDetails: Found deal:', deal);

  useEffect(() => {
    if (!loading && deals.length > 0 && !deal && id) {
      console.log('Deal not found, redirecting to deals page');
      toast({
        title: "Deal not found",
        description: "The requested deal could not be found.",
        variant: "destructive"
      });
      navigate('/deals');
    }
  }, [deal, loading, deals, id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-crm-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crm-electric"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-crm-primary flex">
        <CRMSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Deal Not Found</h2>
            <p className="text-crm-text-secondary mb-6">The requested deal could not be found.</p>
            <Button 
              onClick={() => navigate('/deals')}
              className="bg-crm-electric hover:bg-blue-600 text-white"
            >
              Back to Deals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStageColor = (stage: string) => {
    const colors = {
      prospecting: '#a78bfa',
      qualification: '#22d3ee',
      proposal: '#fbbf24',
      negotiation: '#fb923c',
      'closed-won': '#10b981',
      'closed-lost': '#f87171'
    };
    return colors[stage as keyof typeof colors] || '#a78bfa';
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const currentNotes = deal.notes || '';
    const timestamp = new Date().toLocaleString();
    const updatedNotes = currentNotes 
      ? `${currentNotes}\n\n[${timestamp}] ${newNote}`
      : `[${timestamp}] ${newNote}`;

    await updateDeal(deal.id, { notes: updatedNotes });
    setNewNote('');
    setIsAddingNote(false);
    
    toast({
      title: "Note added",
      description: "Your note has been added to the deal."
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNotes = (notes: string) => {
    if (!notes) return [];
    return notes.split('\n\n').filter(note => note.trim());
  };

  const renderObjectionHandler = () => {
    return (
      <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary mb-8 overflow-hidden">
        <CardHeader className="pb-3 border-b border-crm-tertiary">
          <CardTitle className="flex items-center text-lg font-medium text-white">
            <MessageSquare className="w-5 h-5 mr-2 text-orange-400" />
            Objection Handler
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ObjectionHandler />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-crm-primary flex">
      <CRMSidebar />
      
      <div className="flex-1 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/deals')}
              className="border-crm-tertiary text-white hover:bg-crm-tertiary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Deals
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{deal.name}</h1>
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-crm-text-secondary" />
                <p className="text-crm-text-secondary text-lg">{deal.company || 'No company specified'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              className={`${getPriorityColor(deal.priority || 'medium')} border px-3 py-1 text-sm font-medium`}
            >
              {(deal.priority || 'medium').toUpperCase()} PRIORITY
            </Badge>
            <Badge 
              style={{ 
                backgroundColor: `${getStageColor(deal.stage)}20`,
                color: getStageColor(deal.stage),
                borderColor: `${getStageColor(deal.stage)}30`
              }}
              className="border px-3 py-1 text-sm font-medium"
            >
              {deal.stage.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Deal Overview - Enhanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-crm-text-secondary flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-crm-emerald" />
                Deal Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-crm-emerald">{formatCurrency(deal.value)}</p>
              <p className="text-xs text-crm-text-secondary mt-1">Expected revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-crm-text-secondary flex items-center">
                <Target className="w-5 h-5 mr-2 text-crm-electric" />
                Probability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-crm-electric">{deal.probability || 50}%</p>
              <div className="w-full bg-crm-tertiary rounded-full h-2 mt-2">
                <div 
                  className="bg-crm-electric h-2 rounded-full transition-all duration-500"
                  style={{ width: `${deal.probability || 50}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-crm-text-secondary flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-400" />
                Days in Stage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{deal.days_in_stage || 0}</p>
              <p className="text-xs text-crm-text-secondary mt-1">days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-crm-text-secondary flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-white">
                {new Date(deal.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-xs text-crm-text-secondary mt-1">
                {new Date(deal.created_at).toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Deal Coach AI */}
        <div className="mb-8">
          <DealCoach 
            dealId={deal.id} 
            dealName={deal.name} 
            dealStage={deal.stage} 
          />
        </div>

        {/* Objection Handler */}
        {renderObjectionHandler()}

        {/* Notes Section - Enhanced */}
        <Card className="bg-gradient-to-br from-crm-secondary to-crm-tertiary border-crm-tertiary shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center text-xl">
                <FileText className="w-6 h-6 mr-3 text-crm-electric" />
                Deal Notes & Activity History
              </CardTitle>
              <Button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="bg-crm-electric hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAddingNote && (
              <div className="space-y-4 p-6 bg-crm-tertiary rounded-xl border border-crm-electric/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Edit3 className="w-4 h-4 text-crm-electric" />
                  <h4 className="font-medium text-white">Add New Note</h4>
                </div>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this deal..."
                  className="bg-crm-primary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-2 focus:ring-crm-electric/20 min-h-[120px]"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="bg-crm-electric hover:bg-blue-600 text-white flex-1"
                    size="sm"
                  >
                    Save Note
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote('');
                    }}
                    variant="outline"
                    className="border-crm-tertiary text-gray-300 hover:text-white hover:bg-crm-tertiary flex-1"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {deal.notes ? (
              <div className="space-y-4">
                {formatNotes(deal.notes).map((note, index) => (
                  <div key={index} className="p-5 bg-crm-primary rounded-xl border border-crm-tertiary/50 hover:border-crm-electric/30 transition-all duration-300">
                    <p className="text-white whitespace-pre-wrap leading-relaxed">{note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-crm-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No notes yet</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Add notes to track the progress and important updates for this deal
                </p>
                <Button
                  onClick={() => setIsAddingNote(true)}
                  variant="outline"
                  className="border-crm-electric text-crm-electric hover:bg-crm-electric hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Note
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DealDetails;

import React, { useState, useMemo, useEffect } from 'react';
import CRMSidebar from '../components/CRMSidebar';
import DealKanbanBoard from '../components/DealKanbanBoard';
import { useDeals } from '@/hooks/useDeals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, BarChart3, Database, Sparkles } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllDeals } from '@/api/getAllDeals';
import { createDealEmbeddings } from '@/api/createEmbeddings';
import { useToast } from '@/hooks/use-toast';

const Deals = () => {
  const { deals, loading, createDeal } = useDeals();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);
  const { toast } = useToast();
  const [newDeal, setNewDeal] = useState({
    name: '',
    company: '',
    value: 0,
    stage: 'prospecting' as const,
    priority: 'medium' as const,
    probability: 50
  });

  // Fetch all deals with related information when component mounts
  useEffect(() => {
    async function fetchAllDealsData() {
      try {
        const result = await getAllDeals();
        console.log('All Deals with Related Information:', result);
      } catch (error) {
        console.error('Error fetching all deals data:', error);
      }
    }
    
    fetchAllDealsData();
  }, []);
  
  // Function to manually fetch and display all deals data
  const handleShowAllDeals = async () => {
    try {
      const result = await getAllDeals();
      console.log('MANUALLY FETCHED - All Deals with Related Information:', result);
      toast({
        title: "Data Fetched Successfully",
        description: `Found ${result.count} deals. Check the console for complete data.`,
      });
    } catch (error) {
      console.error('Error fetching all deals data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deals data",
        variant: "destructive"
      });
    }
  };
  
  // Function to generate embeddings for all deals
  const handleGenerateEmbeddings = async () => {
    try {
      setIsGeneratingEmbeddings(true);
      toast({
        title: "Generating Embeddings",
        description: "Please wait while embeddings are being generated...",
      });
      
      console.log("Starting embedding generation process...");
      const result = await createDealEmbeddings();
      
      if (result.success) {
        console.log("✅ Embeddings generated successfully!");
        console.log(`📊 Total embeddings created: ${result.count}`);
        console.log(`🗄️ Storage type: ${result.storageType}`);
        console.log(`📁 Collection name: ${result.collectionName}`);
        
        if (result.sampleEmbedding && result.sampleEmbedding.length > 0) {
          console.log("📝 Sample embedding (first 5 dimensions):", result.sampleEmbedding);
          console.log(`📏 Embedding dimensions: ${result.sampleEmbedding.length} (truncated sample)`);
        }
        
        // Check if embeddings are stored in localStorage
        try {
          const storedData = localStorage.getItem("deal_embeddings");
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log(`💾 Embeddings stored in localStorage: ${parsedData.length} items`);
            console.log(`📅 Storage timestamp: ${localStorage.getItem("deal_embeddings_timestamp")}`);
            
            // Calculate storage size
            const storageSize = new Blob([storedData]).size;
            console.log(`📦 LocalStorage usage: ${(storageSize / (1024 * 1024)).toFixed(2)} MB`);
          }
        } catch (err) {
          console.error("Error checking localStorage:", err);
        }
        
        toast({
          title: "Embeddings Generated Successfully",
          description: `Created embeddings for ${result.count} deals in collection: ${result.collectionName}`,
        });
      } else {
        console.error("❌ Failed to generate embeddings:", result.error);
        toast({
          title: "Error",
          description: result.error || "Failed to generate embeddings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating embeddings:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating embeddings",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  // Filter deals based on search and stage filter
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchesSearch = searchTerm === '' || 
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (deal.company && deal.company.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStage = filterStage === 'all' || deal.stage === filterStage;
      return matchesSearch && matchesStage;
    });
  }, [deals, searchTerm, filterStage]);

  const handleCreateDeal = async () => {
    if (!newDeal.name) return;
    
    await createDeal({
      ...newDeal,
      days_in_stage: 0
    });
    
    setNewDeal({
      name: '',
      company: '',
      value: 0,
      stage: 'prospecting',
      priority: 'medium',
      probability: 50
    });
    setIsCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-crm-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-crm-electric" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crm-primary flex">
      <CRMSidebar />
      
      <div className="flex-1 overflow-hidden">
        <div className="p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 flex-shrink-0">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Sales Pipeline</h1>
              <p className="text-crm-text-secondary">Manage your deals and track revenue</p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="bg-crm-tertiary border-crm-tertiary text-white hover:bg-crm-secondary"
                onClick={handleShowAllDeals}
              >
                <Database className="w-4 h-4 mr-2" />
                Show All Deals Data
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-crm-tertiary border-crm-tertiary text-white hover:bg-crm-secondary"
                onClick={handleGenerateEmbeddings}
                disabled={isGeneratingEmbeddings}
              >
                {isGeneratingEmbeddings ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Embeddings
                  </>
                )}
              </Button>
              
              <Link to="/deals-analytics">
                <Button variant="outline" className="bg-crm-secondary border-crm-tertiary text-white hover:bg-crm-tertiary">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-crm-electric hover:bg-crm-electric/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    New Deal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-crm-secondary border-crm-tertiary">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Deal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white block mb-2">Deal Name</label>
                      <Input
                        value={newDeal.name}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
                        placeholder="Enter deal name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white block mb-2">Company</label>
                      <Input
                        value={newDeal.company}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, company: e.target.value }))}
                        className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white block mb-2">Value ($)</label>
                      <Input
                        type="number"
                        value={newDeal.value}
                        onChange={(e) => setNewDeal(prev => ({ ...prev, value: Number(e.target.value) }))}
                        className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
                        placeholder="0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-white block mb-2">Priority</label>
                        <Select value={newDeal.priority} onValueChange={(value: any) => setNewDeal(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger className="bg-crm-tertiary border-crm-tertiary text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-crm-tertiary border-crm-tertiary">
                            <SelectItem value="low" className="text-white hover:bg-crm-secondary">Low</SelectItem>
                            <SelectItem value="medium" className="text-white hover:bg-crm-secondary">Medium</SelectItem>
                            <SelectItem value="high" className="text-white hover:bg-crm-secondary">High</SelectItem>
                            <SelectItem value="critical" className="text-white hover:bg-crm-secondary">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white block mb-2">Probability (%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newDeal.probability}
                          onChange={(e) => setNewDeal(prev => ({ ...prev, probability: Number(e.target.value) }))}
                          className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
                        />
                      </div>
                    </div>
                    <Button onClick={handleCreateDeal} className="w-full bg-crm-electric hover:bg-crm-electric/90 text-white">
                      Create Deal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex space-x-4 mb-8 flex-shrink-0">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-crm-secondary border-crm-tertiary text-white placeholder:text-gray-400 pl-10 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
              />
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-48 bg-crm-secondary border-crm-tertiary text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent className="bg-crm-tertiary border-crm-tertiary z-50">
                <SelectItem value="all" className="text-white hover:bg-crm-secondary">All Stages</SelectItem>
                <SelectItem value="prospecting" className="text-white hover:bg-crm-secondary">Prospecting</SelectItem>
                <SelectItem value="qualification" className="text-white hover:bg-crm-secondary">Qualification</SelectItem>
                <SelectItem value="proposal" className="text-white hover:bg-crm-secondary">Proposal</SelectItem>
                <SelectItem value="negotiation" className="text-white hover:bg-crm-secondary">Negotiation</SelectItem>
                <SelectItem value="closed-won" className="text-white hover:bg-crm-secondary">Closed Won</SelectItem>
                <SelectItem value="closed-lost" className="text-white hover:bg-crm-secondary">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Kanban Board - Pass filtered deals */}
          <div className="flex-1 overflow-hidden">
            <DealKanbanBoard searchTerm={searchTerm} filterStage={filterStage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deals;

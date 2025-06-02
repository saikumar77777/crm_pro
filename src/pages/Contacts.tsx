import React, { useState } from 'react';
import CRMSidebar from '../components/CRMSidebar';
import { Search, Plus, User, Bell, FileText, Circle, Brain, MessageSquare } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import CustomerPersonaBuilder from '@/components/CustomerPersonaBuilder';
import ContactDetails from '@/components/ContactDetails';

const Contacts = () => {
  const { contacts, loading, createContact } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isPersonaDialogOpen, setIsPersonaDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'lead' as const,
    notes: ''
  });

  const getStatusConfig = (status: string | null) => {
    const configs = {
      lead: { 
        label: 'New Lead', 
        className: 'bg-crm-status-lead/20 text-crm-status-lead border-crm-status-lead/50',
        leftBorder: 'border-l-crm-status-lead'
      },
      qualified: { 
        label: 'Qualified', 
        className: 'bg-crm-status-qualified/20 text-crm-status-qualified border-crm-status-qualified/50',
        leftBorder: 'border-l-crm-status-qualified'
      },
      opportunity: { 
        label: 'Opportunity', 
        className: 'bg-crm-status-opportunity/20 text-crm-status-opportunity border-crm-status-opportunity/50',
        leftBorder: 'border-l-crm-status-opportunity'
      },
      customer: { 
        label: 'Active Customer', 
        className: 'bg-crm-status-customer/20 text-crm-status-customer border-crm-status-customer/50',
        leftBorder: 'border-l-crm-status-customer'
      },
      vip: { 
        label: 'VIP Customer', 
        className: 'bg-gradient-to-r from-crm-status-vip/30 to-yellow-500/30 text-crm-status-vip border-crm-status-vip/50',
        leftBorder: 'border-l-crm-status-vip'
      },
      inactive: { 
        label: 'Inactive', 
        className: 'bg-crm-status-inactive/20 text-crm-status-inactive border-crm-status-inactive/50',
        leftBorder: 'border-l-crm-status-inactive'
      }
    };
    return configs[status as keyof typeof configs] || configs.lead;
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchTerm === '' ||
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateContact = async () => {
    if (!newContact.first_name || !newContact.last_name) return;
    
    await createContact(newContact);
    
    setNewContact({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      status: 'lead',
      notes: ''
    });
    setIsCreateDialogOpen(false);
  };

  const formatLastContact = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleOpenPersonaBuilder = (contact: any) => {
    setSelectedContact(contact);
    setIsPersonaDialogOpen(true);
  };

  const handleOpenContactDetails = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailsDialogOpen(true);
  };

  const renderContactCard = (contact: any) => {
    const statusConfig = getStatusConfig(contact.status);
    
    return (
      <div 
        key={contact.id}
        className={`bg-crm-secondary border border-crm-tertiary rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-crm-electric/50 ${statusConfig.leftBorder} border-l-4 cursor-pointer`}
        onClick={() => handleOpenContactDetails(contact)}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-medium text-white">
                {contact.first_name} {contact.last_name}
              </h3>
              {contact.company && (
                <p className="text-crm-text-secondary text-sm">
                  {contact.position && `${contact.position}, `}{contact.company}
                </p>
              )}
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {contact.email && (
              <p className="text-crm-text-secondary text-sm flex items-center">
                <svg className="w-4 h-4 mr-2 text-crm-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {contact.email}
              </p>
            )}
            {contact.phone && (
              <p className="text-crm-text-secondary text-sm flex items-center">
                <svg className="w-4 h-4 mr-2 text-crm-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {contact.phone}
              </p>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-crm-text-secondary">
              Last contact: {formatLastContact(contact.created_at)}
            </span>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-crm-tertiary text-crm-electric hover:bg-crm-tertiary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenContactDetails(contact);
                }}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-crm-tertiary text-purple-400 hover:bg-crm-tertiary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPersonaBuilder(contact);
                }}
              >
                <Brain className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-crm-text-white mb-2">
              Contact Management
            </h1>
            <p className="text-crm-text-secondary">
              Manage your customer relationships and track interactions
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-crm-electric to-crm-emerald hover:shadow-electric text-white">
                <Plus className="w-5 h-5 mr-2" />
                Add New Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-crm-secondary border-crm-tertiary">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">First Name *</label>
                    <Input
                      value={newContact.first_name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, first_name: e.target.value }))}
                      className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Last Name *</label>
                    <Input
                      value={newContact.last_name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, last_name: e.target.value }))}
                      className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-white block mb-2">Email</label>
                  <Input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400"
                    placeholder="john.doe@company.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Phone</label>
                    <Input
                      value={newContact.phone}
                      onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Company</label>
                    <Input
                      value={newContact.company}
                      onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                      className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400"
                      placeholder="Company Inc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Position</label>
                    <Input
                      value={newContact.position}
                      onChange={(e) => setNewContact(prev => ({ ...prev, position: e.target.value }))}
                      className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400"
                      placeholder="CEO"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white block mb-2">Status</label>
                    <Select value={newContact.status} onValueChange={(value: any) => setNewContact(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="bg-crm-tertiary border-crm-tertiary text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-crm-tertiary border-crm-tertiary">
                        <SelectItem value="lead" className="text-white hover:bg-crm-secondary">Lead</SelectItem>
                        <SelectItem value="qualified" className="text-white hover:bg-crm-secondary">Qualified</SelectItem>
                        <SelectItem value="opportunity" className="text-white hover:bg-crm-secondary">Opportunity</SelectItem>
                        <SelectItem value="customer" className="text-white hover:bg-crm-secondary">Customer</SelectItem>
                        <SelectItem value="vip" className="text-white hover:bg-crm-secondary">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-white block mb-2">Notes</label>
                  <Textarea
                    value={newContact.notes}
                    onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400"
                    placeholder="Additional notes about this contact..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateContact} className="w-full bg-crm-electric hover:bg-crm-electric/90 text-white">
                  Create Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="crm-card p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-crm-text-secondary" />
              <input
                type="text"
                placeholder="Search contacts by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-crm-tertiary border border-crm-tertiary rounded-lg pl-10 pr-4 py-3 text-crm-text-primary placeholder-crm-text-secondary focus:outline-none focus:ring-2 focus:ring-crm-electric/50 focus:border-crm-electric transition-all duration-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-crm-tertiary border-crm-tertiary text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-crm-tertiary border-crm-tertiary">
                <SelectItem value="all" className="text-white hover:bg-crm-secondary">All Statuses</SelectItem>
                <SelectItem value="lead" className="text-white hover:bg-crm-secondary">New Lead</SelectItem>
                <SelectItem value="qualified" className="text-white hover:bg-crm-secondary">Qualified</SelectItem>
                <SelectItem value="opportunity" className="text-white hover:bg-crm-secondary">Opportunity</SelectItem>
                <SelectItem value="customer" className="text-white hover:bg-crm-secondary">Customer</SelectItem>
                <SelectItem value="vip" className="text-white hover:bg-crm-secondary">VIP</SelectItem>
                <SelectItem value="inactive" className="text-white hover:bg-crm-secondary">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map(contact => renderContactCard(contact))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-crm-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-medium text-crm-text-white mb-2">No contacts found</h3>
            <p className="text-crm-text-secondary">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters.' 
                : 'Get started by adding your first contact.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="mt-4 bg-crm-electric hover:bg-blue-600 text-white"
              >
                Add Your First Contact
              </Button>
            )}
          </div>
        )}

        {/* Customer Persona Dialog */}
        <Dialog open={isPersonaDialogOpen} onOpenChange={setIsPersonaDialogOpen}>
          <DialogContent className="bg-crm-secondary border-crm-tertiary max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedContact && `${selectedContact.first_name} ${selectedContact.last_name}'s Persona`}
              </DialogTitle>
            </DialogHeader>
            {selectedContact && <CustomerPersonaBuilder contact={selectedContact} />}
          </DialogContent>
        </Dialog>
        
        {/* Contact Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="bg-crm-secondary border-crm-tertiary max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedContact && `${selectedContact.first_name} ${selectedContact.last_name}`}
              </DialogTitle>
            </DialogHeader>
            {selectedContact && <ContactDetails contact={selectedContact} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Contacts;

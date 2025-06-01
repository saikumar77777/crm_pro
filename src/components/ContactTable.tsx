
import React, { useState } from 'react';
import { User, Bell, Search, Plus, MoreHorizontal } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateContactDialog from './CreateContactDialog';

const ContactTable = () => {
  const { contacts, loading, createContact } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredContacts = contacts.filter(contact => 
    contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status: string | null) => {
    const configs = {
      lead: { 
        label: 'New Lead', 
        className: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      },
      qualified: { 
        label: 'Qualified', 
        className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
      },
      opportunity: { 
        label: 'Opportunity', 
        className: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      },
      customer: { 
        label: 'Active Customer', 
        className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      },
      vip: { 
        label: 'VIP Customer', 
        className: 'bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 text-yellow-400 border-yellow-500/50',
      },
      inactive: { 
        label: 'Inactive', 
        className: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      }
    };
    return configs[status as keyof typeof configs] || configs.lead;
  };

  const handleCreateContact = async (contactData: any) => {
    await createContact(contactData);
    setIsCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="crm-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-crm-tertiary rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-crm-tertiary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="crm-card p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-crm-text-white">Contacts ({contacts.length})</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crm-text-secondary" />
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control-dark pl-10 w-64 transition-all duration-200 focus:w-80"
              />
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-crm-electric hover:bg-blue-600 text-white transition-all duration-200 hover:shadow-electric"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-crm-tertiary">
          <ScrollArea className="h-[600px]">
            <table className="w-full">
              <thead className="bg-crm-tertiary sticky top-0 z-10">
                <tr>
                  <th className="text-left py-4 px-6 text-crm-text-primary font-medium">Contact</th>
                  <th className="text-left py-4 px-6 text-crm-text-primary font-medium">Company</th>
                  <th className="text-left py-4 px-6 text-crm-text-primary font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-crm-text-primary font-medium">Phone</th>
                  <th className="text-left py-4 px-6 text-crm-text-primary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => {
                  const statusConfig = getStatusConfig(contact.status);
                  const isEven = index % 2 === 0;
                  
                  return (
                    <tr 
                      key={contact.id}
                      className={`transition-all duration-200 hover:bg-crm-tertiary/50 animate-slideIn ${
                        isEven ? 'bg-crm-secondary' : 'bg-slate-800/50'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-crm-electric to-crm-emerald rounded-full flex items-center justify-center mr-3 transition-transform duration-200 hover:scale-110">
                            <span className="text-white font-medium text-sm">
                              {contact.first_name[0]}{contact.last_name[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-crm-text-white transition-colors duration-200 hover:text-crm-electric">
                              {contact.first_name} {contact.last_name}
                            </div>
                            <div className="text-sm text-crm-text-secondary transition-colors duration-200 hover:text-crm-text-white">
                              {contact.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-crm-text-secondary transition-colors duration-200 hover:text-crm-text-white">
                        {contact.company || 'No company'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`status-badge border transition-all duration-200 hover:scale-105 ${statusConfig.className}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-crm-text-secondary transition-colors duration-200 hover:text-crm-text-white">
                        {contact.phone || 'No phone'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="p-2 hover:bg-crm-tertiary rounded-lg transition-all duration-200 text-crm-text-secondary hover:text-crm-text-white"
                          >
                            <User className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="p-2 hover:bg-crm-tertiary rounded-lg transition-all duration-200 text-crm-text-secondary hover:text-crm-text-white"
                          >
                            <Bell className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="p-2 hover:bg-crm-tertiary rounded-lg transition-all duration-200 text-crm-text-secondary hover:text-crm-text-white"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-crm-tertiary border-crm-tertiary">
                              <DropdownMenuItem className="text-crm-text-white hover:bg-crm-secondary">
                                Edit Contact
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-crm-secondary">
                                Delete Contact
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-crm-text-secondary mx-auto mb-4" />
                <p className="text-crm-text-secondary text-lg">
                  {searchTerm ? 'No contacts found matching your search' : 'No contacts yet'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="mt-4 bg-crm-electric hover:bg-blue-600 text-white"
                  >
                    Create your first contact
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      <CreateContactDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateContact}
      />
    </>
  );
};

export default ContactTable;

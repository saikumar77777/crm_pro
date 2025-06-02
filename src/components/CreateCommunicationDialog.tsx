import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CreateCommunicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  contactId?: string;
  dealId?: string;
}

const CreateCommunicationDialog = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  contactId,
  dealId
}: CreateCommunicationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'email',
    subject: '',
    content: '',
    direction: 'outbound',
    status: 'sent',
    contact_id: contactId || '',
    deal_id: dealId || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add communications",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.subject.trim()) {
      toast({
        title: "Error",
        description: "Subject is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const communicationData = {
        ...formData,
        user_id: user.id,
        // Only include IDs if they're not empty strings
        contact_id: formData.contact_id || null,
        deal_id: formData.deal_id || null
      };
      
      // Submit to Supabase
      const { data, error } = await supabase
        .from('communications')
        .insert([communicationData])
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Communication added successfully"
      });
      
      // Reset form and close dialog
      setFormData({
        type: 'email',
        subject: '',
        content: '',
        direction: 'outbound',
        status: 'sent',
        contact_id: contactId || '',
        deal_id: dealId || ''
      });
      
      if (onSuccess) onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error('Error adding communication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add communication",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-crm-secondary border-crm-tertiary max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-crm-text-white">Add New Communication</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="text-crm-text-white">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger className="bg-crm-tertiary border-crm-tertiary text-crm-text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-crm-tertiary border-crm-tertiary text-crm-text-white">
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="direction" className="text-crm-text-white">Direction</Label>
              <Select
                value={formData.direction}
                onValueChange={(value) => handleChange('direction', value)}
              >
                <SelectTrigger className="bg-crm-tertiary border-crm-tertiary text-crm-text-white">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent className="bg-crm-tertiary border-crm-tertiary text-crm-text-white">
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject" className="text-crm-text-white">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="bg-crm-tertiary border-crm-tertiary text-crm-text-white"
              placeholder="Meeting summary, Call notes, etc."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="text-crm-text-white">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="bg-crm-tertiary border-crm-tertiary text-crm-text-white min-h-[120px]"
              placeholder="Details of the communication..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-crm-text-white">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger className="bg-crm-tertiary border-crm-tertiary text-crm-text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-crm-tertiary border-crm-tertiary text-crm-text-white">
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="opened">Opened</SelectItem>
                  <SelectItem value="clicked">Clicked</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-crm-tertiary text-crm-text-white hover:bg-crm-tertiary"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-crm-electric hover:bg-crm-electric/90 text-white"
            >
              {isSubmitting ? 'Adding...' : 'Add Communication'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunicationDialog; 
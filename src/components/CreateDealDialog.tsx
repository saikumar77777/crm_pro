
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CreateDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dealData: any) => void;
  stage: string;
}

const CreateDealDialog = ({ isOpen, onClose, onSubmit, stage }: CreateDealDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
    priority: 'medium',
    notes: '',
    probability: '50'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 50,
      stage,
      days_in_stage: 0
    });
    setFormData({
      name: '',
      company: '',
      value: '',
      priority: 'medium',
      notes: '',
      probability: '50'
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-crm-secondary border-crm-tertiary">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Deal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
              placeholder="Enter deal name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="company" className="text-white">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
              placeholder="Company name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value" className="text-white">Value ($)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
                placeholder="0"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="probability" className="text-white">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleChange('probability', e.target.value)}
                className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
                placeholder="50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="priority" className="text-white">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
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
            <Label htmlFor="notes" className="text-white">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric min-h-[80px]"
              placeholder="Add any notes about this deal..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-crm-tertiary text-gray-300 hover:text-white hover:bg-crm-tertiary"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-crm-electric hover:bg-blue-600 text-white"
            >
              Create Deal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDealDialog;

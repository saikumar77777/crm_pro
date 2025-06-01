
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Target, FileText } from 'lucide-react';

interface StageChangeDialogProps {
  isOpen: boolean;
  dealName: string;
  fromStage: string;
  toStage: string;
  onConfirm: (note: string, probability?: number) => void;
  onCancel: () => void;
}

const StageChangeDialog = ({ 
  isOpen, 
  dealName, 
  fromStage, 
  toStage, 
  onConfirm, 
  onCancel 
}: StageChangeDialogProps) => {
  const [note, setNote] = useState('');
  const [probability, setProbability] = useState<number>(50);

  const handleConfirm = () => {
    onConfirm(note, probability);
    setNote('');
    setProbability(50);
  };

  const handleCancel = () => {
    onCancel();
    setNote('');
    setProbability(50);
  };

  // Suggest probability based on stage
  const getSuggestedProbability = (stage: string) => {
    const stageProbabilities = {
      'Prospecting': 10,
      'Qualification': 25,
      'Proposal Sent': 50,
      'Negotiation': 75,
      'Closed Won': 100,
      'Closed Lost': 0
    };
    return stageProbabilities[stage as keyof typeof stageProbabilities] || 50;
  };

  React.useEffect(() => {
    setProbability(getSuggestedProbability(toStage));
  }, [toStage]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="bg-crm-secondary border-crm-tertiary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Move Deal to New Stage</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-white font-medium mb-4 text-lg">"{dealName}"</p>
            <div className="flex items-center justify-center space-x-3 text-sm">
              <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full font-medium">
                {fromStage}
              </span>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full font-medium">
                {toStage}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="probability" className="text-white flex items-center mb-2">
                <Target className="w-4 h-4 mr-2 text-crm-electric" />
                Deal Probability (%)
              </Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="bg-crm-tertiary border-crm-tertiary text-white focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
              />
              <p className="text-xs text-gray-400 mt-1">
                Suggested: {getSuggestedProbability(toStage)}% for {toStage}
              </p>
            </div>

            <div>
              <Label htmlFor="note" className="text-white flex items-center mb-2">
                <FileText className="w-4 h-4 mr-2 text-crm-electric" />
                Add a note about this stage change (optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What happened to move this deal forward?"
                className="bg-crm-tertiary border-crm-tertiary text-white placeholder:text-gray-400 focus:border-crm-electric focus:ring-1 focus:ring-crm-electric"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-crm-tertiary text-gray-300 hover:text-white hover:bg-crm-tertiary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-crm-electric hover:bg-blue-600 text-white"
            >
              Move Deal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StageChangeDialog;

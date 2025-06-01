
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Deal {
  id: string;
  name: string;
  company: string | null;
  value: number;
  priority: string | null;
  stage: string;
  days_in_stage: number | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
  contact_id: string | null;
  expected_close_date: string | null;
  probability: number | null;
  notes: string | null;
}

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDeals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error: any) {
      console.error('Error fetching deals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDeal = async (dealData: Partial<Deal> & { name: string; value: number }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('deals')
        .insert([{
          ...dealData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setDeals(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Deal created successfully"
      });
      return data;
    } catch (error: any) {
      console.error('Error creating deal:', error);
      toast({
        title: "Error",
        description: "Failed to create deal",
        variant: "destructive"
      });
    }
  };

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDeals(prev => prev.map(deal => deal.id === id ? data : deal));
      return data;
    } catch (error: any) {
      console.error('Error updating deal:', error);
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [user]);

  return {
    deals,
    loading,
    createDeal,
    updateDeal,
    refetch: fetchDeals
  };
};

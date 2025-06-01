import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches all deals with their related information
 * This is the first step in preparing data for vector embeddings
 */
export async function getAllDeals() {
  try {
    // 1. Fetch all deals
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (dealsError) throw dealsError;
    
    // 2. Fetch all contacts to associate with deals
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*');
    
    if (contactsError) throw contactsError;
    
    // 3. Fetch all communications related to deals
    const { data: communications, error: commsError } = await supabase
      .from('communications')
      .select('*');
    
    if (commsError) throw commsError;
    
    // 4. Associate contacts and communications with each deal
    const dealsWithRelations = deals.map(deal => {
      // Find associated contact
      const dealContact = contacts.find(c => c.id === deal.contact_id);
      
      // Find communications for this deal
      const dealComms = communications.filter(c => c.deal_id === deal.id);
      
      // Return enriched deal object
      return {
        ...deal,
        contact: dealContact || null,
        communications: dealComms || []
      };
    });
    
    return { 
      success: true, 
      deals: dealsWithRelations,
      count: dealsWithRelations.length
    };
  } catch (error) {
    console.error('Error fetching all deals:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
} 
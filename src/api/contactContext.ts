import { supabase } from '@/integrations/supabase/client';

/**
 * Retrieves comprehensive contact context for AI analysis
 * @param contactId The ID of the contact to retrieve context for
 * @returns Object containing contact data, communications, deals, and activities
 */
export async function getContactContext(contactId: string) {
  console.log(`Getting contact context for ID: ${contactId}`);
  
  try {
    // Get contact data
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    
    if (contactError) {
      console.error("Error fetching contact:", contactError);
      throw contactError;
    }
    
    console.log("Contact basic info retrieved");
    
    // Get communications associated with this contact
    const { data: communications, error: commsError } = await supabase
      .from('communications')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });
    
    if (commsError) {
      console.error("Error fetching communications:", commsError);
      throw commsError;
    }
    
    console.log(`Retrieved ${communications?.length || 0} communications`);
    
    // Get deals associated with contact
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });
    
    if (dealsError) {
      console.error("Error fetching deals:", dealsError);
      throw dealsError;
    }
    
    console.log(`Retrieved ${deals?.length || 0} deals`);
    
    // Get activities associated with contact
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });
    
    if (activitiesError) {
      console.error("Error fetching activities:", activitiesError);
      throw activitiesError;
    }
    
    console.log(`Retrieved ${activities?.length || 0} activities`);
    
    // Enrich communications with sentiment analysis (mock for now)
    const enrichedCommunications = communications?.map(comm => ({
      ...comm,
      // This would be replaced with actual sentiment analysis in production
      sentiment: getSentimentMock(comm.content || ""),
      // Add response time if this is a reply to a previous communication
      responseTime: getResponseTimeMock(),
      // Add placeholder for user email since we don't have the relationship
      user: { email: "user@example.com" }  // Default placeholder
    }));
    
    return {
      contact,
      communications: enrichedCommunications || [],
      deals: deals || [],
      activities: activities || []
    };
  } catch (error) {
    console.error("Error getting contact context:", error);
    throw error;
  }
}

// Mock function for sentiment analysis - would be replaced with actual NLP in production
function getSentimentMock(content: string): { score: number, label: string } {
  // Simple mock based on content length - real implementation would use NLP
  const randomScore = Math.random();
  let label = "neutral";
  
  if (randomScore > 0.7) label = "positive";
  if (randomScore < 0.3) label = "negative";
  
  return {
    score: randomScore,
    label
  };
}

// Mock function for response time - would be calculated from actual timestamps in production
function getResponseTimeMock(): { hours: number, isQuick: boolean } {
  const hours = Math.floor(Math.random() * 48);
  return {
    hours,
    isQuick: hours < 4
  };
} 
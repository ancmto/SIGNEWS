import { supabase } from './supabase';

export const dashboardService = {
  async getDashboardStats() {
    // In a real app, these might come from specific tables or counts
    // For now, we return some counts based on our tables where possible
    const { count: contactsCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    return {
      pautas: 24, // Mocked for now until pautas table exists
      reportagens: 18, // Mocked
      espelhos: 4, // Mocked
      contacts: contactsCount || 0
    };
  },

  async getRecentActivity() {
    const { data, error } = await supabase
      .from('recent_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data;
  },

  async getExternalTeams() {
    const { data, error } = await supabase
      .from('external_teams')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }
};

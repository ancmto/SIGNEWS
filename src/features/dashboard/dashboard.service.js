import { supabase } from '@/components/common/supabase';
import { pautaService } from '@/features/pautas/pauta.service';

export const dashboardService = {
  async getDashboardStats() {
    const { count: contactsCount } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    const pautaStats = await pautaService.getStats();

    const { count: reportagensCount } = await supabase
      .from('reportagens')
      .select('*', { count: 'exact', head: true });

    return {
      pautas: pautaStats.total,
      pautasPending: pautaStats.pending,
      pautasApproved: pautaStats.approved,
      reportagens: reportagensCount || 0,
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

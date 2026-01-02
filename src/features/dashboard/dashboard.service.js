import { supabase } from '@/components/common/supabase';
import { pautaService } from '@/features/pautas/pauta.service';

export const dashboardService = {
  async getDashboardStats() {
    try {
      // Buscar contatos
      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      // Buscar estatísticas de pautas
      const pautaStats = await pautaService.getStats();

      // Buscar reportagens
      const { count: reportagensCount } = await supabase
        .from('reportagens')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null);

      // Buscar espelhos do dia
      const today = new Date().toISOString().split('T')[0];
      const { count: espelhosCount } = await supabase
        .from('espelhos')
        .select('*', { count: 'exact', head: true })
        .eq('data_exibicao', today)
        .is('deleted_at', null);

      return {
        pautas: pautaStats.total,
        pautasPending: pautaStats.pending,
        pautasApproved: pautaStats.approved,
        reportagens: reportagensCount || 0,
        espelhos: espelhosCount || 0,
        contacts: contactsCount || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      return {
        pautas: 0,
        pautasPending: 0,
        pautasApproved: 0,
        reportagens: 0,
        espelhos: 0,
        contacts: 0
      };
    }
  },

  async getRecentActivity() {
    try {
      const { data, error } = await supabase
        .from('recent_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      return [];
    }
  },

  async getExternalTeams() {
    try {
      const { data, error } = await supabase
        .from('external_teams')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar equipes externas:', error);
      return [];
    }
  },

  async getEspelhosStatus() {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('espelhos')
        .select(`
          *,
          programa:programas(nome, descricao)
        `)
        .eq('data_exibicao', today)
        .is('deleted_at', null)
        .order('horario_previsto', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar status dos espelhos:', error);
      return [];
    }
  }
};

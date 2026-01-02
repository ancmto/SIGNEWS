import { supabase } from '@/components/common/supabase';

export const espelhoService = {
  // ============================================
  // PROGRAMAS
  // ============================================
  getProgramas: async () => {
    const { data, error } = await supabase
      .from('programas')
      .select('*')
      .eq('ativo', true)
      .is('deleted_at', null)
      .order('nome');

    if (error) throw error;
    return data || [];
  },

  createPrograma: async (programa) => {
    const { data, error } = await supabase
      .from('programas')
      .insert([programa])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============================================
  // ESPELHOS
  // ============================================
  getAll: async () => {
    const { data, error } = await supabase
      .from('espelhos')
      .select(`
        *,
        programas:programa_id (
          id,
          nome
        )
      `)
      .is('deleted_at', null)
      .order('data_exibicao', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getByDateAndProgram: async (date, programId) => {
    const { data, error } = await supabase
      .from('espelhos')
      .select(`
        *,
        programas:programa_id (
          id,
          nome,
          duracao_padrao
        ),
        blocos (
          id,
          ordem,
          titulo,
          duracao_prevista,
          duracao_real,
          rundown_items (
            id,
            ordem,
            tipo,
            titulo,
            detalhes,
            talento,
            reporter,
            editor_video,
            origem,
            duracao_prevista,
            duracao_real,
            status,
            reportagem_id
          )
        )
      `)
      .eq('data_exibicao', date)
      .eq('programa_id', programId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw error;
    }

    // Ordena blocos e items
    if (data?.blocos) {
      data.blocos.sort((a, b) => a.ordem - b.ordem);
      data.blocos.forEach(bloco => {
        if (bloco.rundown_items) {
          bloco.rundown_items.sort((a, b) => a.ordem - b.ordem);
        }
      });
    }

    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('espelhos')
      .select(`
        *,
        programas:programa_id (
          id,
          nome,
          duracao_padrao
        ),
        blocos (
          id,
          ordem,
          titulo,
          duracao_prevista,
          duracao_real,
          rundown_items (
            id,
            ordem,
            tipo,
            titulo,
            detalhes,
            talento,
            reporter,
            editor_video,
            origem,
            duracao_prevista,
            duracao_real,
            status,
            reportagem_id
          )
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) throw error;

    // Ordena blocos e items
    if (data?.blocos) {
      data.blocos.sort((a, b) => a.ordem - b.ordem);
      data.blocos.forEach(bloco => {
        if (bloco.rundown_items) {
          bloco.rundown_items.sort((a, b) => a.ordem - b.ordem);
        }
      });
    }

    return data;
  },

  create: async (espelho) => {
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('espelhos')
      .insert([{
        ...espelho,
        created_by: userData?.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  createWithBlocos: async (espelho, blocos = []) => {
    const { data: userData } = await supabase.auth.getUser();

    // Cria o espelho
    const { data: espelhoData, error: espelhoError } = await supabase
      .from('espelhos')
      .insert([{
        ...espelho,
        created_by: userData?.user?.id
      }])
      .select()
      .single();

    if (espelhoError) throw espelhoError;

    // Cria os blocos com seus items
    if (blocos.length > 0) {
      for (let i = 0; i < blocos.length; i++) {
        const bloco = blocos[i];
        const { data: blocoData, error: blocoError } = await supabase
          .from('blocos')
          .insert([{
            espelho_id: espelhoData.id,
            ordem: i + 1,
            titulo: bloco.titulo,
            duracao_prevista: bloco.duracao_prevista
          }])
          .select()
          .single();

        if (blocoError) throw blocoError;

        // Cria os rundown items do bloco
        if (bloco.items && bloco.items.length > 0) {
          const items = bloco.items.map((item, idx) => ({
            bloco_id: blocoData.id,
            ordem: idx + 1,
            ...item
          }));

          const { error: itemsError } = await supabase
            .from('rundown_items')
            .insert(items);

          if (itemsError) throw itemsError;
        }
      }
    }

    return espelhoData;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('espelhos')
      .update(updates)
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('espelhos')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  // ============================================
  // BLOCOS
  // ============================================
  createBloco: async (bloco) => {
    const { data, error } = await supabase
      .from('blocos')
      .insert([bloco])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateBloco: async (id, updates) => {
    const { data, error } = await supabase
      .from('blocos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteBloco: async (id) => {
    const { error } = await supabase
      .from('blocos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ============================================
  // RUNDOWN ITEMS
  // ============================================
  createRundownItem: async (item) => {
    const { data, error } = await supabase
      .from('rundown_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateRundownItem: async (id, updates) => {
    const { data, error } = await supabase
      .from('rundown_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteRundownItem: async (id) => {
    const { error } = await supabase
      .from('rundown_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  reorderRundownItems: async (blocoId, itemsOrder) => {
    // itemsOrder = [{ id, ordem }]
    const updates = itemsOrder.map(item =>
      supabase
        .from('rundown_items')
        .update({ ordem: item.ordem })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(r => r.error);
    if (errors.length > 0) throw errors[0].error;
  },

  // ============================================
  // COMENTÁRIOS
  // ============================================
  getComentarios: async (espelhoId) => {
    const { data, error } = await supabase
      .from('espelho_comentarios')
      .select(`
        *,
        user:user_id (
          id,
          email
        )
      `)
      .eq('espelho_id', espelhoId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  createComentario: async (espelhoId, mensagem) => {
    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('espelho_comentarios')
      .insert([{
        espelho_id: espelhoId,
        user_id: userData?.user?.id,
        mensagem
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============================================
  // HELPERS
  // ============================================
  secondsToHMS: (seconds) => {
    if (!seconds) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  hmsToSeconds: (hms) => {
    if (!hms) return 0;
    const parts = hms.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }
};

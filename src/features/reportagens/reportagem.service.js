import { supabase } from '@/components/common/supabase';

export const reportagemService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('reportagens')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data.map(item => ({
      ...item,
      updatedAt: item.updated_at,
      createdAt: item.created_at
    }));
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('reportagens')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      updatedAt: data.updated_at,
      createdAt: data.created_at
    };
  },

  save: async (reportData) => {
    const payload = {
      titulo: reportData.titulo,
      lead: reportData.lead,
      corpo: reportData.corpo,
      status: reportData.status,
      programa: reportData.programa,
      reporter: reportData.reporter,
      editor: reportData.editor,
      duracao: reportData.duracao,
      pauta_id: reportData.pauta_id || null,
      version: reportData.version || 'V1',
      ultimo_comentario: reportData.ultimo_comentario,
      nas_links: reportData.nas_links || {},
      updated_at: new Date().toISOString()
    };

    if (reportData.id && reportData.id.length > 20) { // Check if it's a UUID
      const { data, error } = await supabase
        .from('reportagens')
        .update(payload)
        .eq('id', reportData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('reportagens')
        .insert([{ ...payload, created_at: new Date().toISOString() }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('reportagens')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
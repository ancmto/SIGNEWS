import { supabase } from '@/components/common/supabase';

export const pautaService = {
  async getAll() {
    const { data, error } = await supabase
      .from('pautas')
      .select('*, pauta_comments(*), pauta_contacts(contact_id)')
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(p => this._formatPauta(p));
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('pautas')
      .select('*, pauta_comments(*), pauta_contacts(contact_id)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return this._formatPauta(data);
  },

  _formatPauta(p) {
    return {
      ...p,
      dataVeiculacao: p.data_veiculacao,
      comments: (p.pauta_comments || []).map(c => ({
        id: c.id,
        user: c.user_name,
        text: c.content,
        date: c.created_at
      })).sort((a, b) => new Date(b.date) - new Date(a.date)),
      contatosNodes: (p.pauta_contacts || []).map(pc => pc.contact_id),
      localizacao: p.localizacao || null,
      localizacaoTexto: p.localizacao_texto || '',
      workflowSteps: p.workflow_steps || []
    };
  },

  async getStats() {
    const { data, error } = await supabase
      .from('pautas')
      .select('status')
      .eq('active', true);
    
    if (error) throw error;
    
    const total = data.length;
    const approved = data.filter(p => p.status === 'aprovado').length;
    const pending = total - approved;
    
    return { total, pending, approved };
  },

  async save(pauta) {
    const { contatosNodes, comments, id, ...rest } = pauta;
    
    const pautaData = {
      titulo: rest.titulo,
      descricao: rest.descricao,
      editoria: rest.editoria,
      jornalista: rest.jornalista,
      camera: rest.camera,
      editor: rest.editor,
      data_veiculacao: rest.dataVeiculacao,
      prioridade: rest.prioridade,
      status: rest.status,
      localizacao: rest.localizacao,
      localizacao_texto: rest.localizacaoTexto,
      workflow_steps: rest.workflowSteps || [],
      active: true
    };

    let result;
    if (id) {
      const { data, error } = await supabase
        .from('pautas')
        .update(pautaData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // If new, initialize basic workflow step
      if (!pautaData.workflow_steps || pautaData.workflow_steps.length === 0) {
        pautaData.workflow_steps = [{
          step: 'Criado',
          user: rest.createdBy || 'Sistema',
          date: new Date().toISOString(),
          status: 'completed'
        }];
      }
      
      const { data, error } = await supabase
        .from('pautas')
        .insert([pautaData])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    // Handle Contacts Junction
    if (contatosNodes !== undefined) {
      await supabase.from('pauta_contacts').delete().eq('pauta_id', result.id);
      if (contatosNodes && contatosNodes.length > 0) {
        const contactInserts = contatosNodes.map(cid => ({
          pauta_id: result.id,
          contact_id: cid
        }));
        const { error: junctionError } = await supabase.from('pauta_contacts').insert(contactInserts);
        if (junctionError) throw junctionError;
      }
    }

    return result;
  },

  async addComment(pautaId, comment) {
    const { data, error } = await supabase
      .from('pauta_comments')
      .insert([{
        pauta_id: pautaId,
        user_name: comment.user,
        content: comment.text
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      user: data.user_name,
      text: data.content,
      date: data.created_at
    };
  },

  async delete(id) {
    const { error } = await supabase
      .from('pautas')
      .update({ active: false })
      .eq('id', id);
    if (error) throw error;
  },

  async getLocations(query = '') {
    let q = supabase.from('mozambique_locations').select('*');
    if (query) {
      q = q.ilike('name', `%${query}%`);
    }
    const { data, error } = await q.limit(10);
    if (error) throw error;
    return data;
  },

  async getAppSettings(key) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .single();
    if (error) return null;
    return data.value;
  },

  async updateAppSettings(key, value) {
    const { error } = await supabase
      .from('app_settings')
      .update({ value })
      .eq('key', key);
    if (error) throw error;
  }
};
import { supabase } from '@/components/common/supabase';

export const contactsService = {
  async getContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getContactById(id) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*, contact_participations(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createContact(contactData) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateContact(id, contactData) {
    const { data, error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteContact(id) {
    const { error } = await supabase
      .from('contacts')
      .update({ active: false })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async addParticipation(participationData) {
    const { data, error } = await supabase
      .from('contact_participations')
      .insert([participationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

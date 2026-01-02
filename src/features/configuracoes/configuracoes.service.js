import { supabase } from '@/components/common/supabase';

// Mock data para desenvolvimento - substituir por dados reais do Supabase quando as tabelas forem criadas
const mockUsers = [
  {
    id: '1',
    name: 'Ricardo Mendes',
    email: 'ricardo.mendes@ecotv.com.br',
    role: 'Editor Chefe',
    status: 'Ativo',
    lastAccess: '2025-01-02 13:45',
    avatarUrl: 'https://ui-avatars.com/api/?name=Ricardo+Mendes&background=7f13ec&color=fff',
    permissionsType: 'Total'
  },
  {
    id: '2',
    name: 'Ana Silva',
    email: 'ana.silva@ecotv.com.br',
    role: 'Produtor',
    status: 'Ativo',
    lastAccess: '2025-01-02 12:30',
    avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Silva&background=7f13ec&color=fff',
    permissionsType: 'Limitado'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@ecotv.com.br',
    role: 'Repórter',
    status: 'Ativo',
    lastAccess: '2025-01-02 11:15',
    avatarUrl: 'https://ui-avatars.com/api/?name=Carlos+Oliveira&background=7f13ec&color=fff',
    permissionsType: 'Limitado'
  }
];

const mockAuditLogs = [
  {
    id: '1',
    timestamp: '2025-01-02 13:45:22',
    userName: 'Ricardo Mendes',
    userAvatar: 'https://ui-avatars.com/api/?name=Ricardo+Mendes&background=7f13ec&color=fff',
    module: 'Pautas',
    actionType: 'Criação',
    details: 'Criou nova pauta "Reportagem sobre meio ambiente"'
  },
  {
    id: '2',
    timestamp: '2025-01-02 12:30:15',
    userName: 'Ana Silva',
    userAvatar: 'https://ui-avatars.com/api/?name=Ana+Silva&background=7f13ec&color=fff',
    module: 'Reportagens',
    actionType: 'Edição',
    details: 'Editou reportagem "Economia em Alta"'
  },
  {
    id: '3',
    timestamp: '2025-01-02 11:15:47',
    userName: 'Carlos Oliveira',
    userAvatar: 'https://ui-avatars.com/api/?name=Carlos+Oliveira&background=7f13ec&color=fff',
    module: 'Contatos',
    actionType: 'Criação',
    details: 'Adicionou novo contato "Dr. João Santos"'
  }
];

export const configuracoesService = {
  // Usuários
  async getUsers() {
    // Simulando delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;

    // Quando a tabela estiver criada no Supabase, usar:
    // const { data, error } = await supabase
    //   .from('users')
    //   .select('*')
    //   .order('name');
    // if (error) throw error;
    // return data;
  },

  async getUserById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.find(user => user.id === id);

    // const { data, error } = await supabase
    //   .from('users')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    // if (error) throw error;
    // return data;
  },

  async createUser(userData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = {
      id: String(mockUsers.length + 1),
      ...userData,
      status: 'Ativo',
      lastAccess: new Date().toLocaleString('pt-BR'),
      avatarUrl: `https://ui-avatars.com/api/?name=${userData.name}&background=7f13ec&color=fff`
    };
    mockUsers.push(newUser);
    return newUser;

    // const { data, error } = await supabase
    //   .from('users')
    //   .insert([userData])
    //   .select()
    //   .single();
    // if (error) throw error;
    // return data;
  },

  async updateUser(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockUsers.findIndex(user => user.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData };
      return mockUsers[index];
    }
    throw new Error('Usuário não encontrado');

    // const { data, error } = await supabase
    //   .from('users')
    //   .update(userData)
    //   .eq('id', id)
    //   .select()
    //   .single();
    // if (error) throw error;
    // return data;
  },

  async deleteUser(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockUsers.findIndex(user => user.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }

    // const { error } = await supabase
    //   .from('users')
    //   .delete()
    //   .eq('id', id);
    // if (error) throw error;
  },

  // Auditoria
  async getAuditLogs() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAuditLogs;

    // const { data, error } = await supabase
    //   .from('audit_logs')
    //   .select('*')
    //   .order('timestamp', { ascending: false });
    // if (error) throw error;
    // return data;
  }
};

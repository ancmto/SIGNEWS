// Simulação de dados para visualização imediata baseada no seu HTML
const mockTrash = [
  {
    id: 'trash-1',
    titulo: 'Entrevista Prefeito - Inauguração',
    itemType: 'pautas',
    categoria: 'Política Local',
    deletedBy: 'Carlos Lima',
    deletedAt: '08 Out 2023, 11:15',
    createdAt: '05 Out 2023'
  },
  {
    id: 'trash-2',
    titulo: 'Agenda Cultural: Final de Semana',
    itemType: 'pautas',
    categoria: 'Cultura',
    deletedBy: 'João Silva',
    deletedAt: '05 Out 2023, 08:20',
    createdAt: '01 Out 2023'
  }
];

export const trashService = {
  getTrashByType: async (type) => {
    const data = localStorage.getItem('sgi_trash_global');
    const allItems = data ? JSON.parse(data) : mockTrash; 
    // Garante que o localStorage tenha dados iniciais se estiver vazio
    if (!data) localStorage.setItem('sgi_trash_global', JSON.stringify(mockTrash));
    
    return allItems.filter(item => item.itemType === type);
  },

  restoreItem: (id) => {
    const data = JSON.parse(localStorage.getItem('sgi_trash_global') || '[]');
    const filtered = data.filter(item => item.id !== id);
    localStorage.setItem('sgi_trash_global', JSON.stringify(filtered));
  },

  emptyTrash: () => {
    localStorage.setItem('sgi_trash_global', JSON.stringify([]));
  }
};
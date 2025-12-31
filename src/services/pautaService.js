const STORAGE_KEY = 'sgi_pautas';

// Mock inicial para a aplicação não nascer vazia
const initialData = [
  {
    id: '4092',
    titulo: 'Incêndio no Centro Histórico',
    descricao: 'Incêndio de grandes proporções atinge prédio comercial...',
    editoria: 'Sociedade',
    jornalista: 'Ana Souza',
    camera: 'Ricardo Zoom',
    dataVeiculacao: '2023-08-14',
    prioridade: 'high',
    status: 'producao',
    contatos: [{ nome: 'Tenente Marcos', cargo: 'Bombeiros', telefone: '(11) 99876-5432' }]
  }
];

export const pautaService = {
  getAll: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data);
  },

  getById: (id) => {
    const pautas = pautaService.getAll();
    return pautas.find(p => p.id === id);
  },

  save: (pauta) => {
    const pautas = pautaService.getAll();
    if (pauta.id) {
      // Edit
      const index = pautas.findIndex(p => p.id === pauta.id);
      pautas[index] = pauta;
    } else {
      // Create
      pauta.id = Math.floor(Math.random() * 10000).toString();
      pautas.push(pauta);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pautas));
    return pauta;
  },

  delete: (id) => {
    const pautas = pautaService.getAll().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pautas));
  },

  updateStatus: (id, newStatus) => {
    const pautas = pautaService.getAll();
    const index = pautas.findIndex(p => p.id === id);
    if (index !== -1) {
      pautas[index].status = newStatus;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pautas));
    }
  }
};
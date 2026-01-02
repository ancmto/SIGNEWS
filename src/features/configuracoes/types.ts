
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo';
  lastAccess: string;
  avatarUrl: string;
  permissionsType: 'Total' | 'Limitado' | 'Customizado';
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  userName: string;
  userAvatar: string;
  module: string;
  actionType: string;
  details: string;
}

export enum UserRole {
  ADMIN = 'Administrador',
  EDITOR = 'Editor Chefe',
  PRODUCER = 'Produtor',
  REPORTER = 'Repórter'
}

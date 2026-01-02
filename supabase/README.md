# Estrutura do Banco de Dados - SIGNEWS

## 📋 Visão Geral

Este documento descreve a estrutura completa do banco de dados do sistema SIGNEWS, incluindo tabelas, relacionamentos e permissões.

## 🗄️ Tabelas Principais

### 1. **users** - Usuários do Sistema

Armazena informações dos usuários do sistema.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `name` (VARCHAR) - Nome completo do usuário
- `email` (VARCHAR, UNIQUE) - Email (usado para login)
- `role` (VARCHAR) - Função no sistema
  - Valores: `Administrador`, `Editor Chefe`, `Produtor`, `Repórter`
- `status` (VARCHAR) - Status do usuário
  - Valores: `Ativo`, `Inativo`
- `permissions_type` (VARCHAR) - Tipo de permissões
  - `Total`: Acesso completo (admin)
  - `Limitado`: Permissões padrão baseadas no role
  - `Customizado`: Permissões personalizadas
- `avatar_url` (TEXT) - URL do avatar
- `last_access` (TIMESTAMP) - Último acesso ao sistema
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Índices:**
- `idx_users_email` - Busca por email
- `idx_users_role` - Filtro por role
- `idx_users_status` - Filtro por status

---

### 2. **user_permissions** - Permissões Customizadas

Armazena permissões específicas por usuário e módulo.

**Campos:**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `module` (VARCHAR) - Módulos: Planejamento, Produção, Aprovação, Exibição, Sistema
- `can_view`, `can_create`, `can_edit`, `can_delete` (BOOLEAN)

---

### 3. **audit_logs** - Logs de Auditoria

Registra todas as ações dos usuários.

**Campos:**
- `id`, `user_id`, `user_name`, `module`, `action_type`
- `entity_type`, `entity_id`, `details`, `metadata` (JSONB)
- `ip_address`, `user_agent`, `created_at`

---

### 4. **role_templates** - Templates de Permissões

Define permissões padrão por role.

---

## 🚀 Como Aplicar a Migration

### Via Supabase Dashboard:
1. Acesse SQL Editor
2. Copie `migrations/20250102_create_users_and_audit.sql`
3. Execute

---

## 📝 Dados de Exemplo Inclusos

- 4 usuários exemplo
- 4 templates de roles
- 3 logs de auditoria

---

## 🔐 Segurança

⚠️ **Sem RLS** - Para desenvolvimento apenas.

Para produção, implementar:
- Supabase Auth
- RLS policies
- Criptografia

---

## 📚 Consultas Úteis

```sql
-- Usuário com permissões
SELECT * FROM users_with_permissions WHERE email = 'user@example.com';

-- Logs de um usuário
SELECT * FROM audit_logs WHERE user_id = '...' ORDER BY created_at DESC;

-- Estatísticas
SELECT * FROM audit_stats WHERE date >= CURRENT_DATE - 30;
```

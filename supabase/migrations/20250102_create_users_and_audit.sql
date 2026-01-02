-- =====================================================
-- MIGRATION: Sistema de Usuários e Auditoria
-- Data: 2025-01-02
-- Descrição: Tabelas para gestão de usuários, permissões e auditoria
-- =====================================================

-- =====================================================
-- 1. TABELA DE USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Administrador', 'Editor Chefe', 'Produtor', 'Repórter')),
  status VARCHAR(20) NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  permissions_type VARCHAR(20) NOT NULL DEFAULT 'Limitado' CHECK (permissions_type IN ('Total', 'Limitado', 'Customizado')),
  avatar_url TEXT,
  last_access TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  updated_by UUID REFERENCES public.users(id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- Comentários na tabela
COMMENT ON TABLE public.users IS 'Tabela de usuários do sistema com informações de autenticação e perfil';
COMMENT ON COLUMN public.users.permissions_type IS 'Tipo de permissões: Total (admin), Limitado (padrão por role), Customizado (personalizado)';

-- =====================================================
-- 2. TABELA DE PERMISSÕES CUSTOMIZADAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module VARCHAR(50) NOT NULL CHECK (module IN ('Planejamento', 'Produção', 'Aprovação', 'Exibição', 'Sistema')),
  can_view BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_module ON public.user_permissions(module);

COMMENT ON TABLE public.user_permissions IS 'Permissões customizadas por usuário e módulo';

-- =====================================================
-- 3. TABELA DE LOGS DE AUDITORIA
-- =====================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL,
  user_avatar TEXT,
  module VARCHAR(50) NOT NULL,
  action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('Criação', 'Edição', 'Exclusão', 'Visualização', 'Login', 'Logout', 'Aprovação', 'Rejeição')),
  entity_type VARCHAR(50), -- Tipo da entidade afetada (ex: 'pauta', 'reportagem', 'contato')
  entity_id UUID, -- ID da entidade afetada
  details TEXT NOT NULL,
  metadata JSONB, -- Dados adicionais em formato JSON
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON public.audit_logs(module);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_type ON public.audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

COMMENT ON TABLE public.audit_logs IS 'Registro completo de todas as ações dos usuários no sistema';
COMMENT ON COLUMN public.audit_logs.metadata IS 'Dados adicionais da ação em formato JSON (ex: valores antes/depois)';

-- =====================================================
-- 4. TABELA DE PERFIS DE PERMISSÃO (ROLES)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.role_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL, -- Estrutura JSON com permissões padrão
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.role_templates IS 'Templates de permissões padrão para cada função/role';

-- =====================================================
-- 5. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_permissions_updated_at ON public.user_permissions;
CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_templates_updated_at ON public.role_templates;
CREATE TRIGGER update_role_templates_updated_at
  BEFORE UPDATE ON public.role_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. FUNÇÃO PARA REGISTRAR AUDITORIA AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
  action_type_var VARCHAR(50);
  user_data RECORD;
BEGIN
  -- Determinar tipo de ação
  IF (TG_OP = 'INSERT') THEN
    action_type_var := 'Criação';
  ELSIF (TG_OP = 'UPDATE') THEN
    action_type_var := 'Edição';
  ELSIF (TG_OP = 'DELETE') THEN
    action_type_var := 'Exclusão';
  END IF;

  -- Buscar dados do usuário (assumindo que existe uma variável de sessão ou auth.uid())
  -- Para Supabase, você pode usar auth.uid() para pegar o usuário autenticado
  -- Aqui vamos usar um placeholder, ajuste conforme sua implementação de autenticação

  -- Inserir log de auditoria
  INSERT INTO public.audit_logs (
    user_id,
    user_name,
    module,
    action_type,
    entity_type,
    entity_id,
    details,
    metadata
  ) VALUES (
    COALESCE(current_setting('app.current_user_id', true)::UUID, NULL),
    COALESCE(current_setting('app.current_user_name', true), 'Sistema'),
    TG_TABLE_NAME,
    action_type_var,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    format('%s: %s', action_type_var, TG_TABLE_NAME),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. INSERIR TEMPLATES DE PERMISSÕES PADRÃO
-- =====================================================
INSERT INTO public.role_templates (role_name, display_name, description, permissions) VALUES
  ('Administrador', 'Administrador', 'Acesso total ao sistema',
    '{"Planejamento": {"view": true, "create": true, "edit": true, "delete": true}, "Produção": {"view": true, "create": true, "edit": true, "delete": true}, "Aprovação": {"view": true, "create": true, "edit": true, "delete": true}, "Exibição": {"view": true, "create": true, "edit": true, "delete": true}, "Sistema": {"view": true, "create": true, "edit": true, "delete": true}}'::jsonb
  ),
  ('Editor Chefe', 'Editor Chefe', 'Gerencia pautas e aprova reportagens',
    '{"Planejamento": {"view": true, "create": true, "edit": true, "delete": true}, "Produção": {"view": true, "create": true, "edit": true, "delete": false}, "Aprovação": {"view": true, "create": true, "edit": true, "delete": false}, "Exibição": {"view": true, "create": false, "edit": false, "delete": false}, "Sistema": {"view": true, "create": false, "edit": false, "delete": false}}'::jsonb
  ),
  ('Produtor', 'Produtor', 'Cria e edita reportagens',
    '{"Planejamento": {"view": true, "create": true, "edit": true, "delete": false}, "Produção": {"view": true, "create": true, "edit": true, "delete": false}, "Aprovação": {"view": true, "create": false, "edit": false, "delete": false}, "Exibição": {"view": true, "create": false, "edit": false, "delete": false}, "Sistema": {"view": false, "create": false, "edit": false, "delete": false}}'::jsonb
  ),
  ('Repórter', 'Repórter', 'Visualiza e sugere pautas',
    '{"Planejamento": {"view": true, "create": true, "edit": false, "delete": false}, "Produção": {"view": true, "create": false, "edit": false, "delete": false}, "Aprovação": {"view": false, "create": false, "edit": false, "delete": false}, "Exibição": {"view": true, "create": false, "edit": false, "delete": false}, "Sistema": {"view": false, "create": false, "edit": false, "delete": false}}'::jsonb
  )
ON CONFLICT (role_name) DO NOTHING;

-- =====================================================
-- 8. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================
-- Usuário administrador padrão
INSERT INTO public.users (name, email, role, status, permissions_type, avatar_url) VALUES
  ('Administrador Sistema', 'admin@ecotv.com.br', 'Administrador', 'Ativo', 'Total', 'https://ui-avatars.com/api/?name=Admin&background=7f13ec&color=fff'),
  ('Ricardo Mendes', 'ricardo.mendes@ecotv.com.br', 'Editor Chefe', 'Ativo', 'Limitado', 'https://ui-avatars.com/api/?name=Ricardo+Mendes&background=7f13ec&color=fff'),
  ('Ana Silva', 'ana.silva@ecotv.com.br', 'Produtor', 'Ativo', 'Limitado', 'https://ui-avatars.com/api/?name=Ana+Silva&background=7f13ec&color=fff'),
  ('Carlos Oliveira', 'carlos.oliveira@ecotv.com.br', 'Repórter', 'Ativo', 'Limitado', 'https://ui-avatars.com/api/?name=Carlos+Oliveira&background=7f13ec&color=fff')
ON CONFLICT (email) DO NOTHING;

-- Logs de auditoria de exemplo
INSERT INTO public.audit_logs (user_name, user_avatar, module, action_type, details) VALUES
  ('Ricardo Mendes', 'https://ui-avatars.com/api/?name=Ricardo+Mendes&background=7f13ec&color=fff', 'Pautas', 'Criação', 'Criou nova pauta "Reportagem sobre meio ambiente"'),
  ('Ana Silva', 'https://ui-avatars.com/api/?name=Ana+Silva&background=7f13ec&color=fff', 'Reportagens', 'Edição', 'Editou reportagem "Economia em Alta"'),
  ('Carlos Oliveira', 'https://ui-avatars.com/api/?name=Carlos+Oliveira&background=7f13ec&color=fff', 'Contatos', 'Criação', 'Adicionou novo contato "Dr. João Santos"');

-- =====================================================
-- 9. VIEWS ÚTEIS
-- =====================================================

-- View para usuários com suas permissões completas
CREATE OR REPLACE VIEW public.users_with_permissions AS
SELECT
  u.id,
  u.name,
  u.email,
  u.role,
  u.status,
  u.permissions_type,
  u.avatar_url,
  u.last_access,
  u.created_at,
  u.updated_at,
  CASE
    WHEN u.permissions_type = 'Total' THEN rt.permissions
    WHEN u.permissions_type = 'Limitado' THEN rt.permissions
    WHEN u.permissions_type = 'Customizado' THEN (
      SELECT jsonb_object_agg(
        module,
        jsonb_build_object(
          'view', can_view,
          'create', can_create,
          'edit', can_edit,
          'delete', can_delete
        )
      )
      FROM public.user_permissions
      WHERE user_id = u.id
    )
  END as permissions
FROM public.users u
LEFT JOIN public.role_templates rt ON rt.role_name = u.role;

COMMENT ON VIEW public.users_with_permissions IS 'View que combina usuários com suas permissões completas';

-- View para estatísticas de auditoria
CREATE OR REPLACE VIEW public.audit_stats AS
SELECT
  DATE(created_at) as date,
  module,
  action_type,
  COUNT(*) as total_actions,
  COUNT(DISTINCT user_id) as unique_users
FROM public.audit_logs
GROUP BY DATE(created_at), module, action_type
ORDER BY date DESC;

COMMENT ON VIEW public.audit_stats IS 'Estatísticas de ações de auditoria agrupadas por data, módulo e tipo';

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

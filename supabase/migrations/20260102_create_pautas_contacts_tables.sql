-- ============================================
-- TABELA DE CONTATOS
-- ============================================
-- NOTA: Tabela já existe - use o script 20260102_alter_contacts_table.sql
-- para adicionar colunas faltantes

-- Garantir que RLS está habilitado
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'contacts'
        AND policyname = 'Contatos são visíveis para todos usuários autenticados'
    ) THEN
        CREATE POLICY "Contatos são visíveis para todos usuários autenticados"
          ON contacts FOR SELECT
          TO authenticated
          USING (active = true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'contacts'
        AND policyname = 'Usuários autenticados podem criar contatos'
    ) THEN
        CREATE POLICY "Usuários autenticados podem criar contatos"
          ON contacts FOR INSERT
          TO authenticated
          WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'contacts'
        AND policyname = 'Usuários autenticados podem atualizar contatos'
    ) THEN
        CREATE POLICY "Usuários autenticados podem atualizar contatos"
          ON contacts FOR UPDATE
          TO authenticated
          USING (active = true);
    END IF;
END $$;

-- ============================================
-- TABELA DE PARTICIPAÇÕES DE CONTATOS
-- ============================================
-- NOTA: Tabela pode já existir com estrutura diferente

-- Criar tabela apenas se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_participations') THEN
        CREATE TABLE contact_participations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
          event_type VARCHAR(100),
          event_date DATE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Índices
        CREATE INDEX idx_contact_participations_contact_id ON contact_participations(contact_id);
        CREATE INDEX idx_contact_participations_event_date ON contact_participations(event_date DESC);
    END IF;
END $$;

-- RLS
ALTER TABLE contact_participations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'contact_participations'
        AND policyname = 'Participações são visíveis para todos usuários autenticados'
    ) THEN
        CREATE POLICY "Participações são visíveis para todos usuários autenticados"
          ON contact_participations FOR SELECT
          TO authenticated
          USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'contact_participations'
        AND policyname = 'Usuários autenticados podem criar participações'
    ) THEN
        CREATE POLICY "Usuários autenticados podem criar participações"
          ON contact_participations FOR INSERT
          TO authenticated
          WITH CHECK (true);
    END IF;
END $$;

-- ============================================
-- TABELA DE PAUTAS
-- ============================================
CREATE TABLE IF NOT EXISTS pautas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  editoria VARCHAR(100),
  jornalista VARCHAR(255),
  camera VARCHAR(255),
  editor VARCHAR(255),
  data_veiculacao DATE,
  prioridade VARCHAR(50) DEFAULT 'média', -- 'baixa', 'média', 'alta', 'urgente'
  status VARCHAR(50) DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado', 'em_producao', 'concluido'
  localizacao JSONB, -- coordenadas geográficas se aplicável
  localizacao_texto VARCHAR(500),
  workflow_steps JSONB, -- array de steps do workflow
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pautas_status ON pautas(status);
CREATE INDEX IF NOT EXISTS idx_pautas_editoria ON pautas(editoria);
CREATE INDEX IF NOT EXISTS idx_pautas_data_veiculacao ON pautas(data_veiculacao);
CREATE INDEX IF NOT EXISTS idx_pautas_active ON pautas(active);
CREATE INDEX IF NOT EXISTS idx_pautas_created_at ON pautas(created_at DESC);

-- RLS
ALTER TABLE pautas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pautas são visíveis para todos usuários autenticados" ON pautas;
CREATE POLICY "Pautas são visíveis para todos usuários autenticados"
  ON pautas FOR SELECT
  TO authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar pautas" ON pautas;
CREATE POLICY "Usuários autenticados podem criar pautas"
  ON pautas FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar pautas" ON pautas;
CREATE POLICY "Usuários autenticados podem atualizar pautas"
  ON pautas FOR UPDATE
  TO authenticated
  USING (active = true);

-- Trigger
DROP TRIGGER IF EXISTS update_pautas_updated_at ON pautas;
CREATE TRIGGER update_pautas_updated_at BEFORE UPDATE ON pautas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA DE COMENTÁRIOS DE PAUTAS
-- ============================================
CREATE TABLE IF NOT EXISTS pauta_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pauta_id UUID REFERENCES pautas(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pauta_comments_pauta_id ON pauta_comments(pauta_id);
CREATE INDEX IF NOT EXISTS idx_pauta_comments_created_at ON pauta_comments(created_at DESC);

-- RLS
ALTER TABLE pauta_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comentários de pautas são visíveis para todos usuários autenticados" ON pauta_comments;
CREATE POLICY "Comentários de pautas são visíveis para todos usuários autenticados"
  ON pauta_comments FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar comentários" ON pauta_comments;
CREATE POLICY "Usuários autenticados podem criar comentários"
  ON pauta_comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- TABELA DE RELACIONAMENTO PAUTA-CONTATO
-- ============================================
CREATE TABLE IF NOT EXISTS pauta_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pauta_id UUID REFERENCES pautas(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pauta_id, contact_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pauta_contacts_pauta_id ON pauta_contacts(pauta_id);
CREATE INDEX IF NOT EXISTS idx_pauta_contacts_contact_id ON pauta_contacts(contact_id);

-- RLS
ALTER TABLE pauta_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Relacionamentos pauta-contato são visíveis para todos usuários autenticados" ON pauta_contacts;
CREATE POLICY "Relacionamentos pauta-contato são visíveis para todos usuários autenticados"
  ON pauta_contacts FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar relacionamentos" ON pauta_contacts;
CREATE POLICY "Usuários autenticados podem criar relacionamentos"
  ON pauta_contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem deletar relacionamentos" ON pauta_contacts;
CREATE POLICY "Usuários autenticados podem deletar relacionamentos"
  ON pauta_contacts FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- TABELA DE LOCALIZAÇÕES (MOÇAMBIQUE)
-- ============================================
-- NOTA: Tabela pode já existir com estrutura diferente

-- Criar tabela apenas se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mozambique_locations') THEN
        CREATE TABLE mozambique_locations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50),
          parent_id UUID REFERENCES mozambique_locations(id),
          coordinates JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Índices
        CREATE INDEX idx_mozambique_locations_name ON mozambique_locations(name);
        CREATE INDEX idx_mozambique_locations_type ON mozambique_locations(type);
        CREATE INDEX idx_mozambique_locations_parent_id ON mozambique_locations(parent_id);
    END IF;
END $$;

-- RLS
ALTER TABLE mozambique_locations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (se não existirem)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'mozambique_locations'
        AND policyname = 'Localizações são visíveis para todos usuários autenticados'
    ) THEN
        CREATE POLICY "Localizações são visíveis para todos usuários autenticados"
          ON mozambique_locations FOR SELECT
          TO authenticated
          USING (true);
    END IF;
END $$;

-- ============================================
-- TABELA DE CONFIGURAÇÕES DA APLICAÇÃO
-- ============================================
CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Configurações são visíveis para todos usuários autenticados" ON app_settings;
CREATE POLICY "Configurações são visíveis para todos usuários autenticados"
  ON app_settings FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Apenas administradores podem atualizar configurações" ON app_settings;
CREATE POLICY "Apenas administradores podem atualizar configurações"
  ON app_settings FOR UPDATE
  TO authenticated
  USING (true);

-- Trigger
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Pautas de exemplo
INSERT INTO pautas (titulo, descricao, editoria, jornalista, status, prioridade, data_veiculacao, active, workflow_steps) VALUES
  ('Aumento de casos de dengue na região', 'Reportagem sobre o crescimento de casos de dengue no bairro', 'Saúde', 'Roberto Silva', 'aprovado', 'alta', CURRENT_DATE, true,
    '[{"step": "Criado", "user": "Sistema", "date": "2026-01-02T10:00:00Z", "status": "completed"}, {"step": "Aprovado", "user": "Editor Chefe", "date": "2026-01-02T11:00:00Z", "status": "completed"}]'::jsonb),
  ('Inauguração de nova praça', 'Cobertura da inauguração da praça no centro', 'Cidade', 'Ana Paula', 'em_producao', 'média', CURRENT_DATE, true,
    '[{"step": "Criado", "user": "Sistema", "date": "2026-01-02T09:00:00Z", "status": "completed"}, {"step": "Aprovado", "user": "Editor Chefe", "date": "2026-01-02T09:30:00Z", "status": "completed"}, {"step": "Em Produção", "user": "Produtor", "date": "2026-01-02T10:00:00Z", "status": "in_progress"}]'::jsonb),
  ('Entrevista com prefeito sobre obras', 'Entrevista exclusiva sobre o andamento das obras de infraestrutura', 'Política', 'Mariana Costa', 'pendente', 'alta', CURRENT_DATE + INTERVAL '1 day', true,
    '[{"step": "Criado", "user": "Sistema", "date": "2026-01-02T08:00:00Z", "status": "completed"}]'::jsonb)
ON CONFLICT DO NOTHING;

-- NOTA: A tabela mozambique_locations pode já existir com dados, não inserimos exemplos aqui

-- Configurações padrão (apenas se a estrutura for compatível)
DO $$
BEGIN
    -- Verificar se a coluna 'description' existe
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'app_settings'
        AND column_name = 'description'
    ) THEN
        -- Inserir com description
        INSERT INTO app_settings (key, value, description) VALUES
          ('editorias', '["Política", "Economia", "Saúde", "Educação", "Cultura", "Esporte", "Cidade", "Segurança"]'::jsonb, 'Lista de editorias disponíveis'),
          ('workflow_enabled', 'true'::jsonb, 'Ativar workflow de aprovação de pautas')
        ON CONFLICT (key) DO NOTHING;
    ELSE
        -- Inserir sem description
        INSERT INTO app_settings (key, value) VALUES
          ('editorias', '["Política", "Economia", "Saúde", "Educação", "Cultura", "Esporte", "Cidade", "Segurança"]'::jsonb),
          ('workflow_enabled', 'true'::jsonb)
        ON CONFLICT (key) DO NOTHING;
    END IF;
END $$;

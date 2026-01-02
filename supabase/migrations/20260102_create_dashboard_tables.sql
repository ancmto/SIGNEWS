-- ============================================
-- TABELA DE REPORTAGENS
-- ============================================
-- NOTA: Tabela já existe - use o script 20260102_alter_reportagens_table.sql
-- para adicionar colunas faltantes

-- Garantir que RLS está habilitado
ALTER TABLE reportagens ENABLE ROW LEVEL SECURITY;

-- Garantir que índices existem
CREATE INDEX IF NOT EXISTS idx_reportagens_status ON reportagens(status);
CREATE INDEX IF NOT EXISTS idx_reportagens_created_at ON reportagens(created_at DESC);

-- ============================================
-- TABELA DE ATIVIDADES RECENTES
-- ============================================
CREATE TABLE IF NOT EXISTS recent_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  meta VARCHAR(255), -- informação adicional (ex: "há 5 min", "12:30")
  type VARCHAR(50) DEFAULT 'info', -- 'success', 'info', 'warning'
  user_id UUID REFERENCES auth.users(id),
  entity_type VARCHAR(50), -- 'pauta', 'reportagem', 'espelho', etc
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_recent_activities_created_at ON recent_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recent_activities_type ON recent_activities(type);

-- RLS
ALTER TABLE recent_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Atividades são visíveis para todos usuários autenticados" ON recent_activities;
CREATE POLICY "Atividades são visíveis para todos usuários autenticados"
  ON recent_activities FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar atividades" ON recent_activities;
CREATE POLICY "Usuários autenticados podem criar atividades"
  ON recent_activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- TABELA DE EQUIPES EXTERNAS
-- ============================================
CREATE TABLE IF NOT EXISTS external_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'success', -- 'success', 'warning', 'error'
  status_label VARCHAR(50) DEFAULT 'Disponível', -- 'Disponível', 'Em Pauta', 'Offline'
  image_url TEXT,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  current_assignment TEXT, -- descrição da pauta atual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_external_teams_status ON external_teams(status);
CREATE INDEX IF NOT EXISTS idx_external_teams_name ON external_teams(name);

-- RLS
ALTER TABLE external_teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Equipes são visíveis para todos usuários autenticados" ON external_teams;
CREATE POLICY "Equipes são visíveis para todos usuários autenticados"
  ON external_teams FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar equipes" ON external_teams;
CREATE POLICY "Usuários autenticados podem criar equipes"
  ON external_teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar equipes" ON external_teams;
CREATE POLICY "Usuários autenticados podem atualizar equipes"
  ON external_teams FOR UPDATE
  TO authenticated
  USING (true);

-- Trigger
DROP TRIGGER IF EXISTS update_external_teams_updated_at ON external_teams;
CREATE TRIGGER update_external_teams_updated_at BEFORE UPDATE ON external_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- NOTA: A tabela reportagens já existe com dados
-- NOTA: A tabela recent_activities pode já existir com estrutura diferente

-- Inserir dados apenas se as tabelas estiverem vazias
DO $$
BEGIN
    -- Atividades recentes (apenas se a tabela estiver vazia e tiver as colunas corretas)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'recent_activities'
        AND column_name = 'entity_type'
    ) AND NOT EXISTS (SELECT 1 FROM recent_activities LIMIT 1) THEN
        INSERT INTO recent_activities (title, description, meta, type, entity_type) VALUES
          ('Pauta Aprovada', 'Reportagem "Economia em Alta" foi aprovada', 'há 5 min', 'success', 'pauta'),
          ('Novo Espelho Criado', 'Espelho "Jornal da Noite" foi criado para hoje', 'há 12 min', 'info', 'espelho'),
          ('Reportagem em Edição', 'VT "Chuvas na Zona Leste" está em processo de edição', 'há 18 min', 'warning', 'reportagem'),
          ('Equipe Externa Ativada', 'Equipe de São Bernardo iniciou cobertura', 'há 25 min', 'success', 'equipe'),
          ('Pauta Criada', 'Nova pauta "Trânsito na Marginal" aguarda aprovação', 'há 32 min', 'info', 'pauta');
    END IF;
END $$;

-- Equipes externas (apenas se a tabela estiver vazia e tiver as colunas corretas)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'external_teams'
        AND column_name = 'contact_phone'
    ) AND NOT EXISTS (SELECT 1 FROM external_teams LIMIT 1) THEN
        INSERT INTO external_teams (name, location, status, status_label, image_url, contact_phone, current_assignment) VALUES
          ('Equipe São Bernardo', 'São Bernardo do Campo', 'warning', 'Em Pauta', 'https://ui-avatars.com/api/?name=SB&background=faad14&color=fff', '(11) 98765-4321', 'Cobertura de enchentes na região'),
          ('Equipe Santo André', 'Santo André - Centro', 'success', 'Disponível', 'https://ui-avatars.com/api/?name=SA&background=52c41a&color=fff', '(11) 98765-4322', NULL),
          ('Equipe Mauá', 'Mauá - Zona Industrial', 'success', 'Disponível', 'https://ui-avatars.com/api/?name=MA&background=52c41a&color=fff', '(11) 98765-4323', NULL),
          ('Equipe Diadema', 'Diadema - Vila Paulicéia', 'error', 'Offline', 'https://ui-avatars.com/api/?name=DI&background=ff4d4f&color=fff', '(11) 98765-4324', NULL);
    END IF;
END $$;

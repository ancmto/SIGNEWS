-- ============================================
-- TABELA DE PROGRAMAS
-- ============================================
CREATE TABLE IF NOT EXISTS programas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  duracao_padrao INTEGER, -- Duração padrão em segundos
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABELA DE ESPELHOS
-- ============================================
CREATE TABLE IF NOT EXISTS espelhos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  programa_id UUID REFERENCES programas(id),
  data_exibicao DATE NOT NULL,
  horario_previsto TIME,
  editor_responsavel VARCHAR(255),
  apresentadores TEXT,
  modo VARCHAR(20) DEFAULT 'vivo', -- 'vivo' ou 'gravado'
  status VARCHAR(50) DEFAULT 'rascunho', -- 'rascunho', 'aprovado', 'no_ar', 'encerrado'
  tempo_total_previsto INTEGER, -- em segundos
  tempo_total_real INTEGER,
  observacoes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABELA DE BLOCOS
-- ============================================
CREATE TABLE IF NOT EXISTS blocos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  espelho_id UUID REFERENCES espelhos(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  duracao_prevista INTEGER, -- em segundos
  duracao_real INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABELA DE ITEMS DO RUNDOWN
-- ============================================
CREATE TABLE IF NOT EXISTS rundown_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bloco_id UUID REFERENCES blocos(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'VT', 'REP', 'VIVO', 'NOTA', 'BREAK'
  titulo VARCHAR(255) NOT NULL,
  detalhes TEXT,
  talento VARCHAR(255),
  reporter VARCHAR(255),
  editor_video VARCHAR(255),
  origem VARCHAR(50), -- 'ARQ', 'MAM', 'LINK', 'RED', 'EXT'
  duracao_prevista INTEGER, -- em segundos
  duracao_real INTEGER,
  status VARCHAR(50) DEFAULT 'aguardando', -- 'aprovado', 'produzindo', 'aguardando'
  reportagem_id UUID REFERENCES reportagens(id), -- Link com reportagem se for REP
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABELA DE COMENTÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS espelho_comentarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  espelho_id UUID REFERENCES espelhos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_espelhos_programa ON espelhos(programa_id);
CREATE INDEX IF NOT EXISTS idx_espelhos_data ON espelhos(data_exibicao);
CREATE INDEX IF NOT EXISTS idx_espelhos_status ON espelhos(status);
CREATE INDEX IF NOT EXISTS idx_blocos_espelho ON blocos(espelho_id, ordem);
CREATE INDEX IF NOT EXISTS idx_rundown_bloco ON rundown_items(bloco_id, ordem);
CREATE INDEX IF NOT EXISTS idx_comentarios_espelho ON espelho_comentarios(espelho_id);

-- ============================================
-- RLS (ROW LEVEL SECURITY)
-- ============================================
ALTER TABLE programas ENABLE ROW LEVEL SECURITY;
ALTER TABLE espelhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rundown_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE espelho_comentarios ENABLE ROW LEVEL SECURITY;

-- Policies para Programas (todos podem ler, apenas autenticados podem criar/editar)
DROP POLICY IF EXISTS "Programas são visíveis para todos usuários autenticados" ON programas;
CREATE POLICY "Programas são visíveis para todos usuários autenticados"
  ON programas FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar programas" ON programas;
CREATE POLICY "Usuários autenticados podem criar programas"
  ON programas FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar programas" ON programas;
CREATE POLICY "Usuários autenticados podem atualizar programas"
  ON programas FOR UPDATE
  TO authenticated
  USING (true);

-- Policies para Espelhos
DROP POLICY IF EXISTS "Espelhos são visíveis para todos usuários autenticados" ON espelhos;
CREATE POLICY "Espelhos são visíveis para todos usuários autenticados"
  ON espelhos FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Usuários autenticados podem criar espelhos" ON espelhos;
CREATE POLICY "Usuários autenticados podem criar espelhos"
  ON espelhos FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar espelhos" ON espelhos;
CREATE POLICY "Usuários autenticados podem atualizar espelhos"
  ON espelhos FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Usuários autenticados podem deletar espelhos" ON espelhos;
CREATE POLICY "Usuários autenticados podem deletar espelhos"
  ON espelhos FOR DELETE
  TO authenticated
  USING (true);

-- Policies para Blocos
DROP POLICY IF EXISTS "Blocos são visíveis para todos usuários autenticados" ON blocos;
CREATE POLICY "Blocos são visíveis para todos usuários autenticados"
  ON blocos FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Usuários autenticados podem criar blocos" ON blocos;
CREATE POLICY "Usuários autenticados podem criar blocos"
  ON blocos FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar blocos" ON blocos;
CREATE POLICY "Usuários autenticados podem atualizar blocos"
  ON blocos FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Usuários autenticados podem deletar blocos" ON blocos;
CREATE POLICY "Usuários autenticados podem deletar blocos"
  ON blocos FOR DELETE
  TO authenticated
  USING (true);

-- Policies para Rundown Items
DROP POLICY IF EXISTS "Rundown items são visíveis para todos usuários autenticados" ON rundown_items;
CREATE POLICY "Rundown items são visíveis para todos usuários autenticados"
  ON rundown_items FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Usuários autenticados podem criar rundown items" ON rundown_items;
CREATE POLICY "Usuários autenticados podem criar rundown items"
  ON rundown_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar rundown items" ON rundown_items;
CREATE POLICY "Usuários autenticados podem atualizar rundown items"
  ON rundown_items FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Usuários autenticados podem deletar rundown items" ON rundown_items;
CREATE POLICY "Usuários autenticados podem deletar rundown items"
  ON rundown_items FOR DELETE
  TO authenticated
  USING (true);

-- Policies para Comentários
DROP POLICY IF EXISTS "Comentários são visíveis para todos usuários autenticados" ON espelho_comentarios;
CREATE POLICY "Comentários são visíveis para todos usuários autenticados"
  ON espelho_comentarios FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar comentários" ON espelho_comentarios;
CREATE POLICY "Usuários autenticados podem criar comentários"
  ON espelho_comentarios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_programas_updated_at ON programas;
CREATE TRIGGER update_programas_updated_at BEFORE UPDATE ON programas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_espelhos_updated_at ON espelhos;
CREATE TRIGGER update_espelhos_updated_at BEFORE UPDATE ON espelhos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blocos_updated_at ON blocos;
CREATE TRIGGER update_blocos_updated_at BEFORE UPDATE ON blocos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rundown_items_updated_at ON rundown_items;
CREATE TRIGGER update_rundown_items_updated_at BEFORE UPDATE ON rundown_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================
INSERT INTO programas (nome, descricao, duracao_padrao, ativo) VALUES
  ('Jornal da Noite', 'Telejornal principal da emissora, exibido às 20h', 2700, true),
  ('Jornal do Meio Dia', 'Telejornal de meio-dia com notícias e serviços', 1800, true),
  ('Bom Dia Cidade', 'Programa matinal com notícias locais', 3600, true)
ON CONFLICT DO NOTHING;

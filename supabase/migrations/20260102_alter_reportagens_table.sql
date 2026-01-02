-- ============================================
-- ATUALIZAÇÃO DA TABELA DE REPORTAGENS
-- Adiciona colunas faltantes na tabela existente
-- ============================================

-- Adicionar colunas faltantes se não existirem
DO $$
BEGIN
    -- Adicionar coluna deleted_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reportagens' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE reportagens ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Adicionar coluna created_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reportagens' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE reportagens ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;

    -- Adicionar coluna pauta_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reportagens' AND column_name = 'pauta_id'
    ) THEN
        ALTER TABLE reportagens ADD COLUMN pauta_id UUID;
    END IF;

    -- Adicionar coluna local se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reportagens' AND column_name = 'local'
    ) THEN
        ALTER TABLE reportagens ADD COLUMN local VARCHAR(255);
    END IF;

    -- Adicionar coluna data_gravacao se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reportagens' AND column_name = 'data_gravacao'
    ) THEN
        ALTER TABLE reportagens ADD COLUMN data_gravacao DATE;
    END IF;

    -- Adicionar coluna observacoes se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reportagens' AND column_name = 'observacoes'
    ) THEN
        ALTER TABLE reportagens ADD COLUMN observacoes TEXT;
    END IF;
END $$;

-- Garantir que RLS está habilitado
ALTER TABLE reportagens ENABLE ROW LEVEL SECURITY;

-- Atualizar políticas RLS para considerar deleted_at
DROP POLICY IF EXISTS "Reportagens são visíveis para todos usuários autenticados" ON reportagens;
CREATE POLICY "Reportagens são visíveis para todos usuários autenticados"
  ON reportagens FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "Usuários autenticados podem criar reportagens" ON reportagens;
CREATE POLICY "Usuários autenticados podem criar reportagens"
  ON reportagens FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem atualizar reportagens" ON reportagens;
CREATE POLICY "Usuários autenticados podem atualizar reportagens"
  ON reportagens FOR UPDATE
  TO authenticated
  USING (deleted_at IS NULL);

-- Criar índice se não existir
CREATE INDEX IF NOT EXISTS idx_reportagens_deleted_at ON reportagens(deleted_at);

-- Adicionar trigger de updated_at se não existir
DROP TRIGGER IF EXISTS update_reportagens_updated_at ON reportagens;
CREATE TRIGGER update_reportagens_updated_at BEFORE UPDATE ON reportagens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

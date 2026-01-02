-- ============================================
-- ATUALIZAÇÃO DA TABELA DE CONTATOS
-- Adiciona colunas faltantes na tabela existente
-- ============================================

-- Adicionar colunas faltantes se não existirem
DO $$
BEGIN
    -- Adicionar coluna organization
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contacts' AND column_name = 'organization'
    ) THEN
        ALTER TABLE contacts ADD COLUMN organization VARCHAR(255);
    END IF;

    -- Adicionar coluna notes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contacts' AND column_name = 'notes'
    ) THEN
        ALTER TABLE contacts ADD COLUMN notes TEXT;
    END IF;

    -- Adicionar coluna tags
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contacts' AND column_name = 'tags'
    ) THEN
        ALTER TABLE contacts ADD COLUMN tags TEXT[];
    END IF;

    -- Adicionar coluna created_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contacts' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE contacts ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Criar índice para organization se não existir
CREATE INDEX IF NOT EXISTS idx_contacts_organization ON contacts(organization);

-- Adicionar dados de exemplo apenas se a tabela estiver vazia de organizações
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM contacts WHERE organization IS NOT NULL LIMIT 1) THEN
        -- Atualizar registros existentes com organizações de exemplo
        UPDATE contacts
        SET organization = CASE
            WHEN name LIKE '%Dr.%' OR name LIKE '%Dra.%' THEN 'Hospital Municipal'
            WHEN role LIKE '%Professor%' OR role LIKE '%Professora%' THEN 'Instituição de Ensino'
            ELSE 'Organização Pública'
        END
        WHERE organization IS NULL;
    END IF;
END $$;

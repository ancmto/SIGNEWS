# Guia de Migração do Banco de Dados

Este guia explica como aplicar as migrações do banco de dados no Supabase para integrar o dashboard com os dados reais.

## Arquivos de Migração Criados

1. **20250102_create_users_and_audit.sql** - Tabelas de usuários, permissões e auditoria
2. **20260102_create_espelhos_tables.sql** - Tabelas de espelhos, programas, blocos e rundown
3. **20260102_alter_contacts_table.sql** - ⚠️ **Atualiza tabela contacts existente** (adiciona colunas)
4. **20260102_alter_reportagens_table.sql** - ⚠️ **Atualiza tabela reportagens existente** (adiciona colunas)
5. **20260102_create_pautas_contacts_tables.sql** - Tabelas de pautas, comentários e outras relacionadas
6. **20260102_create_dashboard_tables.sql** - Tabelas de atividades recentes e equipes externas

## Como Aplicar as Migrações

### ⚠️ ATENÇÃO: Ordem de Execução Importante

A tabela `contacts` já existe no seu banco de dados. Por isso, você deve executar o script de **ALTER TABLE** antes do script principal de pautas.

### Opção 1: Através do Dashboard do Supabase (Recomendado)

1. Acesse o dashboard do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Aplique cada migração na seguinte ordem:

#### Passo 1: Usuários e Auditoria
```sql
-- Cole o conteúdo de: supabase/migrations/20250102_create_users_and_audit.sql
-- Execute o script
```

#### Passo 2: ⚠️ Atualizar Tabela Contacts (IMPORTANTE)
```sql
-- Cole o conteúdo de: supabase/migrations/20260102_alter_contacts_table.sql
-- Execute o script
-- Este script adiciona as colunas 'organization', 'notes', 'tags' e 'created_by'
```

#### Passo 3: Pautas e Tabelas Relacionadas
```sql
-- Cole o conteúdo de: supabase/migrations/20260102_create_pautas_contacts_tables.sql
-- Execute o script
```

#### Passo 4: Espelhos
```sql
-- Cole o conteúdo de: supabase/migrations/20260102_create_espelhos_tables.sql
-- Execute o script
```

#### Passo 5: ⚠️ Atualizar Tabela Reportagens
```sql
-- Cole o conteúdo de: supabase/migrations/20260102_alter_reportagens_table.sql
-- Execute o script
-- Este script adiciona as colunas 'deleted_at', 'created_by', 'pauta_id', 'local', 'data_gravacao' e 'observacoes'
```

#### Passo 6: Dashboard (Atividades e Equipes)
```sql
-- Cole o conteúdo de: supabase/migrations/20260102_create_dashboard_tables.sql
-- Execute o script
```

### Opção 2: Usando Supabase CLI (Se instalado)

Se você tem o Supabase CLI instalado, pode aplicar todas as migrações de uma vez:

```bash
# Certifique-se de estar no diretório do projeto
cd /Users/alex.nascimento/Documents/ProjetosDev/SIGNEWS

# Link seu projeto (se ainda não fez)
supabase link --project-ref joqtrwieeuytpnivqomd

# Aplique as migrações
supabase db push
```

## Verificação Pós-Migração

Após aplicar as migrações, verifique se as tabelas foram criadas corretamente:

### No Dashboard do Supabase

1. Vá para **Table Editor**
2. Verifique se as seguintes tabelas existem:
   - ✅ `users`
   - ✅ `audit_logs`
   - ✅ `pautas`
   - ✅ `pauta_comments`
   - ✅ `pauta_contacts`
   - ✅ `contacts`
   - ✅ `contact_participations`
   - ✅ `programas`
   - ✅ `espelhos`
   - ✅ `blocos`
   - ✅ `rundown_items`
   - ✅ `reportagens`
   - ✅ `recent_activities`
   - ✅ `external_teams`
   - ✅ `mozambique_locations`
   - ✅ `app_settings`

### Teste de Dados

As migrações incluem dados de exemplo (seed data). Verifique se eles foram inseridos:

```sql
-- Verificar pautas
SELECT COUNT(*) FROM pautas;

-- Verificar contatos
SELECT COUNT(*) FROM contacts;

-- Verificar espelhos (deve ser 0 inicialmente, pois é do dia)
SELECT COUNT(*) FROM espelhos WHERE data_exibicao = CURRENT_DATE;

-- Verificar programas
SELECT * FROM programas;

-- Verificar reportagens
SELECT * FROM reportagens;

-- Verificar atividades recentes
SELECT * FROM recent_activities;

-- Verificar equipes externas
SELECT * FROM external_teams;
```

## Estrutura de Dados do Dashboard

O dashboard agora busca dados reais das seguintes tabelas:

### Estatísticas (Cards do topo)
- **Pautas**: tabela `pautas` (total, pendentes, aprovadas)
- **Reportagens**: tabela `reportagens` (total de reportagens ativas)
- **Espelhos**: tabela `espelhos` (espelhos do dia atual)
- **Contatos**: tabela `contacts` (total de contatos ativos)

### Status dos Espelhos
- Tabela `espelhos` com join em `programas`
- Filtra por `data_exibicao = hoje`
- Mostra status, horário, editor e progresso

### Atividades Recentes
- Tabela `recent_activities`
- Últimas 5 atividades ordenadas por data

### Equipes Externas
- Tabela `external_teams`
- Mostra localização e status das equipes

## Problemas Comuns

### Erro: "relation already exists"
Se alguma tabela já existe, a migração vai ignorar (usando `IF NOT EXISTS`)

### Erro: "function does not exist"
Certifique-se de aplicar as migrações na ordem correta. A função `update_updated_at_column()` é criada na primeira migração.

### Erro de permissão RLS
As políticas RLS foram configuradas para usuários autenticados. Certifique-se de estar logado na aplicação.

## Próximos Passos

Após aplicar as migrações:

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Faça login na aplicação

3. Acesse o dashboard e verifique se os dados estão sendo exibidos

4. Se não houver espelhos para hoje, você pode criar um novo espelho através da interface ou inserindo manualmente:
   ```sql
   INSERT INTO espelhos (programa_id, data_exibicao, horario_previsto, editor_responsavel, status)
   SELECT id, CURRENT_DATE, '12:00:00', 'Editor Teste', 'aprovado'
   FROM programas
   LIMIT 1;
   ```

## Suporte

Se encontrar problemas, verifique:
1. Os logs do navegador (Console)
2. Os logs da API do Supabase
3. As políticas RLS nas tabelas

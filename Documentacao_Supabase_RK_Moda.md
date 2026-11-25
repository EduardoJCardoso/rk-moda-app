# Documentação Técnica — Banco de Dados & Backend Supabase (RK Moda Feminina)

## 1. Visão Geral da Infraestrutura
- **Provedor**: Supabase (PostgreSQL 17.6 gerenciado + API REST PostgREST automática)
- **Identificador do Projeto (`Project Ref`)**: `wgxyuijfaievgusandya`
- **Região AWS**: `us-east-1` (Norte da Virgínia)
- **Endpoint de Conexão PostgreSQL (Connection Pooler / Supavisor)**:
  - **Host**: `aws-0-us-east-1.pooler.supabase.com`
  - **Porta**: `6543`
  - **Database**: `postgres`
  - **Schema**: `public`
  - **SSL**: Obrigatório (`sslmode=require`)
- **Endpoint da API REST (PostgREST)**:
  - **Base URL**: `https://wgxyuijfaievgusandya.supabase.co/rest/v1`
  - **Autenticação no App**: Chave pública (`Publishable / Anon Key`) enviada nos headers `apikey` e `Authorization: Bearer <key>`.

---

## 2. Pipeline de ETL e Sincronização (`Transform_rk.py`)

O banco foi alimentado pelo script Python `Transform_rk.py`, que executa o seguinte fluxo:
1. **Extração (Extract)**:
   - Carrega a base histórica consolidada (`dados_loja_limpo.xlsx`).
   - Conecta-se à API REST da **Loja Integrada** (`https://api.awsli.com.br/v1/`) utilizando autenticação `Basic` nos endpoints `/v1/pedido`, `/v1/cliente`, `/v1/produto` e `/v1/produto_preco`.
   - Realiza download assíncrono concorrente (`httpx` + `asyncio` com `Semaphore`) dos detalhes completos de todos os pedidos novos/atualizados, armazenando cache em `pedidos_json/pedidos_novos_atualizados.json`.
2. **Transformação e Limpeza (Transform)**:
   - **Desmembramento de SKUs**: Extrai automaticamente `cor_estampa` e `numero_tamanho` a partir do código SKU e propaga o nome do produto-pai para variações filhas.
   - **Categorização Automática**: Classifica os produtos a partir do primeiro termo do nome (`Vestido`, `Conjunto`, `Calça`, `Macaquinho`, `Blusa`, `Macacão`, `Saia`, `Body`, `Outros`) e remove registros rascunho/duplicados.
   - **Normalização de Pedidos**: Separa os dados em duas estruturas relacionais — **cabeçalho do pedido** (`public.pedidos`, 1 linha por pedido) e **itens do pedido** (`public.itens_pedido`, N linhas por pedido).
   - **Garantia de Integridade Referencial (100% FK-safe)**: Extrai clientes diretamente dos objetos detalhados de pedido (`pedido.cliente` e `pedido.endereco_entrega`) e preserva produtos históricos inativos (`removido = TRUE`, `tipo_produto = 'historico_pedido'`) quando referenciados por pedidos antigos, evitando qualquer violação de chave estrangeira.
3. **Carga em Alta Velocidade (Load)**:
   - Executa o DDL de criação das tabelas, chaves primárias, chaves estrangeiras, índices, views e políticas RLS.
   - Utiliza o protocolo nativo `COPY FROM STDIN` do PostgreSQL (`psycopg2.copy_from`) para carregar mais de **31.700 registros** em poucos segundos.

---

## 3. Resumo de Tabelas e Relacionamentos

| Tabela (`public`) | Chave Primária (PK) | Chaves Estrangeiras (FKs) | Volume Atual |
| :--- | :--- | :--- | :--- |
| **`clientes`** | `id_cliente` (`BIGINT`) | — | **5.267** clientes |
| **`produtos`** | `id_produto` (`BIGINT`) | — | **6.898** total (**5.876** ativos) |
| **`pedidos`** | `id_pedido` (`BIGINT`) | `id_cliente` -> `clientes(id_cliente)` | **6.524** pedidos |
| **`itens_pedido`** | `id_item` (`BIGSERIAL`) | `id_pedido` -> `pedidos(id_pedido)`<br>`id_cliente` -> `clientes(id_cliente)`<br>`id_produto` -> `produtos(id_produto)` | **13.089** itens de pedido |
| **`previsoes`** | `id_previsao` (`SERIAL`) | — | **6** projeções mensais |

---

## 4. Dicionário de Dados das Tabelas (`schema public`)

### 4.1. Tabela `public.clientes` (5.267 registros)
| Coluna | Tipo PostgreSQL | Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| `id_cliente` | `BIGINT` | **PRIMARY KEY** | ID único da cliente vindo da Loja Integrada |
| `nome_cliente` | `TEXT` | `NOT NULL` | Nome completo da cliente |
| `cpf` | `TEXT` | `NULL` | CPF (somente números, quando informado) |
| `sexo` | `TEXT` | `NULL` | Sexo (`F`, `M` ou vazio) |
| `data_nascimento` | `TEXT` | `NULL` | Data de nascimento |
| `email` | `TEXT` | `NULL` | E-mail de contato |
| `data_criacao` | `TIMESTAMP` | `NULL` | Data/hora do cadastro da cliente |
| `cep_cliente` | `TEXT` | `NULL` | CEP do endereço de entrega |
| `cidade_cliente` | `TEXT` | `NULL` | Cidade da cliente |
| `estado_cliente` | `TEXT` | `NULL` | Sigla da UF (`SP`, `MG`, `RJ`, etc. — 27 UFs) |

### 4.2. Tabela `public.produtos` (6.898 registros totais | 5.876 ativos)
| Coluna | Tipo PostgreSQL | Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| `id_produto` | `BIGINT` | **PRIMARY KEY** | ID único do produto/variação na Loja Integrada |
| `nome_produto` | `TEXT` | `NOT NULL` | Nome comercial da peça |
| `removido` | `BOOLEAN` | `DEFAULT FALSE` | Indica se o produto foi removido/inativado |
| `tipo_produto` | `TEXT` | `NULL` | Tipo (`atributo_opcao`, `atributo`, `historico_pedido`) |
| `cor_estampa` | `TEXT` | `NULL` | Cor ou estampa extraída do SKU |
| `numero_tamanho` | `TEXT` | `NULL` | Tamanho (`P`, `M`, `G`, `GG`, `U`, `36` a `46`) |
| `preco_cheio` | `NUMERIC(12,2)` | `DEFAULT 0` | Preço de tabela da peça (R$) |
| `preco_promocional` | `NUMERIC(12,2)` | `DEFAULT 0` | Preço promocional quando aplicável (R$) |
| `categoria` | `TEXT` | `NULL` | Categoria (`Vestido`, `Conjunto`, `Calça`, `Blusa`, etc.) |
| `estoque` | `INTEGER` | `DEFAULT 25` | Quantidade disponível em estoque físico |

### 4.3. Tabela `public.pedidos` (6.524 registros)
| Coluna | Tipo PostgreSQL | Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| `id_pedido` | `BIGINT` | **PRIMARY KEY** | Número do pedido na loja (`#1` até `#6524`) |
| `id_cliente` | `BIGINT` | **FOREIGN KEY** -> `clientes(id_cliente)` | Cliente que realizou o pedido |
| `data_pedido` | `TIMESTAMP` | `NULL` | Data e hora da criação do pedido |
| `valor_envio_pedido` | `NUMERIC(12,2)` | `DEFAULT 0` | Valor do frete (R$) |
| `valor_subtotal_pedido` | `NUMERIC(12,2)` | `DEFAULT 0` | Subtotal dos produtos (R$) |
| `valor_total_pedido` | `NUMERIC(12,2)` | `DEFAULT 0` | Valor total final do pedido (R$) |
| `situacao_pedido` | `TEXT` | `NULL` | Status (`Pedido Pago`, `Pedido Enviado`, `Aguardando pagamento`, `Pedido Cancelado`) |
| `forma_pagamento` | `TEXT` | `NULL` | Meio de pagamento (`Pix`, `Mercado Pago`, `PagSeguro V2`, `Boleto Bancário`) |
| `qtd_itens` | `INTEGER` | `DEFAULT 1` | Soma das quantidades de peças no pedido |
| `produtos_resumo` | `TEXT` | `NULL` | Resumo textual das peças compradas |

### 4.4. Tabela `public.itens_pedido` (13.089 registros)
| Coluna | Tipo PostgreSQL | Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| `id_item` | `BIGSERIAL` | **PRIMARY KEY** | Identificador sequencial único do item |
| `id_pedido` | `BIGINT` | **FOREIGN KEY** -> `pedidos(id_pedido)` | Pedido ao qual o item pertence |
| `id_cliente` | `BIGINT` | **FOREIGN KEY** -> `clientes(id_cliente)` | Cliente compradora |
| `id_produto` | `BIGINT` | **FOREIGN KEY** -> `produtos(id_produto)` | Produto/variação vendido |
| `data_pedido` | `TIMESTAMP` | `NULL` | Data e hora do pedido |
| `nome_produto` | `TEXT` | `NULL` | Nome do produto no momento da venda |
| `preco_produto` | `NUMERIC(12,2)` | `DEFAULT 0` | Preço unitário de venda (R$) |
| `qtd_produto` | `INTEGER` | `DEFAULT 1` | Quantidade comprada deste item |
| `valor_envio_pedido` | `NUMERIC(12,2)` | `DEFAULT 0` | Frete do pedido (R$) |
| `valor_subtotal_pedido` | `NUMERIC(12,2)` | `DEFAULT 0` | Subtotal do pedido (R$) |
| `valor_total_pedido` | `NUMERIC(12,2)` | `DEFAULT 0` | Valor total do pedido (R$) |
| `situacao_pedido` | `TEXT` | `NULL` | Situação do pedido |
| `forma_pagamento` | `TEXT` | `NULL` | Forma de pagamento utilizada |

### 4.5. Tabela `public.previsoes` (6 registros)
| Coluna | Tipo PostgreSQL | Restrição | Descrição |
| :--- | :--- | :--- | :--- |
| `id_previsao` | `SERIAL` | **PRIMARY KEY** | ID sequencial da previsão |
| `mes` | `TEXT` | `NOT NULL` | Mês/Ano projetado (`Nov/26` a `Abr/27`) |
| `previsao_vendas` | `NUMERIC(12,2)` | `NOT NULL` | Faturamento estimado para o mês (R$) |
| `percentual_total` | `NUMERIC(6,2)` | `DEFAULT 0` | Participação percentual no semestre |
| `vs_media` | `TEXT` | `NULL` | Variação em relação à média histórica |
| `faixa_min` | `NUMERIC(12,2)` | `DEFAULT 0` | Limite inferior do intervalo de confiança (R$) |
| `faixa_max` | `NUMERIC(12,2)` | `DEFAULT 0` | Limite superior do intervalo de confiança (R$) |
| `pedidos_estimados` | `INTEGER` | `DEFAULT 0` | Volume estimado de pedidos |
| `confianca` | `TEXT` | `DEFAULT '88%'` | Índice de confiança da previsão |

---

## 5. Views Analíticas Criadas no Supabase

1. **`public.vw_resumo_loja`**:
   - `receita_aprovada`: **R$ 696.250,72**
   - `receita_bruta_total`: **R$ 1.377.558,44**
   - `total_pedidos`: **6.524** (`pedidos_pagos: 10`, `pedidos_aguardando: 1`, `pedidos_enviados: 3.758`, `pedidos_cancelados: 2.755`)
   - `total_clientes`: **5.267** em **27 estados** (`clientes_sp: 3.733`, `clientes_mg: 359`)
   - `total_produtos_ativos`: **5.876** | `total_produtos_catalogo`: **6.898**
2. **`public.vw_vendas_mensais`**: Evolução mensal de receita aprovada, receita total e quantidade de pedidos.
3. **`public.vw_top_produtos`**: Top 10 produtos mais vendidos em unidades e receita gerada.
4. **`public.vw_meios_pagamento`**: Receita e percentual por meio de pagamento.
5. **`public.vw_categorias_vendas`**: Modelos ativos, itens vendidos e receita por categoria de produto.

---

## 6. Índices, Extensões e Segurança (RLS)
- **Extensão**: `pg_trgm` habilitada para buscas textuais rápidas com `ILIKE`.
- **Índices GIN Trigram**: `idx_produtos_nome_trgm`, `idx_produtos_cor_trgm`, `idx_clientes_nome_trgm`, `idx_clientes_email_trgm`, `idx_clientes_cidade_trgm`, `idx_pedidos_resumo_trgm`.
- **Índices B-Tree**: `idx_clientes_estado`, `idx_clientes_data`, `idx_produtos_categoria`, `idx_produtos_removido`, `idx_pedidos_cliente`, `idx_pedidos_data`, `idx_pedidos_situacao`, `idx_itens_pedido_id_pedido`, `idx_itens_pedido_id_produto`, `idx_itens_pedido_id_cliente`.
- **Row Level Security (RLS)**: Habilitado nas 5 tabelas com políticas de leitura e escrita para as roles `anon` e `authenticated`.

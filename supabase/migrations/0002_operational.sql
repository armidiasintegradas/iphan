-- IPHAN OS — Beta 01
-- Estrutura operacional complementar.

create table public.contratos (
  id uuid primary key default gen_random_uuid(),
  intervencao_id uuid not null references public.intervencoes(id) on delete cascade,
  numero text,
  objeto text not null,
  contratado text,
  valor numeric(14,2),
  inicio date,
  fim date,
  status public.record_status not null default 'aberto',
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cronograma_itens (
  id uuid primary key default gen_random_uuid(),
  intervencao_id uuid not null references public.intervencoes(id) on delete cascade,
  parent_id uuid references public.cronograma_itens(id) on delete cascade,
  titulo text not null,
  inicio_previsto date,
  fim_previsto date,
  inicio_real date,
  fim_real date,
  percentual_planejado numeric(5,2) not null default 0 check (percentual_planejado between 0 and 100),
  percentual_executado numeric(5,2) not null default 0 check (percentual_executado between 0 and 100),
  peso numeric(8,4) default 1,
  ordem integer default 0,
  created_at timestamptz not null default now()
);

create table public.fiscalizacoes (
  id uuid primary key default gen_random_uuid(),
  intervencao_id uuid references public.intervencoes(id) on delete cascade,
  bem_id uuid references public.bens_culturais(id) on delete cascade,
  titulo text not null,
  tipo text,
  status public.record_status not null default 'aberto',
  responsavel_id uuid references public.perfis(id),
  agendada_para timestamptz,
  realizada_em timestamptz,
  checklist jsonb not null default '{}'::jsonb,
  observacoes text,
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restricoes (
  id uuid primary key default gen_random_uuid(),
  intervencao_id uuid not null references public.intervencoes(id) on delete cascade,
  titulo text not null,
  descricao text,
  impacto text,
  status public.record_status not null default 'aberto',
  risco public.risk_level not null default 'atencao',
  responsavel_id uuid references public.perfis(id),
  prazo timestamptz,
  encerrada_em timestamptz,
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.medicoes (
  id uuid primary key default gen_random_uuid(),
  intervencao_id uuid not null references public.intervencoes(id) on delete cascade,
  numero integer not null,
  referencia text,
  valor numeric(14,2),
  percentual numeric(5,2) check (percentual between 0 and 100),
  status public.record_status not null default 'rascunho',
  conferida_por uuid references public.perfis(id),
  conferida_em timestamptz,
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(intervencao_id, numero)
);

create table public.medicao_itens (
  id uuid primary key default gen_random_uuid(),
  medicao_id uuid not null references public.medicoes(id) on delete cascade,
  codigo text,
  descricao text not null,
  unidade text,
  quantidade_contratada numeric(14,4),
  quantidade_anterior numeric(14,4) default 0,
  quantidade_atual numeric(14,4) default 0,
  valor_unitario numeric(14,2)
);

create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  bem_id uuid references public.bens_culturais(id) on delete cascade,
  intervencao_id uuid references public.intervencoes(id) on delete cascade,
  contexto text not null,
  titulo text not null,
  sistema_origem text,
  referencia_externa text,
  storage_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now()
);

create table public.inspecoes_conservacao (
  id uuid primary key default gen_random_uuid(),
  bem_id uuid not null references public.bens_culturais(id) on delete cascade,
  categoria text not null,
  estado public.risk_level not null default 'regular',
  observacoes text,
  inspecionada_em timestamptz,
  proxima_inspecao date,
  responsavel_id uuid references public.perfis(id),
  created_at timestamptz not null default now()
);

create index idx_contratos_intervencao on public.contratos(intervencao_id);
create index idx_cronograma_intervencao on public.cronograma_itens(intervencao_id);
create index idx_fiscalizacoes_intervencao on public.fiscalizacoes(intervencao_id);
create index idx_restricoes_intervencao on public.restricoes(intervencao_id);
create index idx_medicoes_intervencao on public.medicoes(intervencao_id);
create index idx_documentos_bem on public.documentos(bem_id);
create index idx_documentos_intervencao on public.documentos(intervencao_id);
create index idx_inspecoes_bem on public.inspecoes_conservacao(bem_id);

alter table public.contratos enable row level security;
alter table public.cronograma_itens enable row level security;
alter table public.fiscalizacoes enable row level security;
alter table public.restricoes enable row level security;
alter table public.medicoes enable row level security;
alter table public.medicao_itens enable row level security;
alter table public.documentos enable row level security;
alter table public.inspecoes_conservacao enable row level security;

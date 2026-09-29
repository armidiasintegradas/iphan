-- IPHAN OS — Beta 01
-- Núcleo inicial. IDs UUID, timestamps UTC e trilha de auditoria.

create extension if not exists pgcrypto;

create type public.user_role as enum (
  'admin',
  'gestor',
  'coordenador',
  'fiscal',
  'tecnico',
  'executor',
  'consulta'
);

create type public.risk_level as enum (
  'regular',
  'atencao',
  'risco',
  'critico'
);

create type public.record_status as enum (
  'rascunho',
  'aberto',
  'em_andamento',
  'aguardando',
  'concluido',
  'cancelado'
);

create table public.organizacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamptz not null default now()
);

create table public.unidades (
  id uuid primary key default gen_random_uuid(),
  organizacao_id uuid not null references public.organizacoes(id) on delete cascade,
  nome text not null,
  uf char(2),
  created_at timestamptz not null default now()
);

create table public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  unidade_id uuid references public.unidades(id),
  nome text not null,
  role public.user_role not null default 'consulta',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bens_culturais (
  id uuid primary key default gen_random_uuid(),
  unidade_id uuid not null references public.unidades(id),
  nome text not null,
  municipio text,
  uf char(2),
  tipologia text,
  nivel_protecao text,
  descricao text,
  risco public.risk_level not null default 'regular',
  latitude numeric(9,6),
  longitude numeric(9,6),
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.intervencoes (
  id uuid primary key default gen_random_uuid(),
  bem_id uuid not null references public.bens_culturais(id) on delete cascade,
  titulo text not null,
  descricao text,
  status public.record_status not null default 'rascunho',
  risco public.risk_level not null default 'regular',
  inicio_previsto date,
  fim_previsto date,
  inicio_real date,
  fim_real date,
  avanco_planejado numeric(5,2) not null default 0 check (avanco_planejado between 0 and 100),
  avanco_real numeric(5,2) not null default 0 check (avanco_real between 0 and 100),
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ocorrencias (
  id uuid primary key default gen_random_uuid(),
  intervencao_id uuid not null references public.intervencoes(id) on delete cascade,
  titulo text not null,
  descricao text,
  categoria text,
  status public.record_status not null default 'aberto',
  risco public.risk_level not null default 'atencao',
  responsavel_id uuid references public.perfis(id),
  prazo timestamptz,
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.decisoes (
  id uuid primary key default gen_random_uuid(),
  intervencao_id uuid not null references public.intervencoes(id) on delete cascade,
  ocorrencia_id uuid references public.ocorrencias(id) on delete set null,
  titulo text not null,
  contexto text,
  decisao text,
  status public.record_status not null default 'aberto',
  responsavel_id uuid references public.perfis(id),
  prazo timestamptz,
  decidido_em timestamptz,
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.evidencias (
  id uuid primary key default gen_random_uuid(),
  bem_id uuid references public.bens_culturais(id) on delete cascade,
  intervencao_id uuid references public.intervencoes(id) on delete cascade,
  ocorrencia_id uuid references public.ocorrencias(id) on delete set null,
  tipo text not null,
  etapa text,
  storage_path text not null,
  legenda text,
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz,
  created_by uuid references public.perfis(id),
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigserial primary key,
  actor_id uuid references public.perfis(id),
  entidade text not null,
  entidade_id uuid,
  acao text not null,
  antes jsonb,
  depois jsonb,
  created_at timestamptz not null default now()
);

create index idx_bens_unidade on public.bens_culturais(unidade_id);
create index idx_intervencoes_bem on public.intervencoes(bem_id);
create index idx_ocorrencias_intervencao on public.ocorrencias(intervencao_id);
create index idx_ocorrencias_responsavel on public.ocorrencias(responsavel_id);
create index idx_decisoes_intervencao on public.decisoes(intervencao_id);
create index idx_evidencias_intervencao on public.evidencias(intervencao_id);

alter table public.organizacoes enable row level security;
alter table public.unidades enable row level security;
alter table public.perfis enable row level security;
alter table public.bens_culturais enable row level security;
alter table public.intervencoes enable row level security;
alter table public.ocorrencias enable row level security;
alter table public.decisoes enable row level security;
alter table public.evidencias enable row level security;
alter table public.audit_log enable row level security;

-- As políticas RLS serão adicionadas quando o projeto Supabase e as regras
-- institucionais de acesso forem definidos. Não liberar acesso público por padrão.

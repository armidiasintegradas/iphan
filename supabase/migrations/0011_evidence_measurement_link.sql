-- IPHAN OS — Beta 01
-- Vincula evidências de campo a medições para rastreabilidade física/documental.

alter table public.evidencias
  add column if not exists medicao_id uuid references public.medicoes(id) on delete set null;

create index if not exists idx_evidencias_medicao
  on public.evidencias(medicao_id);

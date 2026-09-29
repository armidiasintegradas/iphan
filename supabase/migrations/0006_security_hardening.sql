-- IPHAN OS — hardening de segurança, RLS complementar e bootstrap de usuários.

create schema if not exists app_private;
revoke all on schema app_private from public, anon;
grant usage on schema app_private to authenticated;

alter function public.current_unit_id() set schema app_private;
alter function public.current_user_role() set schema app_private;
alter function public.capture_audit() set schema app_private;

revoke all on function app_private.current_unit_id() from public, anon;
revoke all on function app_private.current_user_role() from public, anon;
revoke all on function app_private.capture_audit() from public, anon, authenticated;

grant execute on function app_private.current_unit_id() to authenticated;
grant execute on function app_private.current_user_role() to authenticated;

create policy "organizations_read_authenticated"
on public.organizacoes for select to authenticated using (true);

create policy "units_read_authenticated"
on public.unidades for select to authenticated using (true);

create policy "contracts_read_same_unit"
on public.contratos for select to authenticated
using (
  exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id = i.bem_id
    where i.id = intervencao_id
      and b.unidade_id = app_private.current_unit_id()
  )
);

create policy "contracts_write_management"
on public.contratos for insert to authenticated
with check (app_private.current_user_role() in ('admin','gestor','coordenador'));

create policy "measurement_items_read_same_unit"
on public.medicao_itens for select to authenticated
using (
  exists (
    select 1
    from public.medicoes m
    join public.intervencoes i on i.id = m.intervencao_id
    join public.bens_culturais b on b.id = i.bem_id
    where m.id = medicao_id
      and b.unidade_id = app_private.current_unit_id()
  )
);

create policy "measurement_items_write_authorized"
on public.medicao_itens for insert to authenticated
with check (app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','executor'));

create policy "conservation_inspections_read_same_unit"
on public.inspecoes_conservacao for select to authenticated
using (
  exists (
    select 1 from public.bens_culturais b
    where b.id = bem_id
      and b.unidade_id = app_private.current_unit_id()
  )
);

create policy "conservation_inspections_write_authorized"
on public.inspecoes_conservacao for insert to authenticated
with check (app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico'));

create index if not exists idx_unidades_organizacao on public.unidades(organizacao_id);
create index if not exists idx_perfis_unidade on public.perfis(unidade_id);
create index if not exists idx_bens_created_by on public.bens_culturais(created_by);
create index if not exists idx_intervencoes_created_by on public.intervencoes(created_by);
create index if not exists idx_ocorrencias_created_by on public.ocorrencias(created_by);
create index if not exists idx_decisoes_ocorrencia on public.decisoes(ocorrencia_id);
create index if not exists idx_decisoes_responsavel on public.decisoes(responsavel_id);
create index if not exists idx_decisoes_created_by on public.decisoes(created_by);
create index if not exists idx_evidencias_bem on public.evidencias(bem_id);
create index if not exists idx_evidencias_ocorrencia on public.evidencias(ocorrencia_id);
create index if not exists idx_evidencias_created_by on public.evidencias(created_by);
create index if not exists idx_cronograma_parent on public.cronograma_itens(parent_id);
create index if not exists idx_fiscalizacoes_bem on public.fiscalizacoes(bem_id);
create index if not exists idx_fiscalizacoes_responsavel on public.fiscalizacoes(responsavel_id);
create index if not exists idx_fiscalizacoes_created_by on public.fiscalizacoes(created_by);
create index if not exists idx_medicoes_conferida_por on public.medicoes(conferida_por);
create index if not exists idx_medicoes_created_by on public.medicoes(created_by);
create index if not exists idx_medicao_itens_medicao on public.medicao_itens(medicao_id);
create index if not exists idx_restricoes_responsavel on public.restricoes(responsavel_id);
create index if not exists idx_restricoes_created_by on public.restricoes(created_by);
create index if not exists idx_documentos_created_by on public.documentos(created_by);
create index if not exists idx_inspecoes_conservacao_responsavel on public.inspecoes_conservacao(responsavel_id);
create index if not exists idx_audit_actor on public.audit_log(actor_id);

insert into public.organizacoes (nome)
select 'Instituto do Patrimônio Histórico e Artístico Nacional'
where not exists (
  select 1 from public.organizacoes
  where nome = 'Instituto do Patrimônio Histórico e Artístico Nacional'
);

insert into public.unidades (organizacao_id, nome, uf)
select o.id, 'Superintendência do Iphan em Pernambuco', 'PE'
from public.organizacoes o
where o.nome = 'Instituto do Patrimônio Histórico e Artístico Nacional'
  and not exists (
    select 1 from public.unidades u
    where u.nome = 'Superintendência do Iphan em Pernambuco'
      and u.uf = 'PE'
  );

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_unidade uuid;
begin
  select id into v_unidade
  from public.unidades
  where nome = 'Superintendência do Iphan em Pernambuco'
    and uf = 'PE'
  limit 1;

  insert into public.perfis(id, unidade_id, nome, role, ativo)
  values (
    new.id,
    v_unidade,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email,''),'@',1), 'Usuário'),
    'consulta',
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function app_private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_new_user();

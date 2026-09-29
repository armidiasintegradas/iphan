-- IPHAN OS — performance cleanup e bootstrap do primeiro administrador.

create index if not exists idx_contratos_created_by
on public.contratos(created_by);

drop policy if exists "profiles_read_self" on public.perfis;
create policy "profiles_read_self"
on public.perfis for select
to authenticated
using (
  id = (select auth.uid())
  or unidade_id = app_private.current_unit_id()
);

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_unidade uuid;
  v_role public.user_role;
begin
  select id into v_unidade
  from public.unidades
  where nome = 'Superintendência do Iphan em Pernambuco'
    and uf = 'PE'
  limit 1;

  if exists (select 1 from public.perfis limit 1) then
    v_role := 'consulta';
  else
    v_role := 'admin';
  end if;

  insert into public.perfis(id, unidade_id, nome, role, ativo)
  values (
    new.id,
    v_unidade,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email,''),'@',1), 'Usuário'),
    v_role,
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function app_private.handle_new_user() from public, anon, authenticated;

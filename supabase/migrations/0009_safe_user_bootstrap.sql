-- IPHAN OS — hardening do bootstrap de usuários.
-- Todo cadastro público inicia como Consulta. Promoção administrativa é explícita.

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

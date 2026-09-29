-- IPHAN OS — auditoria automática e políticas de controle.

create or replace function public.capture_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log(actor_id, entidade, entidade_id, acao, antes, depois)
  values (
    auth.uid(),
    tg_table_name,
    coalesce((case when tg_op='DELETE' then old.id else new.id end), null),
    lower(tg_op),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end
  );
  return coalesce(new,old);
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'bens_culturais','intervencoes','ocorrencias','decisoes','evidencias',
    'fiscalizacoes','restricoes','medicoes','cronograma_itens','documentos'
  ]
  loop
    execute format('drop trigger if exists audit_%I on public.%I',t,t);
    execute format('create trigger audit_%I after insert or update or delete on public.%I for each row execute function public.capture_audit()',t,t);
  end loop;
end $$;

create policy "decisions_read_same_unit"
on public.decisoes for select to authenticated
using (
  exists (
    select 1 from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id and b.unidade_id=public.current_unit_id()
  )
);

create policy "decisions_insert_authorized"
on public.decisoes for insert to authenticated
with check (public.current_user_role() in ('admin','gestor','coordenador','tecnico'));

create policy "restrictions_read_same_unit"
on public.restricoes for select to authenticated
using (
  exists (
    select 1 from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id and b.unidade_id=public.current_unit_id()
  )
);

create policy "restrictions_insert_authorized"
on public.restricoes for insert to authenticated
with check (public.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico'));

create policy "audit_read_management"
on public.audit_log for select to authenticated
using (public.current_user_role() in ('admin','gestor','coordenador'));

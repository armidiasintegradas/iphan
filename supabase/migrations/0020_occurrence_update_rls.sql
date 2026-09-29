-- IPHAN OS — Beta 01
-- Autoriza conclusão/atualização de ocorrências dentro da unidade do usuário.

drop policy if exists "occurrences_update_authorized" on public.ocorrencias;
create policy "occurrences_update_authorized"
on public.ocorrencias for update
to authenticated
using (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
)
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
);

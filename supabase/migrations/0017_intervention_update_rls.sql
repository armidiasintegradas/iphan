-- IPHAN OS — Beta 01
-- Autoriza atualização de intervenções somente dentro da unidade e por perfis habilitados.

drop policy if exists "interventions_update_authorized" on public.intervencoes;
create policy "interventions_update_authorized"
on public.intervencoes for update
to authenticated
using (
  app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
  and exists (
    select 1
    from public.bens_culturais b
    where b.id = bem_id
      and b.unidade_id = app_private.current_unit_id()
  )
)
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
  and exists (
    select 1
    from public.bens_culturais b
    where b.id = bem_id
      and b.unidade_id = app_private.current_unit_id()
  )
);

-- IPHAN OS — Beta 01
-- Policies de atualização para fechamento do ciclo operacional.

drop policy if exists "heritage_update_authorized" on public.bens_culturais;
create policy "heritage_update_authorized"
on public.bens_culturais for update
to authenticated
using (
  unidade_id = app_private.current_unit_id()
  and app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
)
with check (
  unidade_id = app_private.current_unit_id()
  and app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
);

drop policy if exists "inspections_update_authorized" on public.fiscalizacoes;
create policy "inspections_update_authorized"
on public.fiscalizacoes for update
to authenticated
using (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico')
  and (
    bem_id is null
    or exists (
      select 1 from public.bens_culturais b
      where b.id = bem_id and b.unidade_id = app_private.current_unit_id()
    )
  )
)
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico')
);

drop policy if exists "decisions_update_authorized" on public.decisoes;
create policy "decisions_update_authorized"
on public.decisoes for update
to authenticated
using (
  app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id = i.bem_id
    where i.id = intervencao_id
      and b.unidade_id = app_private.current_unit_id()
  )
)
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
);

drop policy if exists "restrictions_update_authorized" on public.restricoes;
create policy "restrictions_update_authorized"
on public.restricoes for update
to authenticated
using (
  app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id = i.bem_id
    where i.id = intervencao_id
      and b.unidade_id = app_private.current_unit_id()
  )
)
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
);

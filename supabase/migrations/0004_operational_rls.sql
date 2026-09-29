-- IPHAN OS — políticas operacionais complementares.

create policy "schedule_read_same_unit"
on public.cronograma_itens for select
to authenticated
using (
  exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id = i.bem_id
    where i.id = intervencao_id
      and b.unidade_id = public.current_unit_id()
  )
);

create policy "schedule_write_authorized"
on public.cronograma_itens for insert
to authenticated
with check (
  public.current_user_role() in ('admin','gestor','coordenador','tecnico')
);

create policy "measurements_read_same_unit"
on public.medicoes for select
to authenticated
using (
  exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id = i.bem_id
    where i.id = intervencao_id
      and b.unidade_id = public.current_unit_id()
  )
);

create policy "measurements_insert_authorized"
on public.medicoes for insert
to authenticated
with check (
  public.current_user_role() in ('admin','gestor','coordenador','fiscal','executor')
);

create policy "measurements_update_approval"
on public.medicoes for update
to authenticated
using (
  public.current_user_role() in ('admin','gestor','coordenador')
)
with check (
  public.current_user_role() in ('admin','gestor','coordenador')
);

create policy "documents_read_same_unit"
on public.documentos for select
to authenticated
using (
  bem_id is null
  or exists (
    select 1 from public.bens_culturais b
    where b.id = bem_id and b.unidade_id = public.current_unit_id()
  )
);

create policy "inspections_read_same_unit"
on public.fiscalizacoes for select
to authenticated
using (
  bem_id is null
  or exists (
    select 1 from public.bens_culturais b
    where b.id = bem_id and b.unidade_id = public.current_unit_id()
  )
);

create policy "inspections_insert_authorized"
on public.fiscalizacoes for insert
to authenticated
with check (
  public.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico')
);

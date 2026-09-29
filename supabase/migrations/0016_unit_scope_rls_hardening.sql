-- IPHAN OS — Beta 01
-- Hardening de escopo por unidade em leituras e escritas operacionais.

-- Ocorrências
drop policy if exists "occurrences_insert_field_roles" on public.ocorrencias;
create policy "occurrences_insert_field_roles"
on public.ocorrencias for insert
to authenticated
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

-- Evidências
drop policy if exists "evidence_read_authenticated" on public.evidencias;
create policy "evidence_read_same_unit"
on public.evidencias for select
to authenticated
using (
  (
    intervencao_id is not null
    and exists (
      select 1
      from public.intervencoes i
      join public.bens_culturais b on b.id=i.bem_id
      where i.id=intervencao_id
        and b.unidade_id=app_private.current_unit_id()
    )
  )
  or
  (
    bem_id is not null
    and exists (
      select 1 from public.bens_culturais b
      where b.id=bem_id
        and b.unidade_id=app_private.current_unit_id()
    )
  )
);

drop policy if exists "evidence_insert_field_roles" on public.evidencias;
create policy "evidence_insert_field_roles"
on public.evidencias for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
  and (
    (
      intervencao_id is not null
      and exists (
        select 1
        from public.intervencoes i
        join public.bens_culturais b on b.id=i.bem_id
        where i.id=intervencao_id
          and b.unidade_id=app_private.current_unit_id()
      )
    )
    or
    (
      bem_id is not null
      and exists (
        select 1 from public.bens_culturais b
        where b.id=bem_id
          and b.unidade_id=app_private.current_unit_id()
      )
    )
  )
);

-- Storage de evidências: primeiro segmento do path = intervention UUID.
drop policy if exists "storage_evidence_read" on storage.objects;
create policy "storage_evidence_read"
on storage.objects for select
to authenticated
using (
  bucket_id='evidencias'
  and case
    when split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    then exists (
      select 1
      from public.intervencoes i
      join public.bens_culturais b on b.id=i.bem_id
      where i.id=split_part(name,'/',1)::uuid
        and b.unidade_id=app_private.current_unit_id()
    )
    else false
  end
);

drop policy if exists "storage_evidence_insert" on storage.objects;
create policy "storage_evidence_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id='evidencias'
  and app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
  and case
    when split_part(name,'/',1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    then exists (
      select 1
      from public.intervencoes i
      join public.bens_culturais b on b.id=i.bem_id
      where i.id=split_part(name,'/',1)::uuid
        and b.unidade_id=app_private.current_unit_id()
    )
    else false
  end
);

-- Cronograma
drop policy if exists "schedule_write_authorized" on public.cronograma_itens;
create policy "schedule_write_authorized"
on public.cronograma_itens for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
);

-- Medições
drop policy if exists "measurements_insert_authorized" on public.medicoes;
create policy "measurements_insert_authorized"
on public.medicoes for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','executor')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
);

drop policy if exists "measurements_update_approval" on public.medicoes;
create policy "measurements_update_approval"
on public.medicoes for update
to authenticated
using (
  app_private.current_user_role() in ('admin','gestor','coordenador')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
)
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
);

-- Fiscalizações
drop policy if exists "inspections_read_same_unit" on public.fiscalizacoes;
create policy "inspections_read_same_unit"
on public.fiscalizacoes for select
to authenticated
using (
  (
    bem_id is not null
    and exists (
      select 1 from public.bens_culturais b
      where b.id=bem_id
        and b.unidade_id=app_private.current_unit_id()
    )
  )
  or
  (
    intervencao_id is not null
    and exists (
      select 1
      from public.intervencoes i
      join public.bens_culturais b on b.id=i.bem_id
      where i.id=intervencao_id
        and b.unidade_id=app_private.current_unit_id()
    )
  )
);

drop policy if exists "inspections_insert_authorized" on public.fiscalizacoes;
create policy "inspections_insert_authorized"
on public.fiscalizacoes for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico')
  and (
    (
      bem_id is not null
      and exists (
        select 1 from public.bens_culturais b
        where b.id=bem_id
          and b.unidade_id=app_private.current_unit_id()
      )
    )
    or
    (
      intervencao_id is not null
      and exists (
        select 1
        from public.intervencoes i
        join public.bens_culturais b on b.id=i.bem_id
        where i.id=intervencao_id
          and b.unidade_id=app_private.current_unit_id()
      )
    )
  )
);

-- Decisões e restrições
drop policy if exists "decisions_insert_authorized" on public.decisoes;
create policy "decisions_insert_authorized"
on public.decisoes for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','tecnico')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
);

drop policy if exists "restrictions_insert_authorized" on public.restricoes;
create policy "restrictions_insert_authorized"
on public.restricoes for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
);

-- Conservação
drop policy if exists "conservation_inspections_write_authorized" on public.inspecoes_conservacao;
create policy "conservation_inspections_write_authorized"
on public.inspecoes_conservacao for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico')
  and exists (
    select 1 from public.bens_culturais b
    where b.id=bem_id
      and b.unidade_id=app_private.current_unit_id()
  )
);

-- Contratos
drop policy if exists "contracts_write_management" on public.contratos;
create policy "contracts_write_management"
on public.contratos for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador')
  and exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id=i.bem_id
    where i.id=intervencao_id
      and b.unidade_id=app_private.current_unit_id()
  )
);

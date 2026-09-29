-- IPHAN OS — documentos privados e políticas de acesso.

insert into storage.buckets (id, name, public)
values ('documentos','documentos',false)
on conflict (id) do update set public=false;

drop policy if exists "documents_read_same_unit" on public.documentos;

create policy "documents_read_same_unit"
on public.documentos for select
to authenticated
using (
  (
    bem_id is not null
    and exists (
      select 1 from public.bens_culturais b
      where b.id = bem_id
        and b.unidade_id = app_private.current_unit_id()
    )
  )
  or
  (
    intervencao_id is not null
    and exists (
      select 1
      from public.intervencoes i
      join public.bens_culturais b on b.id = i.bem_id
      where i.id = intervencao_id
        and b.unidade_id = app_private.current_unit_id()
    )
  )
);

create policy "documents_insert_authorized"
on public.documentos for insert
to authenticated
with check (
  app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
  and (
    (bem_id is not null and exists (
      select 1 from public.bens_culturais b
      where b.id=bem_id and b.unidade_id=app_private.current_unit_id()
    ))
    or
    (intervencao_id is not null and exists (
      select 1 from public.intervencoes i
      join public.bens_culturais b on b.id=i.bem_id
      where i.id=intervencao_id and b.unidade_id=app_private.current_unit_id()
    ))
  )
);

create policy "document_storage_read"
on storage.objects for select
to authenticated
using (
  bucket_id='documentos'
  and exists (
    select 1
    from public.documentos d
    left join public.bens_culturais b on b.id=d.bem_id
    left join public.intervencoes i on i.id=d.intervencao_id
    left join public.bens_culturais bi on bi.id=i.bem_id
    where d.storage_path=name
      and coalesce(b.unidade_id,bi.unidade_id)=app_private.current_unit_id()
  )
);

create policy "document_storage_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id='documentos'
  and app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
);

create policy "document_storage_delete_owner"
on storage.objects for delete
to authenticated
using (
  bucket_id='documentos'
  and owner_id=(select auth.uid()::text)
);

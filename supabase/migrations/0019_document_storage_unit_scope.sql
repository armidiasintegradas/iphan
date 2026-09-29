-- IPHAN OS — Beta 01
-- Restringe novos uploads de documentos ao prefixo da unidade autenticada.

drop policy if exists "document_storage_insert" on storage.objects;
create policy "document_storage_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id='documentos'
  and app_private.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
  and split_part(name,'/',1) = app_private.current_unit_id()::text
);

-- IPHAN OS — segurança inicial e armazenamento de evidências.
-- Aplicar somente no projeto Supabase exclusivo do sistema.

insert into storage.buckets (id, name, public)
values ('evidencias', 'evidencias', false)
on conflict (id) do nothing;

create or replace function public.current_unit_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select unidade_id from public.perfis where id = auth.uid() and ativo = true
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.perfis where id = auth.uid() and ativo = true
$$;

create policy "profiles_read_self"
on public.perfis for select
to authenticated
using (id = auth.uid() or unidade_id = public.current_unit_id());

create policy "heritage_read_same_unit"
on public.bens_culturais for select
to authenticated
using (unidade_id = public.current_unit_id());

create policy "heritage_write_authorized"
on public.bens_culturais for insert
to authenticated
with check (
  unidade_id = public.current_unit_id()
  and public.current_user_role() in ('admin','gestor','coordenador','tecnico')
);

create policy "interventions_read_same_unit"
on public.intervencoes for select
to authenticated
using (
  exists (
    select 1 from public.bens_culturais b
    where b.id = bem_id and b.unidade_id = public.current_unit_id()
  )
);

create policy "interventions_write_authorized"
on public.intervencoes for insert
to authenticated
with check (
  exists (
    select 1 from public.bens_culturais b
    where b.id = bem_id and b.unidade_id = public.current_unit_id()
  )
  and public.current_user_role() in ('admin','gestor','coordenador','tecnico')
);

create policy "occurrences_read_authenticated"
on public.ocorrencias for select
to authenticated
using (
  exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id = i.bem_id
    where i.id = intervencao_id and b.unidade_id = public.current_unit_id()
  )
);

create policy "occurrences_insert_field_roles"
on public.ocorrencias for insert
to authenticated
with check (
  public.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
);

create policy "evidence_read_authenticated"
on public.evidencias for select
to authenticated
using (true);

create policy "evidence_insert_field_roles"
on public.evidencias for insert
to authenticated
with check (
  public.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
);

create policy "storage_evidence_read"
on storage.objects for select
to authenticated
using (bucket_id = 'evidencias');

create policy "storage_evidence_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'evidencias'
  and public.current_user_role() in ('admin','gestor','coordenador','fiscal','tecnico','executor')
);

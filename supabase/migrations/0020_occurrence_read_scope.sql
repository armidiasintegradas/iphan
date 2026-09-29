-- IPHAN OS — Beta 01
-- Restringe leitura de ocorrências à unidade institucional do usuário.

drop policy if exists "occurrences_read_authenticated" on public.ocorrencias;
drop policy if exists "occurrences_read_same_unit" on public.ocorrencias;

create policy "occurrences_read_same_unit"
on public.ocorrencias for select
to authenticated
using (
  exists (
    select 1
    from public.intervencoes i
    join public.bens_culturais b on b.id = i.bem_id
    where i.id = intervencao_id
      and b.unidade_id = app_private.current_unit_id()
  )
);

-- IPHAN OS — gestão real de perfis.

create policy "profiles_update_management"
on public.perfis for update
to authenticated
using (
  unidade_id = app_private.current_unit_id()
  and app_private.current_user_role() in ('admin','gestor')
)
with check (
  unidade_id = app_private.current_unit_id()
  and app_private.current_user_role() in ('admin','gestor')
);

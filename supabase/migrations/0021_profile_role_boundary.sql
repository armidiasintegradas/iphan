-- IPHAN OS — Beta 01
-- Limita alterações de perfis conforme papel atual.

drop policy if exists "profiles_update_management" on public.perfis;

create policy "profiles_update_management"
on public.perfis for update
to authenticated
using (
  unidade_id = app_private.current_unit_id()
  and (
    app_private.current_user_role() = 'admin'
    or (
      app_private.current_user_role() = 'gestor'
      and role <> 'admin'
    )
  )
)
with check (
  unidade_id = app_private.current_unit_id()
  and (
    app_private.current_user_role() = 'admin'
    or (
      app_private.current_user_role() = 'gestor'
      and role <> 'admin'
    )
  )
);

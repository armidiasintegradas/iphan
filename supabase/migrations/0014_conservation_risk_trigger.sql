-- IPHAN OS — Beta 01
-- Remove RPC privilegiada exposta e sincroniza risco via trigger interno.

revoke all on function public.create_conservation_inspection(uuid,text,public.risk_level,text,timestamptz,date)
from public, anon, authenticated;
drop function if exists public.create_conservation_inspection(uuid,text,public.risk_level,text,timestamptz,date);

create or replace function app_private.sync_heritage_risk_from_inspection()
returns trigger
language plpgsql
security definer
set search_path = public, app_private
as $$
begin
  update public.bens_culturais
  set risco = new.estado,
      updated_at = now()
  where id = new.bem_id;
  return new;
end;
$$;

revoke all on function app_private.sync_heritage_risk_from_inspection()
from public, anon, authenticated;

drop trigger if exists on_conservation_inspection_sync_risk on public.inspecoes_conservacao;
create trigger on_conservation_inspection_sync_risk
after insert or update of estado on public.inspecoes_conservacao
for each row execute function app_private.sync_heritage_risk_from_inspection();

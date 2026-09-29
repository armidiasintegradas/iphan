-- IPHAN OS — Beta 01
-- Completa a trilha de auditoria nas entidades operacionais restantes.

drop trigger if exists audit_perfis on public.perfis;
create trigger audit_perfis
after insert or update or delete on public.perfis
for each row execute function app_private.capture_audit();

drop trigger if exists audit_contratos on public.contratos;
create trigger audit_contratos
after insert or update or delete on public.contratos
for each row execute function app_private.capture_audit();

drop trigger if exists audit_medicao_itens on public.medicao_itens;
create trigger audit_medicao_itens
after insert or update or delete on public.medicao_itens
for each row execute function app_private.capture_audit();

drop trigger if exists audit_inspecoes_conservacao on public.inspecoes_conservacao;
create trigger audit_inspecoes_conservacao
after insert or update or delete on public.inspecoes_conservacao
for each row execute function app_private.capture_audit();

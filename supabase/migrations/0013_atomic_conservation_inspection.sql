-- IPHAN OS — Beta 01
-- Conservação preventiva atômica: registra inspeção e atualiza somente o risco do bem.

create or replace function public.create_conservation_inspection(
  p_bem_id uuid,
  p_categoria text,
  p_estado public.risk_level,
  p_observacoes text default null,
  p_inspecionada_em timestamptz default now(),
  p_proxima_inspecao date default null
)
returns uuid
language plpgsql
security definer
set search_path = public, app_private
as $$
declare
  v_id uuid;
  v_role public.user_role;
  v_unit uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  v_role := app_private.current_user_role();
  v_unit := app_private.current_unit_id();

  if v_role not in ('admin','gestor','coordenador','fiscal','tecnico') then
    raise exception 'not_authorized';
  end if;

  if not exists (
    select 1 from public.bens_culturais b
    where b.id = p_bem_id and b.unidade_id = v_unit
  ) then
    raise exception 'heritage_not_found';
  end if;

  if p_proxima_inspecao is not null
     and p_proxima_inspecao < (p_inspecionada_em at time zone 'UTC')::date then
    raise exception 'invalid_period';
  end if;

  insert into public.inspecoes_conservacao(
    bem_id,categoria,estado,observacoes,inspecionada_em,proxima_inspecao,responsavel_id
  )
  values(
    p_bem_id,p_categoria,p_estado,p_observacoes,p_inspecionada_em,p_proxima_inspecao,auth.uid()
  )
  returning id into v_id;

  update public.bens_culturais
  set risco = p_estado,
      updated_at = now()
  where id = p_bem_id;

  return v_id;
end;
$$;

revoke all on function public.create_conservation_inspection(uuid,text,public.risk_level,text,timestamptz,date) from public, anon;
grant execute on function public.create_conservation_inspection(uuid,text,public.risk_level,text,timestamptz,date) to authenticated;

create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('participant','facilitator')),
  answers jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date,
  status text not null default 'setup' check (status in ('setup','active','completed'))
);

create table if not exists public.cohort_groups (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  name text not null,
  facilitator_user_id uuid references auth.users(id) on delete set null,
  timezone_label text
);

create table if not exists public.group_sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.cohort_groups(id) on delete cascade,
  module_id integer not null check (module_id between 1 and 6),
  session_date timestamptz not null,
  unique (group_id, module_id)
);

create table if not exists public.cohort_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  group_id uuid not null references public.cohort_groups(id) on delete cascade,
  role text not null check (role in ('participant','facilitator')),
  status text not null default 'accepted' check (status in ('accepted','revoked'))
);

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.admins where user_id=check_user_id); $$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;

alter table public.admins enable row level security;
alter table public.applications enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_groups enable row level security;
alter table public.group_sessions enable row level security;
alter table public.cohort_members enable row level security;

create policy "users read own admin status" on public.admins for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "users insert own applications" on public.applications for insert to authenticated with check (user_id=auth.uid());
create policy "users read own applications" on public.applications for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "admins update applications" on public.applications for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage cohorts" on public.cohorts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage groups" on public.cohort_groups for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage sessions" on public.group_sessions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage memberships" on public.cohort_members for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "members read own cohort" on public.cohorts for select to authenticated using (
  public.is_admin() or exists (
    select 1 from public.cohort_members cm join public.cohort_groups cg on cg.id=cm.group_id
    where cm.user_id=auth.uid() and cm.status='accepted' and cg.cohort_id=cohorts.id
  )
);
create policy "members read own group" on public.cohort_groups for select to authenticated using (
  public.is_admin() or exists (select 1 from public.cohort_members cm where cm.user_id=auth.uid() and cm.status='accepted' and cm.group_id=cohort_groups.id)
);
create policy "members read own sessions" on public.group_sessions for select to authenticated using (
  public.is_admin() or exists (select 1 from public.cohort_members cm where cm.user_id=auth.uid() and cm.status='accepted' and cm.group_id=group_sessions.group_id)
);
create policy "members read own membership" on public.cohort_members for select to authenticated using (user_id=auth.uid() or public.is_admin());

create or replace function public.admin_list_applications()
returns table(id uuid,user_id uuid,role text,answers jsonb,status text,created_at timestamptz,email text,full_name text)
language sql security definer set search_path=public,auth
as $$
  select a.id,a.user_id,a.role,a.answers,a.status,a.created_at,u.email::text,
  coalesce(u.raw_user_meta_data->>'full_name',u.raw_user_meta_data->>'name',split_part(u.email::text,'@',1))
  from public.applications a join auth.users u on u.id=a.user_id
  where public.is_admin() order by a.created_at desc;
$$;

create or replace function public.admin_list_accepted_facilitators()
returns table(user_id uuid,email text,full_name text,group_id uuid)
language sql security definer set search_path=public,auth
as $$
  select cm.user_id,u.email::text,
  coalesce(u.raw_user_meta_data->>'full_name',u.raw_user_meta_data->>'name',split_part(u.email::text,'@',1)),
  cm.group_id
  from public.cohort_members cm join auth.users u on u.id=cm.user_id
  where public.is_admin() and cm.role='facilitator' and cm.status='accepted'
  order by 3;
$$;

create or replace function public.admin_decide_application(p_application_id uuid,p_status text,p_group_id uuid default null)
returns void language plpgsql security definer set search_path=public
as $$
declare v_app public.applications%rowtype;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if p_status not in ('accepted','rejected') then raise exception 'Invalid status'; end if;
  select * into v_app from public.applications where id=p_application_id for update;
  if not found then raise exception 'Application not found'; end if;
  if p_status='accepted' and p_group_id is null then raise exception 'A cohort group is required when accepting an application'; end if;
  update public.applications set status=p_status where id=p_application_id;
  if p_status='accepted' then
    insert into public.cohort_members(user_id,application_id,group_id,role,status)
    values(v_app.user_id,v_app.id,p_group_id,v_app.role,'accepted')
    on conflict(user_id) do update set application_id=excluded.application_id,group_id=excluded.group_id,role=excluded.role,status='accepted';
    if v_app.role='facilitator' then
      update public.cohort_groups set facilitator_user_id=v_app.user_id where id=p_group_id;
    end if;
  else
    delete from public.cohort_members where application_id=v_app.id;
  end if;
end;
$$;

revoke all on function public.admin_list_applications() from public;
revoke all on function public.admin_list_accepted_facilitators() from public;
revoke all on function public.admin_decide_application(uuid,text,uuid) from public;
grant execute on function public.admin_list_applications() to authenticated;
grant execute on function public.admin_list_accepted_facilitators() to authenticated;
grant execute on function public.admin_decide_application(uuid,text,uuid) to authenticated;


-- Agora catalog schema.
-- Public, read-only catalog of Claude Code plugins. Row-level security is on with
-- anonymous SELECT only — the website uses the publishable (anon) key, which can read
-- the catalog but never write. Writes happen via migrations/seed (service role).

create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  description text not null,
  glyph       text not null,
  color       text not null,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.plugins (
  slug            text primary key,
  name            text not null,
  display_name    text not null,
  description     text not null,
  long_description text not null,
  category        text not null references public.categories (slug),
  kind            text not null check (kind in ('skill', 'agent')),
  keywords        text[] not null default '{}',
  invocation      text not null,
  color           text not null,
  glyph           text not null,
  version         text not null default '1.0.0',
  license         text not null default 'MIT',
  author_name     text not null,
  author_url      text not null,
  source          text not null,
  featured        boolean not null default false,
  downloads       integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists plugins_category_idx on public.plugins (category);
create index if not exists plugins_featured_idx on public.plugins (featured);

alter table public.categories enable row level security;
alter table public.plugins enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  using (true);

drop policy if exists "Public can read plugins" on public.plugins;
create policy "Public can read plugins"
  on public.plugins for select
  using (true);

-- Support community plugins: ones that live in a third-party GitHub repo and are referenced
-- from marketplace.json via a `github` source (the submitter keeps their own code).

alter table public.plugins
  add column if not exists community boolean not null default false,
  add column if not exists repo text,       -- owner/repo of the community plugin's repository
  add column if not exists homepage text;   -- docs / landing page

create index if not exists plugins_community_idx on public.plugins (community);

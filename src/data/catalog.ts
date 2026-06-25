import { PLUGINS as SEED_PLUGINS, CATEGORIES as SEED_CATEGORIES } from '@/data/seed';
import type { Category, CategoryWithCount, Plugin } from '@/data/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export const MARKETPLACE = {
  name: 'agora',
  displayName: 'Agora',
  domain: 'agora.gagansingh.tech',
  url: 'https://agora.gagansingh.tech',
  /** GitHub repo backing the git-based `/plugin marketplace add` form. Update if you fork. */
  repo: 'probablybadmove/agora',
  author: { name: 'Gagan Singh', url: 'https://gagansingh.tech' },
} as const;

/* ------------------------------------------------------------------ *
 * Synchronous accessors over the bundled seed (always available).
 * ------------------------------------------------------------------ */

export function getSeedPlugins(): Plugin[] {
  return SEED_PLUGINS;
}

export function getCategories(): Category[] {
  return SEED_CATEGORIES;
}

export function getPluginBySlug(slug: string, plugins: Plugin[] = SEED_PLUGINS): Plugin | undefined {
  return plugins.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return SEED_CATEGORIES.find((c) => c.slug === slug);
}

export function featured(plugins: Plugin[]): Plugin[] {
  const f = plugins.filter((p) => p.featured);
  return f.length ? f : plugins.slice(0, 3);
}

export function categoriesWithCounts(plugins: Plugin[]): CategoryWithCount[] {
  return SEED_CATEGORIES.map((c) => ({
    ...c,
    count: plugins.filter((p) => p.category === c.slug).length,
  })).filter((c) => c.count > 0);
}

export function searchPlugins(plugins: Plugin[], query: string, category?: string): Plugin[] {
  const q = query.trim().toLowerCase();
  return plugins.filter((p) => {
    if (category && p.category !== category) return false;
    if (!q) return true;
    const haystack = [p.name, p.displayName, p.description, p.category, ...p.keywords]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

/** Install command shown across the UI, e.g. `/plugin install pr-author@agora`. */
export function installCommand(p: Plugin): string {
  return `/plugin install ${p.slug}@${MARKETPLACE.name}`;
}

export function sourceUrl(p: Plugin): string {
  if (p.community && p.repo) return `https://github.com/${p.repo}`;
  return `https://github.com/${MARKETPLACE.repo}/tree/main/${p.source.replace('./', '')}`;
}

/* ------------------------------------------------------------------ *
 * Optional live fetch from Supabase (used when env vars are present).
 * Falls back to the bundled seed on any error.
 * ------------------------------------------------------------------ */

type PluginRow = {
  slug: string;
  name: string;
  display_name: string;
  description: string;
  long_description: string;
  category: string;
  kind: Plugin['kind'];
  keywords: string[] | null;
  invocation: string;
  color: string;
  glyph: string;
  version: string;
  license: string;
  author_name: string;
  author_url: string;
  source: string;
  featured: boolean | null;
  community?: boolean | null;
  repo?: string | null;
  homepage?: string | null;
};

function rowToPlugin(r: PluginRow): Plugin {
  return {
    slug: r.slug,
    name: r.name,
    displayName: r.display_name,
    description: r.description,
    longDescription: r.long_description,
    category: r.category,
    kind: r.kind,
    keywords: r.keywords ?? [],
    invocation: r.invocation,
    color: r.color,
    glyph: r.glyph,
    version: r.version,
    license: r.license,
    author: { name: r.author_name, url: r.author_url },
    source: r.source,
    featured: Boolean(r.featured),
    community: Boolean(r.community),
    repo: r.repo ?? undefined,
    homepage: r.homepage ?? undefined,
  };
}

export async function fetchPlugins(): Promise<Plugin[]> {
  if (!isSupabaseConfigured || !supabase) return SEED_PLUGINS;
  const { data, error } = await supabase
    .from('plugins')
    .select('*')
    .order('featured', { ascending: false })
    .order('name', { ascending: true });
  if (error || !data) return SEED_PLUGINS;
  return (data as PluginRow[]).map(rowToPlugin);
}

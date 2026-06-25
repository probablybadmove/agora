/** Shared catalog types. The same shape is used by the bundled seed, the Supabase
 *  rows, and the generated marketplace.json — one source of truth, three consumers. */

export type PluginKind = 'skill' | 'agent';

export type Plugin = {
  /** kebab-case id; also the plugin folder name and the marketplace entry name. */
  slug: string;
  name: string;
  displayName: string;
  description: string;
  longDescription: string;
  category: string;
  kind: PluginKind;
  keywords: string[];
  /** How a user triggers it, e.g. "/conventional-commits:commit". */
  invocation: string;
  color: string;
  glyph: string;
  version: string;
  license: string;
  author: { name: string; url: string };
  /** Relative source path inside the marketplace repo, e.g. "./plugins/pr-author". */
  source: string;
  featured: boolean;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  glyph: string;
  color: string;
};

export type CategoryWithCount = Category & { count: number };

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
  /** Relative source path inside the marketplace repo, e.g. "./plugins/pr-author".
   *  For community plugins this is unused — `repo` + `community` drive a github source. */
  source: string;
  featured: boolean;
  /** Community plugins live in the submitter's own repo, referenced by a github source. */
  community?: boolean;
  /** owner/repo of a community plugin's GitHub repository. */
  repo?: string;
  /** Optional homepage / docs URL. */
  homepage?: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  glyph: string;
  color: string;
};

export type CategoryWithCount = Category & { count: number };

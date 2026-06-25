import Head from 'expo-router/head';

import { MARKETPLACE } from '@/data/catalog';

/**
 * Per-route document title + meta for web SEO. Renders nothing on native.
 * Pass `bare` for pages (like the home page) whose title already includes the brand.
 */
export function Seo({
  title,
  description,
  path = '',
  bare = false,
}: {
  title: string;
  description?: string;
  path?: string;
  bare?: boolean;
}) {
  const fullTitle = bare ? title : `${title} · Agora`;
  const url = `${MARKETPLACE.url}${path}`;
  return (
    <Head>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </Head>
  );
}

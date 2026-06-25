import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Web-only root HTML document (Expo Router renders this with React DOM at build time).
 * Native apps ignore this file entirely.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Static, site-wide head. Per-route titles also update client-side via src/components/seo.tsx. */}
        <title>Agora — a marketplace for Claude Code plugins</title>
        <meta
          name="description"
          content="Agora is the public square for Claude Code plugins. Browse skills and subagents, then install them in one command."
        />
        <meta name="theme-color" content="#FBF7EF" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />

        {/* Open Graph / Twitter */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Agora" />
        <meta property="og:title" content="Agora — a marketplace for Claude Code plugins" />
        <meta
          property="og:description"
          content="The public square for Claude Code plugins. Browse, then install in one command."
        />
        <meta property="og:url" content="https://agora.gagansingh.tech" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* Expo's reset for full-height scrolling. */}
        <ScrollViewStyleReset />

        {/* Avoid a white flash before the app paints, in either color scheme. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body { background-color: #FBF7EF; }
@media (prefers-color-scheme: dark) {
  body { background-color: #16140F; }
}
::selection { background-color: rgba(194, 85, 47, 0.25); }
`;

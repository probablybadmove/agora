import { useEffect, useState } from 'react';

import { fetchPlugins, getSeedPlugins } from '@/data/catalog';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Plugin } from '@/data/types';

/**
 * Returns the plugin catalog. Renders instantly from the bundled seed, then — if Supabase
 * is configured — swaps in the live catalog once it loads. The site is never blocked on a
 * network request.
 */
export function useCatalog() {
  const [plugins, setPlugins] = useState<Plugin[]>(getSeedPlugins);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    fetchPlugins()
      .then((live) => {
        if (active && live.length) setPlugins(live);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { plugins, loading };
}

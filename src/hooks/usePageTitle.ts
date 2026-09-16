"use client";

import { useEffect } from 'react';

/**
 * Updates the document title dynamically on the client side.
 * Formats as "Drona - [title]".
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `Drona - ${title}`;
  }, [title]);
}

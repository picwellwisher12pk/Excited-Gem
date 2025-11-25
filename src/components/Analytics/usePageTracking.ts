import { useEffect } from 'react';
import { analytics } from '~/utils/analytics';

/**
 * Hook to track page views in Google Analytics
 * @param pagePath - The path of the page (e.g., '/tabs', '/sessions')
 * @param pageTitle - The title of the page
 */
export function usePageTracking(pagePath: string, pageTitle: string) {
  useEffect(() => {
    analytics.trackPageView(pagePath, pageTitle);
  }, [pagePath, pageTitle]);
}

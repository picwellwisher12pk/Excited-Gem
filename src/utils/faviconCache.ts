export class FaviconCache {
  private static instance: FaviconCache
  private cache: Map<string, string>

  private constructor() {
    this.cache = new Map()
    this.loadFromStorage()
  }

  public static getInstance(): FaviconCache {
    if (!FaviconCache.instance) {
      FaviconCache.instance = new FaviconCache()
    }
    return FaviconCache.instance
  }

  private loadFromStorage() {
    try {
      const stored = sessionStorage.getItem('favicon_cache')
      if (stored) {
        const parsed = JSON.parse(stored)
        Object.entries(parsed).forEach(([domain, url]) => {
          this.cache.set(domain, url as string)
        })
      }
    } catch (e) {
      console.error('Failed to load favicon cache', e)
    }
  }

  private saveToStorage() {
    try {
      const obj = Object.fromEntries(this.cache)
      sessionStorage.setItem('favicon_cache', JSON.stringify(obj))
    } catch (e) {
      console.error('Failed to save favicon cache', e)
    }
  }

  public get(url: string): string | undefined {
    try {
      const domain = new URL(url).hostname
      return this.cache.get(domain)
    } catch {
      return undefined
    }
  }

  public set(url: string, faviconUrl: string) {
    try {
      const domain = new URL(url).hostname
      if (domain && faviconUrl && !this.cache.has(domain)) {
        this.cache.set(domain, faviconUrl)
        this.saveToStorage()
      }
    } catch {
      // Ignore invalid URLs
    }
  }

  public getOrSet(url: string, faviconUrl: string): string {
    const cached = this.get(url)
    if (cached) {
      return cached
    }
    this.set(url, faviconUrl)
    return faviconUrl
  }
}

export const faviconCache = FaviconCache.getInstance()

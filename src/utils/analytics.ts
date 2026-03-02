// Google Analytics utility for Browser Extension
// This uses the Measurement Protocol for extensions

// Hard-coded GA4 Measurement ID - Replace with your actual ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX' // TODO: Replace with your actual GA4 Measurement ID

interface AnalyticsConfig {
  measurementId: string
  enabled: boolean
}

class Analytics {
  private config: AnalyticsConfig = {
    measurementId: GA_MEASUREMENT_ID,
    enabled: true // Always enabled
  }

  private clientId: string = ''

  async initialize() {
    // Get or create client ID
    const clientIdResult = await chrome.storage.local.get(['ga_client_id'])
    if (clientIdResult.ga_client_id) {
      this.clientId = clientIdResult.ga_client_id
    } else {
      this.clientId = this.generateClientId()
      await chrome.storage.local.set({ ga_client_id: this.clientId })
    }
  }

  private generateClientId(): string {
    return `${Date.now()}.${Math.random().toString(36).substring(2, 15)}`
  }

  async trackPageView(pagePath: string, pageTitle: string) {
    if (
      !this.config.measurementId ||
      this.config.measurementId === 'G-XXXXXXXXXX'
    ) {
      console.log('[Analytics] Measurement ID not configured')
      return
    }

    try {
      const params = new URLSearchParams({
        v: '1',
        tid: this.config.measurementId,
        cid: this.clientId,
        t: 'pageview',
        dp: pagePath,
        dt: pageTitle,
        dl: `chrome-extension://${chrome.runtime.id}${pagePath}`
      })

      await fetch(
        `https://www.google-analytics.com/collect?${params.toString()}`,
        {
          method: 'POST',
          mode: 'no-cors'
        }
      )
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  async trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number
  ) {
    if (
      !this.config.measurementId ||
      this.config.measurementId === 'G-XXXXXXXXXX'
    ) {
      console.log('[Analytics] Measurement ID not configured')
      return
    }

    try {
      const params: any = {
        v: '1',
        tid: this.config.measurementId,
        cid: this.clientId,
        t: 'event',
        ec: category,
        ea: action
      }

      if (label) params.el = label
      if (value !== undefined) params.ev = value.toString()

      const urlParams = new URLSearchParams(params)

      await fetch(
        `https://www.google-analytics.com/collect?${urlParams.toString()}`,
        {
          method: 'POST',
          mode: 'no-cors'
        }
      )
    } catch (error) {
      console.error('Analytics event tracking error:', error)
    }
  }

  getConfig(): AnalyticsConfig {
    return { ...this.config }
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Initialize on import
analytics.initialize()

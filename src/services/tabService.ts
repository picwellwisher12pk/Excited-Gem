// Check if we're in a browser extension environment
const isExtensionEnvironment = !!chrome?.tabs

// Function to control a YouTube video
export const controlYouTubeVideo = async (
  tabId: number,
  action: 'play' | 'pause' | 'seek',
  percentage?: number
): Promise<boolean> => {
  if (!isExtensionEnvironment) return false

  try {
    const message: any = { type: 'CONTROL_YOUTUBE_VIDEO', action }
    if (action === 'seek' && percentage !== undefined) {
      message.percentage = percentage
    }

    const response = await chrome.tabs.sendMessage(tabId, message)
    return response?.success || false
  } catch (error) {
    console.error('Error controlling YouTube video:', error)
    return false
  }
}

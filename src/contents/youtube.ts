import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*", "http://www.youtube.com/*", "https://youtube.com/shorts/*"]
}

// YouTube content script to extract video information
console.log("[YouTube Script] Content script loaded");

// Function to get current video information
function getYouTubeVideoInfo() {
    try {
        const video = document.querySelector("video");
        if (!video) {
            // console.log("[YouTube Script] No video element found");
            return null;
        }

        const videoElement = video;
        const duration = videoElement.duration;
        const currentTime = videoElement.currentTime;
        const paused = videoElement.paused;
        const title =
            document.querySelector(".title.ytd-video-primary-info-renderer")?.textContent ??
            document.querySelector("h1.title")?.textContent ??
            document.querySelector("h1.ytd-watch-metadata")?.textContent ??
            document.querySelector("ytd-reel-video-renderer[is-active] .title")?.textContent ??
            document.querySelector(".ytd-shorts-player-overlay-title")?.textContent ??
            "YouTube Video";
        const info = {
            duration,
            currentTime,
            paused,
            title,
            percentage: duration ? (currentTime / duration) * 100 : 0
        };

        // console.log("[YouTube Script] Video info retrieved:", info);
        return info;
    } catch (error) {
        console.error("[YouTube Script] Error getting YouTube video info:", error);
        return null;
    }
}

// Send video information to the extension via sendMessage (for debug)
function sendVideoInfoToExtension() {
    const videoInfo = getYouTubeVideoInfo();
    if (videoInfo) {
        try {
            console.log("[YouTube Script] Sending video info via sendMessage:", videoInfo);
            chrome.runtime.sendMessage({
                type: "YOUTUBE_VIDEO_INFO",
                data: videoInfo,
                url: window.location.href,
            });
        } catch (error) {
            // console.error("[YouTube Script] Failed to send message via sendMessage:", error);
        }
    }
}

// Set up periodic updates
let updateInterval: number | null = null;
let videoTimeUpdateListener: (() => void) | null = null;

function startUpdates() {
    // Clear any existing interval
    if (updateInterval !== null) {
        clearInterval(updateInterval);
    }
    // Remove previous timeupdate listener if any
    const prevVideo = document.querySelector("video");
    if (prevVideo && videoTimeUpdateListener) {
        prevVideo.removeEventListener("timeupdate", videoTimeUpdateListener);
    }

    // Send initial info
    console.log("[YouTube Script] Starting updates");
    sendVideoInfoToExtension();

    // Set up regular updates (every 1000ms - less frequent to save resources)
    updateInterval = window.setInterval(sendVideoInfoToExtension, 1000);

    // Add timeupdate event for real-time updates
    const video = document.querySelector("video");
    if (video) {
        videoTimeUpdateListener = () => sendVideoInfoToExtension();
        video.addEventListener("timeupdate", videoTimeUpdateListener);
        video.addEventListener("play", () => sendVideoInfoToExtension());
        video.addEventListener("pause", () => sendVideoInfoToExtension());
        video.addEventListener("seeked", () => sendVideoInfoToExtension());
    }
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log("[YouTube Script] Message received:", message);

    if (message.type === "GET_YOUTUBE_INFO") {
        const info = getYouTubeVideoInfo();
        sendResponse(info);
        return true;
    } else if (message.type === "CONTROL_YOUTUBE_VIDEO") {
        const video = document.querySelector("video");
        if (video) {
            console.log("[YouTube Script] Controlling video:", message.action);
            try {
                if (message.action === "play") {
                    video.play();
                } else if (message.action === "pause") {
                    video.pause();
                } else if (message.action === "seek") {
                    video.currentTime = (message.percentage / 100) * video.duration;
                }
                sendResponse({ success: true });
            } catch (error: any) {
                console.error("[YouTube Script] Error controlling video:", error);
                sendResponse({ success: false, error: error.toString() });
            }
        } else {
            console.error(
                "[YouTube Script] Video element not found for control action",
            );
            sendResponse({ success: false, error: "Video element not found" });
        }
        return true;
    }
});

// Start sending updates when the page is fully loaded
if (document.readyState === "complete") {
    console.log("[YouTube Script] Document already complete, starting now");
    startUpdates();
} else {
    console.log("[YouTube Script] Waiting for document to load");
    window.addEventListener("load", () => {
        console.log("[YouTube Script] Document loaded, starting now");
        startUpdates();
    });
}

// Also listen for video elements being added to the page (for SPAs like YouTube)
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            if (document.querySelector("video") && !updateInterval) {
                console.log(
                    "[YouTube Script] Video element detected via MutationObserver",
                );
                startUpdates();
                break;
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Clean up when the page is unloaded
window.addEventListener("beforeunload", () => {
    console.log("[YouTube Script] Page unloading, cleaning up");
    if (updateInterval !== null) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
    // Remove timeupdate listener
    const video = document.querySelector("video");
    if (video && videoTimeUpdateListener) {
        video.removeEventListener("timeupdate", videoTimeUpdateListener);
    }
    observer.disconnect();
});

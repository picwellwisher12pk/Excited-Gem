export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
}

// Ensure this matches the manifest.json
const CLIENT_ID = "895689043158-ilstmlvd16i9p88n22b7sva0d6mhnp6n.apps.googleusercontent.com";
const SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive.appdata"
].join(" ");

/**
 * Gets the OAuth2 token for the current user.
 * We use `launchWebAuthFlow` because `chrome.identity.getAuthToken` isn't supported in Edge.
 */
export const getAuthToken = (interactive = true): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Check local storage first (acting as our cache)
    chrome.storage.local.get("googleAccessToken", (result) => {
      const cachedToken = result.googleAccessToken;

      // Basic validity check (doesn't check expiry, but handles logout)
      if (cachedToken && !interactive) {
        return resolve(cachedToken);
      }

    // 2. If no token, launch authorization flow
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}&` +
      `response_type=token&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(SCOPES)}`;

    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive },
      (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error("Auth Error:", chrome.runtime.lastError?.message);
          return reject(chrome.runtime.lastError?.message || "Failed to authenticate");
        }

        // 3. Extract access_token from the redirect URL fragment
        // E.g., https://<extension-id>.chromiumapp.org/#access_token=ya29...&token_type=Bearer...
        const urlParams = new URL(redirectUrl).hash.substring(1).split('&');
        let token = null;

        for (const param of urlParams) {
          const [key, value] = param.split('=');
          if (key === 'access_token') {
            token = value;
            break;
          }
        }

        if (token) {
          // Save to local 'cache'
          chrome.storage.local.set({ googleAccessToken: token });
          resolve(token);
        } else {
          console.error("Token not found in redirect URL:", redirectUrl);
          reject("Failed to parse token from redirect URL");
        }
      }
    );
    });
  });
};

/**
 * Revokes the token and removes it from the browser's identity cache.
 */
export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.get("googleAccessToken", (result) => {
      const token = result.googleAccessToken;

      // Always remove from local cache immediately
      chrome.storage.local.remove("googleAccessToken");

      if (token) {
        // Attempt to revoke the token on Google's servers
        fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(() => resolve())
          .catch(() => resolve()); // Resolve anyway so UI updates
      } else {
        resolve();
      }
    });
  });
};

/**
 * Fetches the user's profile information using the Google People API (or UserInfo).
 */
export const getUserProfile = async (token: string): Promise<UserProfile> => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    // If the token is rejected by the API (e.g., expired), clear the local cache
    if (response.status === 401) {
       chrome.storage.local.remove("googleAccessToken");
    }
    throw new Error("Failed to fetch user profile");
  }

  const data = await response.json();
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture
  };
};

/**
 * Top-level function to trigger login and return the profile.
 */
export const loginAndGetProfile = async (): Promise<{
  token: string;
  profile: UserProfile;
}> => {
  const token = await getAuthToken(true);
  const profile = await getUserProfile(token);
  return { token, profile };
};

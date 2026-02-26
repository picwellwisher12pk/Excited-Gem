import { getAuthToken } from "./auth";

const FILE_NAME = "excited_gem_backup.json";

/**
 * Helper to find the existing backup file in the appDataFolder.
 */
const findBackupFileId = async (token: string): Promise<string | null> => {
  const query = encodeURIComponent(`name='${FILE_NAME}'`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}&fields=files(id,name)`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("DEBUG Drive API findBackupFileId Error:", response.status, errorText);
    throw new Error(`Failed to search Drive files: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id; // Return the first matching file ID
  }
  return null;
};

/**
 * Creates a new backup file in the appDataFolder.
 */
const createBackupFile = async (
  token: string,
  sessionData: any
): Promise<void> => {
  const metadata = {
    name: FILE_NAME,
    parents: ["appDataFolder"]
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append(
    "file",
    new Blob([JSON.stringify(sessionData)], { type: "application/json" })
  );

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("DEBUG Drive API createBackupFile Error:", response.status, errorText);
    throw new Error(`Failed to create backup file: ${response.status} ${errorText}`);
  }
};

/**
 * Updates an existing backup file.
 */
const updateBackupFile = async (
  token: string,
  fileId: string,
  sessionData: any
): Promise<void> => {
  const response = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sessionData)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("DEBUG Drive API updateBackupFile Error:", response.status, errorText);
    throw new Error(`Failed to update backup file: ${response.status} ${errorText}`);
  }
};

/**
 * Main export: Backs up the provided data to Google Drive app data folder.
 */
export const backupToDrive = async (sessionData: any): Promise<void> => {
  const token = await getAuthToken(true);
  const fileId = await findBackupFileId(token);

  if (fileId) {
    await updateBackupFile(token, fileId, sessionData);
  } else {
    await createBackupFile(token, sessionData);
  }
};

/**
 * Main export: Retrieves the latest backup from Google Drive.
 */
export const restoreFromDrive = async (): Promise<any | null> => {
  const token = await getAuthToken(true);
  const fileId = await findBackupFileId(token);

  if (!fileId) {
    return null; // No backup found
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("DEBUG Drive API restoreFromDrive Error:", response.status, errorText);
    throw new Error(`Failed to download backup file: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Converts a File object to a base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Strips the data URL prefix (e.g., "data:image/png;base64,") from a base64 string.
 */
export const stripBase64Prefix = (base64: string): string => {
  return base64.split(',')[1] || base64;
};

/**
 * Gets the MIME type from a base64 data URL.
 */
export const getMimeTypeFromBase64 = (base64: string): string => {
  const match = base64.match(/^data:(.+);base64,/);
  return match ? match[1] : 'image/png'; // Default fallback
};

/**
 * Convert an image URL to base64
 * This function handles CORS issues with S3 URLs and ensures reliable image loading for PDF generation
 */
export const convertImageToBase64 = async (url) => {
  if (!url) {
    throw new Error('URL is required');
  }

  // Try fetch API first (works best with S3 signed URLs)
  try {
    const response = await fetch(url, {
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit' // Don't send credentials with S3 signed URLs
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read blob as data URL'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });
  } catch (fetchError) {
    console.error('Fetch approach failed:', fetchError);
  }
  
  // Try XMLHttpRequest as fallback
  try {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 10000; // 10 second timeout
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const reader = new FileReader();
          reader.onloadend = function() {
            if (reader.result) {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read XHR response as data URL'));
            }
          };
          reader.onerror = () => reject(new Error('FileReader error in XHR'));
          reader.readAsDataURL(xhr.response);
        } else {
          reject(new Error(`XHR failed with status ${xhr.status}`));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('XHR network error'));
      };
      
      xhr.ontimeout = function() {
        reject(new Error('XHR timeout'));
      };
      
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  } catch (xhrError) {
    console.error('XHR approach failed:', xhrError);
  }
  
  // Try using Image element as last resort (for same-origin or CORS-enabled images)
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.timeout = 10000;
      
      const timeoutId = setTimeout(() => {
        reject(new Error('Image loading timeout'));
      }, 10000);
      
      img.onload = function() {
        clearTimeout(timeoutId);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch (canvasError) {
          reject(new Error('Canvas conversion failed: ' + canvasError.message));
        }
      };
      
      img.onerror = function() {
        clearTimeout(timeoutId);
        reject(new Error('Image loading failed'));
      };
      
      img.src = url;
    });
  } catch (imgError) {
    console.error('Image element approach failed:', imgError);
    throw new Error('All image conversion methods failed. Unable to convert URL to base64.');
  }
};
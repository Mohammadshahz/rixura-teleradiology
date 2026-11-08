/**
 * Convert an image URL to base64
 * This function handles CORS issues with S3 URLs
 */
export const convertImageToBase64 = async (url) => {
    // Check if the URL is from S3
    const isS3Url = url && (
      url.includes('amazonaws.com') || 
      url.includes('s3.') || 
      url.includes('X-Amz-')
    );
    
    // For S3 URLs with React-PDF, we can return the URL directly
    // React-PDF handles CORS better than html2pdf
    if (isS3Url) {
      return url;
    }
    
    // For non-S3 URLs, we'll still try to convert to base64
    // This ensures maximum compatibility
    
    // Try fetch API first (modern browsers)
    try {
      const response = await fetch(url, {
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (fetchError) {
      console.error('Fetch approach failed:', fetchError);
    }
    
    // Try XMLHttpRequest as fallback
    try {
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            const reader = new FileReader();
            reader.onloadend = function() {
              resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
          } else {
            reject(new Error(`XHR failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = function(error) {
          console.error('XHR error:', error);
          reject(error);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      });
    } catch (xhrError) {
      console.error('XHR approach failed:', xhrError);
      // Return the original URL as last resort
      // React-PDF will try to handle it directly
      return url;
    }
  };
import { toast } from 'react-toastify';

export const errorHandler = (error: any) => {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message || // Custom API error message
    error?.message ||                 // Fallback JS error message
    'Something went wrong';

  toast.error(message);

  switch (status) {
    case 400:
      console.error('Bad Request:', message);
      break;
    case 401:
      console.error('Unauthorized:', message);
      break;
    case 403:
      console.error('Forbidden:', message);
      break;
    case 404:
      console.error('Not Found:', message);
      break;
    case 500:
      console.error('Server Error:', message);
      break;
    default:
      console.error('Error:', message);
  }
  throw error;
};
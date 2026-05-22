/**
 * Utility for adding bearer token to all API requests
 */

export const getAuthHeaders = () => {
  const token = process.env.NEXT_PUBLIC_BEARER_TOKEN;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const getMultipartHeaders = () => {
  const token = process.env.NEXT_PUBLIC_BEARER_TOKEN;
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export const createAxiosInstance = () => {
  const token = process.env.NEXT_PUBLIC_BEARER_TOKEN;
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
};

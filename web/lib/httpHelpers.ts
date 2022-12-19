import { getCookie } from 'cookies-next';

const serviceUrl = process.env.NEXT_PUBLIC_API_URL;

export const getServiceUrl = (completing?: string): string => {
  return `${serviceUrl}${completing?.length && `/${completing}`}`;
};

export const getAuthHeaders = (req?: any) => {
  let token;
  if (req) {
    token = req.session.accessToken;
  } else {
    token = getCookie('access-token');
  }
  return { Authorization: `Bearer ${token?.toString()}` };
};

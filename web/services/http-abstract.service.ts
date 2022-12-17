import { DecodedUserToken } from '../models/user/decoded-user-token';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';

export abstract class HttpService {
  constructor() {
    axios.interceptors.request.use(
      function (config) {
        console.log('interceptor', config);
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
  }

  private serviceUrl: string = `${process.env.NEXT_PUBLIC_API_URL}`;

  protected getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return { Authorization: `Bearer ${token}` };
  };

  protected getDecodedToken = (): DecodedUserToken | null => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }
    return jwtDecode(token);
  };

  protected getServiceUrl = (completing?: string): string => {
    return `${this.serviceUrl}${completing?.length && `/${completing}`}`;
  };

  protected getRequest = async (url: string, headers?: any) => {
    try {
      const axiosResponse = await axios.get(url, {
        method: 'GET',
        headers: headers || this.getAuthHeaders(),
      });
      return await axiosResponse.data;
    } catch (error) {
      return error;
    }
  };

  protected postRequest = async (url: string, body: any, headers?: any) => {
    try {
      const axiosResponse = await axios.post(url, body, {
        headers: headers || this.getAuthHeaders(),
      });
      return await axiosResponse.data;
    } catch (error: any) {
      toast.error(`${error.response.statusText}`);
    }
  };

  protected putRequest = async (url: string, body: any, headers?: any) => {
    try {
      const axiosResponse = await axios.put(url, body, {
        headers: headers || this.getAuthHeaders(),
      });
      return await axiosResponse.data;
    } catch (error) {
      return error;
    }
  };

  protected deleteRequest = async (url: string, headers?: any) => {
    try {
      const axiosResponse = await axios.delete(url, {
        method: 'DELETE',
        headers: headers || this.getAuthHeaders(),
      });
      return await axiosResponse.data;
    } catch (error) {
      return error;
    }
  };
}

import { AddUser } from '../models/user/add-user';
import { UserLogin } from '../models/user/user-login';
import { HttpService } from './http-abstract.service';

export interface IAuthService {
  signUp(user: AddUser): Promise<any>;
  login(user: UserLogin): Promise<any>;
  validateUserToken(): Promise<boolean>;
}

export class AuthService extends HttpService implements IAuthService {
  private endpointPrefix: string = 'auth';

  constructor() {
    super();
  }

  signUp = async (user: AddUser): Promise<any> => {
    return await this.postRequest(this.getServiceUrl(`${this.endpointPrefix}/signup`), user);
  };

  validateUserToken = async () => {
    return await this.getRequest(this.getServiceUrl(`${this.endpointPrefix}/verify`), this.getAuthHeaders());
  };

  login = async (user: UserLogin): Promise<any> => {
    return await this.postRequest(this.getServiceUrl(`${this.endpointPrefix}/login`), user);
  };
}

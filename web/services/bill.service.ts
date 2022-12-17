import { AddBill } from '../models/bill/add-bill';
import { UpdateBill } from '../models/bill/update-bill';
import { HttpService } from './http-abstract.service';

export interface IBillService {
  createBill(bill: AddBill): Promise<any>;
  getBill(id: number): Promise<any>;
  getUserBills(userId: number): Promise<any>;
  updateBill(id: number, bill: UpdateBill): Promise<any>;
  deleteBill(id: number): Promise<any>;
}

export class BillService extends HttpService implements IBillService {
  private endpointPrefix: string = 'bill';

  constructor() {
    super();
  }

  createBill = async (bill: AddBill): Promise<any> => {
    return await this.postRequest(this.getServiceUrl(`${this.endpointPrefix}`), bill, this.getAuthHeaders());
  };

  getBill = async (id: number): Promise<any> => {
    return await this.getRequest(this.getServiceUrl(`${this.endpointPrefix}/${id}`), this.getAuthHeaders());
  };

  getUserBills = async (userId: number): Promise<any> => {
    return await this.getRequest(this.getServiceUrl(`${this.endpointPrefix}/user/${userId}`), this.getAuthHeaders());
  };

  updateBill = async (id: number, bill: UpdateBill): Promise<any> => {
    return await this.putRequest(this.getServiceUrl(`${this.endpointPrefix}/${id}`), bill, this.getAuthHeaders());
  };

  deleteBill = async (id: number): Promise<any> => {
    return await this.deleteRequest(this.getServiceUrl(`${this.endpointPrefix}/${id}`), this.getAuthHeaders());
  };
}

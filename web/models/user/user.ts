export interface User {
  id?: number;
  email?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  isLoggedIn?: boolean;
  countryCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userGroupId?: number;
}

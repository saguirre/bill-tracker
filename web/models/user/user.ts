export interface User {
  id?: number;
  email?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  isLoggedIn?: boolean;
  notifications?: boolean;
  inAppNotifications?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  usageStatistics?: boolean;
  countryCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userGroupId?: number;
}

export type UserRole = 'NORMAL_USER' | 'BUS_OWNER' | 'SUPER_ADMIN';

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  isEmailVerified: boolean;
  phoneNumber?: string | null;
  companyName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  email?: string;
  role?: UserRole | '';
  isBlocked?: boolean | '';
}

export interface UserStats {
  totalUsers: number;
  normalUsers: number;
  busOwners: number;
  superAdmins: number;
  blockedUsers: number;
  verifiedUsers: number;
}

export interface GetUsersResponse {
  statusCode: number;
  message: string;
  data: {
    totalPage: number;
    totalCount: number;
    currentPage: number;
    result: UserListItem[];
  };
}

export interface GetStatsResponse {
  statusCode: number;
  message: string;
  data: UserStats;
}

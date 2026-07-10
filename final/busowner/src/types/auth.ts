export interface User {
  fullName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  role: '100' | '200' | string;
}

export interface UserSession {
  auth: string; // authorization token
  user: User;
}

export interface AuthState {
  user: UserSession | null;
  otherUserinfo: {
    role: string;
  };
}

export interface AuthApiResponse {
  statusCode: number;
  message: string;
  data: UserSession | any;
}

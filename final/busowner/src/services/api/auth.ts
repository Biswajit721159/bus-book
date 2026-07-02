import { request } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { UserSession } from '../../types/auth';

// ─── Response Types ────────────────────────────────────────────────────────────

export interface BaseResponse {
  statusCode: number;
  message: string;
}

export interface AuthDataResponse extends BaseResponse {
  data: UserSession;
}

// ─── Request Body Types ────────────────────────────────────────────────────────

export interface RegisterBody {
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface OtpVerifyBody {
  email: string;
  otp: string;
  password?: string;
}

// ─── Normalizer ────────────────────────────────────────────────────────────────

const normalizeAuthData = (raw: any): UserSession => ({
  auth: raw.token,
  user: {
    fullName: raw.name || raw.fullName || '',
    email: raw.email || '',
    companyName: raw.companyName || '',
    phoneNumber: raw.phoneNumber || '',
    role: raw.role === 'SUPER_ADMIN' ? '200' : '100',
  },
});

// ─── API Functions ─────────────────────────────────────────────────────────────

export const authApi = {
  register: async (body: RegisterBody): Promise<BaseResponse> => {
    const res = await request<BaseResponse>(API_ENDPOINTS.AUTH.REGISTER, { method: 'POST', body });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.message);
    return res;
  },

  registerVerifyOtp: async (body: OtpVerifyBody): Promise<BaseResponse> => {
    const res = await request<BaseResponse>(API_ENDPOINTS.AUTH.REGISTER_VERIFY_OTP, { method: 'POST', body });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.message);
    return res;
  },

  login: async (body: LoginBody): Promise<BaseResponse> => {
    const res = await request<BaseResponse>(API_ENDPOINTS.AUTH.LOGIN, { method: 'POST', body });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.message);
    return res;
  },

  loginVerifyOtp: async (body: OtpVerifyBody): Promise<AuthDataResponse> => {
    const res = await request<any>(API_ENDPOINTS.AUTH.LOGIN_VERIFY_OTP, { method: 'POST', body });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.message);
    return { ...res, data: normalizeAuthData(res.data) };
  },

  resendOtp: async (email: string): Promise<BaseResponse> => {
    const res = await request<BaseResponse>(API_ENDPOINTS.AUTH.RESEND_OTP, { method: 'POST', body: { email } });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.message);
    return res;
  },

  forgotPassword: async (email: string): Promise<BaseResponse> => {
    const res = await request<BaseResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { method: 'POST', body: { email } });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.message);
    return res;
  },

  resetPassword: async (body: OtpVerifyBody & { password: string }): Promise<BaseResponse> => {
    const res = await request<BaseResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, { method: 'POST', body });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.message);
    return res;
  },

  googleLogin: async (token: string): Promise<AuthDataResponse> => {
    const res = await request<any>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, { method: 'POST', body: { token } });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(res.message);
    return { ...res, data: normalizeAuthData(res.data) };
  },

  loginByToken: async (): Promise<AuthDataResponse> => {
    const res = await request<any>(API_ENDPOINTS.AUTH.LOGIN_BY_TOKEN, { method: 'POST' });
    if (res.statusCode !== 200) throw new Error(res.message || 'Session expired');
    // logInByToken already returns structured user data
    return {
      statusCode: res.statusCode,
      message: res.message,
      data: {
        auth: JSON.parse(localStorage.getItem('user') || '{}')?.auth || '',
        user: {
          fullName: res.data?.fullName || '',
          email: res.data?.email || '',
          companyName: res.data?.companyName || '',
          phoneNumber: res.data?.phoneNumber || '',
          role: res.data?.role === 'SUPER_ADMIN' ? '200' : (res.data?.role || '100'),
        },
      },
    };
  },
};

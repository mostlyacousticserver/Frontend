import { api } from "@/lib/axios";
import type {
  AuthTokensResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyOtpRequest,
} from "@/types/auth";

export const AuthAPI = {
  register(payload: RegisterRequest) {
    return api.post<RegisterResponse>("/auth/register", payload);
  },

  login(payload: LoginRequest) {
    return api.post<LoginResponse>("/auth/login", payload);
  },

  verifyOtp(payload: VerifyOtpRequest) {
    return api.post<AuthTokensResponse>("/auth/verify-otp", payload);
  },

  resendOtp(payload: ResendOtpRequest) {
    return api.post<{ message: string }>("/auth/resend-otp", payload);
  },

  forgotPassword(payload: ForgotPasswordRequest) {
    return api.post<ForgotPasswordResponse>("/auth/forgot-password", payload);
  },

  resetPassword(payload: ResetPasswordRequest) {
    return api.post<ResetPasswordResponse>("/auth/reset-password", payload);
  },

  refresh(payload: RefreshTokenRequest) {
    return api.post<AuthTokensResponse>("/auth/refresh", payload);
  },

  logout(refreshToken?: string) {
    return api.post<{ message: string }>(
      "/auth/logout",
      { refreshToken },
      { skipErrorToast: true },
    );
  },

  getMe() {
    return api.get<MeResponse>("/auth/me");
  },
};

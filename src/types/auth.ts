export type UserRole = "student" | "admin" | "super_admin";

export type AuthProvider = "local" | "google";

export type OtpPurpose = "signup" | "login" | "password_reset";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  authProvider: AuthProvider;
  googleId: string | null;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
  deviceFingerprint?: string;
  deviceName?: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type RegisterResponse = {
  message: string;
  user: User;
};

export type ResendOtpRequest = {
  email: string;
  purpose: OtpPurpose;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
  purpose: OtpPurpose;
  deviceFingerprint?: string;
  deviceName?: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type UnverifiedLoginResponse = {
  message: string;
  user: User;
};

export type LoginResponse = AuthTokensResponse | UnverifiedLoginResponse;

export type MeResponse = {
  user: User;
  purchasedCourses: Array<{
    enrollmentId: string;
    enrolledAt: string;
    course: {
      id: string;
      title: string;
      slug: string;
      thumbnailUrl: string | null;
    };
  }>;
  completedLessons: number;
};

export function isAuthTokensResponse(
  data: LoginResponse,
): data is AuthTokensResponse {
  return "accessToken" in data && "refreshToken" in data;
}

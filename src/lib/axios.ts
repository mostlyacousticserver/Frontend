import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import {
  clearSessionCookies,
  getAccessToken,
  getRefreshToken,
  persistSession,
} from "@/lib/cookies";
import type { ApiError } from "@/types/api";
import type { AuthTokensResponse } from "@/types/auth";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
  }
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify-otp",
  "/auth/resend-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
];

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipErrorToast?: boolean;
};

function isPublicAuthRequest(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    const message = data?.message;
    if (Array.isArray(message) && message.length > 0) {
      return message.join(", ");
    }
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
    if (error.message) return error.message;
  }

  return "Something went wrong. Please try again.";
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("Missing refresh token");
    }

    const { data } = await axios.post<AuthTokensResponse>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
    );
    persistSession(data);
    return data.accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;
  window.location.href = "/login";
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (isPublicAuthRequest(config.url)) {
    return config;
  }

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const skipToast = originalRequest?.skipErrorToast === true;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicAuthRequest(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        clearSessionCookies();
        if (!skipToast) {
          toast.error("Session expired. Please log in again.");
        }
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    if (!skipToast) {
      toast.error(getApiErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

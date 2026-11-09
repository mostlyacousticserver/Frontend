import { api } from "@/lib/axios";
import type {
  CheckoutResponse,
  CreateCheckoutRequest,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/types/payments";

export const PaymentsAPI = {
  checkout(payload: CreateCheckoutRequest) {
    return api.post<CheckoutResponse>("/payments/checkout", payload, {
      skipErrorToast: true,
    });
  },

  verify(payload: VerifyPaymentRequest) {
    return api.post<VerifyPaymentResponse>("/payments/verify", payload, {
      skipErrorToast: true,
    });
  },
};

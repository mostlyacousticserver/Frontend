export type CheckoutCourseSummary = {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
};

export type CheckoutPrefill = {
  name: string;
  email: string;
  contact?: string;
};

export type CheckoutEnrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  expiresAt: string | null;
  course?: {
    id: string;
    title: string;
    slug: string;
  };
};

export type CreateCheckoutRequest = {
  courseId: string;
};

export type CheckoutResponse = {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  amountInPaise: number;
  subtotal: number;
  currency: string;
  keyId: string;
  status: "pending";
  course: CheckoutCourseSummary;
  prefill: CheckoutPrefill;
};

export type VerifyPaymentRequest = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type VerifyPaymentResponse = {
  status: "paid";
  orderId: string;
  orderNumber: string;
  enrollments: CheckoutEnrollment[];
};

export type RazorpayCheckoutSuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  handler: (response: RazorpayCheckoutSuccess) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

export type RazorpayInstance = {
  open: () => void;
  close: () => void;
};

export type AdminDashboardStats = {
  usersTotal: number;
  usersActive: number;
  ordersTotal: number;
  ordersPaid: number;
  ordersRefunded: number;
  revenueAllTime: number;
  revenueThisMonth: number;
  enrollmentsTotal: number;
  coursesPublished: number;
  enquiriesTotal: number;
  enquiriesUnread: number;
  refundedAmount: number;
};

export type AdminUserStatusFilter = "active" | "disabled" | "all";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "student" | "admin" | "super_admin";
  authProvider: "local" | "google";
  googleId: string | null;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count?: { enrollments: number };
};

export type AdminUserEnrollment = {
  id: string;
  enrolledAt: string;
  expiresAt: string | null;
  certificateIssued: boolean;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    deleted: boolean;
  };
  order: {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    currency: string;
  };
};

export type AdminUserDetail = AdminUser & {
  stats: {
    enrollmentCount: number;
    orderCount: number;
    completedLessons: number;
  };
  enrollments: AdminUserEnrollment[];
};

export type ListAdminUsersQuery = {
  page?: number;
  limit?: number;
  q?: string;
  status?: AdminUserStatusFilter;
  isEmailVerified?: boolean;
  authProvider?: "local" | "google";
};

export type PaginatedAdminUsers = {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
};

export type AdminEnrollment = {
  id: string;
  enrolledAt: string;
  expiresAt: string | null;
  certificateIssued: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    deletedAt: string | null;
  };
  course: AdminUserEnrollment["course"];
  order: AdminUserEnrollment["order"];
};

export type ListAdminEnrollmentsQuery = {
  page?: number;
  limit?: number;
  q?: string;
  courseId?: string;
  userId?: string;
};

export type PaginatedAdminEnrollments = {
  items: AdminEnrollment[];
  total: number;
  page: number;
  limit: number;
};

export type AdminEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AdminEnquiryStatusFilter = "unread" | "read" | "all";

export type ListAdminEnquiriesQuery = {
  page?: number;
  limit?: number;
  q?: string;
  status?: AdminEnquiryStatusFilter;
};

export type PaginatedAdminEnquiries = {
  items: AdminEnquiry[];
  total: number;
  page: number;
  limit: number;
};

export type CreateEnquiryRequest = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export type CreateEnquiryResponse = {
  message: string;
  id: string;
};

export type SalesGroupBy = "day" | "week" | "month";

export type AdminAnalyticsOverviewPoint = {
  bucket: string;
  newUsers: number;
  paidOrders: number;
  revenue: number;
  enrollments: number;
};

export type AdminAnalyticsOverview = {
  from: string;
  to: string;
  series: AdminAnalyticsOverviewPoint[];
  totals: {
    newUsers: number;
    paidOrders: number;
    revenue: number;
    enrollments: number;
  };
};

export type AdminSalesReportPoint = {
  bucket: string;
  revenue: number;
  orderCount: number;
  refundedAmount: number;
};

export type AdminSalesReport = {
  from: string;
  to: string;
  groupBy: SalesGroupBy;
  series: AdminSalesReportPoint[];
  totals: {
    revenue: number;
    orderCount: number;
    refundedAmount: number;
  };
};

export type AdminTopCourseRow = {
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
  };
  revenue: number;
  orderCount: number;
};

export type AdminTopCoursesReport = {
  from: string;
  to: string;
  items: AdminTopCourseRow[];
};

export type AdminAnalyticsRangeQuery = {
  from: string;
  to: string;
};

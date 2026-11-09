import { api } from "@/lib/axios";
import type {
  AdminAnalyticsOverview,
  AdminAnalyticsRangeQuery,
  AdminDashboardStats,
  AdminSalesReport,
  AdminTopCoursesReport,
  ListAdminEnrollmentsQuery,
  PaginatedAdminEnrollments,
  SalesGroupBy,
} from "@/types/admin";

export const AdminAPI = {
  getDashboard() {
    return api.get<AdminDashboardStats>("/admin/dashboard");
  },

  listEnrollments(query: ListAdminEnrollmentsQuery = {}) {
    return api.get<PaginatedAdminEnrollments>("/admin/enrollments", {
      params: query,
    });
  },

  getAnalyticsOverview(query: AdminAnalyticsRangeQuery) {
    return api.get<AdminAnalyticsOverview>("/admin/analytics/overview", {
      params: query,
    });
  },

  getSalesReport(query: AdminAnalyticsRangeQuery & { groupBy?: SalesGroupBy }) {
    return api.get<AdminSalesReport>("/admin/reports/sales", {
      params: query,
    });
  },

  getTopCourses(query: AdminAnalyticsRangeQuery & { limit?: number }) {
    return api.get<AdminTopCoursesReport>("/admin/reports/top-courses", {
      params: query,
    });
  },
};

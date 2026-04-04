/**
 * API Configuration - Farm Management Admin Web
 * Centralized config for API endpoints and environment settings
 */

// ============================================================
// API BASE URLs
// ============================================================

/**
 * Django Backend API Base URL
 * Hard-coded to production backend for deployment
 */
export const API_BASE_URL = "http://127.0.0.1:8000/api"; // Backend Django remote

export const GOOGLE_CLIENT_ID =
  "211407744910-3h79kbm17jrqs4eu6brb7lvvs15acf5i.apps.googleusercontent.com";
export const GOOGLE_IDENTITY_SRC = "https://accounts.google.com/gsi/client";

/**
 * Media/Upload Base URL (for images, PDFs, etc.)
 */

export const API_ENDPOINTS = {
  AUTH: {
    FARMER_LOGIN: "/farmers/login/",
    FARMER_REGISTER: "/farmers/register/",
    ADMIN_LOGIN: "/admins/login/",
    ADMIN_REGISTER: "/admins/register/",
    SYSADMIN_LOGIN: "/sysadmins/login/",
    SYSADMIN_REGISTER: "/sysadmins/register/",
  },
  FARM_LOGS: "/farm-logs/",
  INCIDENT_REPORTS: "/incident-reports/",
  VIETGAP_REGISTRATIONS: "/vietgap-registrations/",
  FARMERS: "/farmers/",
  ADMINS: "/admins/",
  PLANTING_ZONES: "/planting-zones/",
  STAGES: "/stages/",
  LOTS: "/lots/",
  TASKS: "/tasks/",
  TASK_CATEGORIES: "/task-categories/",
  MATERIALS: "/materials/",

  // Legacy / other app endpoints
  LOGIN: "/auth/login/",
  LOGOUT: "/auth/logout/",
  REFRESH_TOKEN: "/token/refresh/",
  PROFILE: "/auth/profile/",
  ORDERS: "/orders/",
  ORDER_DETAIL: (id: number) => `/orders/${id}/`,

  EMPLOYEES: "/employees/",
  EMPLOYEE_DETAIL: (id: number) => `/employees/${id}/`,
  STATIONS: "/stations/",
  STATION_DETAIL: (id: number) => `/stations/${id}/`,
  VEHICLE_TYPES: "/vehicle-types/",
  VEHICLE_TYPE_DETAIL: (id: number) => `/vehicle-types/${id}/`,
  VEHICLES: "/vehicles/",
  VEHICLE_DETAIL: (id: number) => `/vehicles/${id}/`,
  USERS: "/users/",
  USER_DETAIL: (id: number) => `/users/${id}/`,
  ROLES: "/roles/",
  ROLE_DETAIL: (id: number) => `/roles/${id}/`,
  PERMISSIONS: "/permissions/",
  PERMISSION_DETAIL: (id: number) => `/permissions/${id}/`,
  PRICING: "/pricing/",
  PRICING_DETAIL: (id: number) => `/pricing/${id}/`,
  PAYMENTS: "/payments/",
  PAYMENT_DETAIL: (id: number) => `/payments/${id}/`,
  RATINGS: "/ratings/",
  RATING_DETAIL: (id: number) => `/ratings/${id}/`,
  NOTIFICATIONS: "/notifications/",
  NOTIFICATION_DETAIL: (id: number) => `/notifications/${id}/`,
  SYSTEM_SETTINGS: "/system-settings/",
  SYSTEM_SETTING_DETAIL: (id: number) => `/system-settings/${id}/`,
  CHAT_MESSAGES: "/chat-messages/",
  CHAT_MESSAGE_DETAIL: (id: number) => `/chat-messages/${id}/`,
  CHECKLIST_ITEMS: "/checklist-items/",
  CHECKLIST_ITEM_DETAIL: (id: number) => `/checklist-items/${id}/`,
  ORDER_CHECKLISTS: "/order-checklists/",
  ORDER_CHECKLIST_DETAIL: (id: number) => `/order-checklists/${id}/`,
  ORDER_STATUS_HISTORY: "/order-status-history/",
  ORDER_STATUS_HISTORY_DETAIL: (id: number) => `/order-status-history/${id}/`,
};
export const MEDIA_BASE_URL = "http://127.0.0.1:8000";

/**
 * Get full URL for media files (PDF, images)
 * @param path - Media file path from API (e.g., "/media/legal_documents/abc.pdf")
 * @returns Full URL with backend base URL
 */
export function getMediaUrl(path: string): string {
  if (!path) return "";
  // If path already has http/https, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // Otherwise, prepend backend URL
  return `${MEDIA_BASE_URL}${path}`;
}

// ============================================================
// STORAGE KEYS
// ============================================================

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "adminToken",
  REFRESH_TOKEN: "adminRefreshToken",
  USER_DATA: "adminUser",
  AUTH_FLAG: "adminAuth",
};

// ============================================================
// REQUEST CONFIGURATION
// ============================================================

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Token refresh buffer time (seconds before actual expiry)
 * Increased from 60 to 300 seconds (5 minutes) for better UX
 */
export const TOKEN_REFRESH_BUFFER = 300; // 5 minutes before expiry

// ============================================================
// DEBUG CONFIGURATION
// ============================================================

/**
 * Enable debug mode (console logs)
 */
export const DEBUG = true;

/**
 * Enable verbose API logging
 */
export const VERBOSE_API_LOGS = true; // Set to false to disable detailed logs

// ============================================================
// DEFAULT VALUES
// ============================================================

export const DEFAULT_VALUES = {
  COMPANY_NAME: "Farm Management System",
  TAX_CODE: "00000000",
  ADDRESS: "",
  EMAIL: "support@example.com",
  HOTLINE: "",
  WORKING_HOURS: "",
};

// ============================================================
// PAGINATION DEFAULTS
// ============================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// ============================================================
// API ENDPOINTS (for reference) is already declared above with AUTH and farm endpoints.
// ============================================================

// ============================================================
// EXPORT ALL
// ============================================================

export default {
  API_BASE_URL,
  MEDIA_BASE_URL,
  STORAGE_KEYS,
  REQUEST_TIMEOUT,
  TOKEN_REFRESH_BUFFER,
  DEBUG,
  VERBOSE_API_LOGS,
  DEFAULT_VALUES,
  PAGINATION,
  API_ENDPOINTS,
  getMediaUrl,
};

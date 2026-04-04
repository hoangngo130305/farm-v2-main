import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
  useParams,
} from "react-router-dom";
import {
  Plus,
  ArrowLeft,
  Save,
  Calendar,
  MapPin,
  User,
  Activity,
  Bug,
  Droplet,
  Beaker,
  Clock,
  ShieldAlert,
  Droplets,
  Scissors,
  Leaf,
  CloudRain,
  Sprout,
  FlaskConical,
  BugOff,
  SprayCan,
  TreePine,
  Image as ImageIcon,
  X,
  LogOut,
  Lock,
  Phone,
  Trash2,
  Recycle,
  Package,
  ScanLine,
  Loader2,
  Home,
  ClipboardList,
  AlertTriangle,
  Settings,
  ShieldCheck,
  Warehouse,
  HardHat,
  Camera,
  Mail,
  Building,
  Upload,
  CheckCircle,
  FileText,
  Map as MapIcon,
  Printer,
  AlertCircle,
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { authAPI, farmAPI, adminAPI } from "./lib/api";
import { GOOGLE_CLIENT_ID, GOOGLE_IDENTITY_SRC } from "./lib/config";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { QRCodeSVG as QRCode } from "qrcode.react";

declare global {
  interface Window {
    google?: any;
    __googleIdentityInitialized?: boolean;
    __googleIdentityHandler?: ((response: any) => void) | null;
  }
}

const loadGoogleIdentityScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts?.id) {
      return resolve();
    }

    const existing = document.querySelector(
      `script[src="${GOOGLE_IDENTITY_SRC}"]`,
    ) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).google?.accounts?.id) {
        return resolve();
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Không thể load Google Identity Services")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Không thể load Google Identity Services"));
    document.head.appendChild(script);
  });
};

const decodeJwt = (token: string): any => {
  try {
    const base64Url = token.split(".")[1] || "";
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
};

const ensureGoogleIdentityInitialized = (
  context: "signin" | "signup" = "signin",
) => {
  const google = (window as any).google;
  if (!google?.accounts?.id || (window as any).__googleIdentityInitialized) {
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response: any) => {
      const handler = (window as any).__googleIdentityHandler;
      if (typeof handler === "function") {
        handler(response);
      }
    },
    ux_mode: "popup",
    auto_select: false,
    context,
    cancel_on_tap_outside: true,
    use_fedcm_for_prompt: true,
    itp_support: true,
  });

  (window as any).__googleIdentityInitialized = true;
};

const setGoogleIdentityHandler = (
  handler: ((response: any) => void) | null,
) => {
  (window as any).__googleIdentityHandler = handler;
};

// Types
interface IncidentReport {
  id: string;
  executor: string;
  lot: string;
  datetime: string;
  reportType: string;
  description: string;
  images: string[];
}

interface Farm {
  id: string;
  admin: string;
  adminName: string;
  cooperativeName: string;
  address: string;
  totalArea: number;
  mainCropType: string;
  createdAt: string;
  updatedAt: string;
}

interface PendingAdminRegistration {
  email: string;
  password: string;
  googleId?: string;
}

interface FarmLog {
  id: string;
  executor: string;
  stage: string;
  lot: string;
  datetime: string;
  task: string;
  pest: string;
  method: string;
  fertilizer: string;
  activeIngredient: string;
  dosage: string;
  quarantineTime: string;
  images?: string[];
  wasteType?: string;
  materialName?: string;
  materialQuantity?: string;
}

const USERS = [
  { phone: "0987654321", pin: "1234", name: "Nguyễn Văn A" },
  { phone: "0123456789", pin: "1234", name: "Trần Thị B" },
  { phone: "0999999999", pin: "0000", name: "Quản trị viên" },
];

function mapApiFarmer(farmer: any): Farmer {
  return {
    id: String(farmer.id),
    admin: String(farmer.admin),
    adminName: farmer.admin_name || farmer.adminName || "",
    phone: farmer.phone || "",
    pin: farmer.pin || "",
    cccd: farmer.cccd || "",
    fullName: farmer.full_name || farmer.fullName || "",
    birthYear: farmer.birth_year || farmer.birthYear || "",
    managedLot: farmer.managed_lot || farmer.managedLot || "",
  };
}

function mapApiFarm(farm: any): Farm {
  return {
    id: String(farm.id),
    admin: String(farm.admin),
    adminName: farm.admin_name || farm.adminName || "",
    cooperativeName: farm.cooperative_name || farm.cooperativeName || "",
    address: farm.address || "",
    totalArea: Number(farm.total_area || 0),
    mainCropType: farm.main_crop_type || farm.mainCropType || "",
    createdAt: farm.created_at || farm.createdAt || "",
    updatedAt: farm.updated_at || farm.updatedAt || "",
  };
}

function parseCoordinatesToLatLngs(coordinatesStr: string): [number, number][] {
  if (!coordinatesStr || typeof coordinatesStr !== "string") return [];
  try {
    return coordinatesStr
      .split(" ")
      .map((coord) => {
        const [lat, lng] = coord.split(",").map((n) => parseFloat(n.trim()));
        return [lat, lng] as [number, number];
      })
      .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
  } catch (error) {
    console.warn("Error parsing coordinates:", coordinatesStr, error);
    return [];
  }
}

function mapApiZone(zone: any): PlantingZone {
  return {
    id: String(zone.id),
    cropType: zone.crop_type || zone.cropType || "",
    name: zone.name || zone.title || "",
    lots: Array.isArray(zone.lots)
      ? zone.lots.map((lot: any, index: number) => ({
          id: String(lot.id ?? `${lot.name ?? "lot"}-${index}`),
          name: lot.name || String(lot.id || `Lô ${index + 1}`),
          area: Number(lot.area || 0),
          coordinates: lot.coordinates || "",
          center: lot.center || { x: 0, y: 0 },
          latLngs:
            lot.latLngs ||
            (lot.coordinates
              ? parseCoordinatesToLatLngs(lot.coordinates)
              : undefined),
          plants: lot.plants || undefined,
        }))
      : [],
    certificateFiles: Array.isArray(zone.certificate_files)
      ? zone.certificate_files
      : Array.isArray(zone.certificateFiles)
        ? zone.certificateFiles
        : [],
  };
}

function mapApiMaterial(material: any): Material {
  return {
    id: String(material.id),
    name: material.name || "",
    type: material.type || "Khác",
    activeIngredient:
      material.active_ingredient || material.activeIngredient || "",
    isVietGAP: Boolean(material.is_vietgap ?? material.isVietGAP),
    unit: material.unit || "",
    quantity: Number(material.quantity || 0),
  };
}

function mapApiLog(
  log: any,
  stageOptions: StageOption[] = [],
  lotOptions: LotOption[] = [],
  tasksConfig: TaskConfig[] = [],
): FarmLog {
  const stageId = log.stage ? String(log.stage) : "";
  const lotId = log.lot ? String(log.lot) : "";
  const taskId = log.task ? String(log.task) : "";
  const mappedStage =
    log.stage_name ||
    stageOptions.find((stage) => String(stage.id) === stageId)?.name ||
    log.stage ||
    "";
  const mappedLot =
    log.lot_name ||
    lotOptions.find((lot) => String(lot.id) === lotId)?.name ||
    log.lot ||
    "";
  const mappedTask =
    log.task_name ||
    tasksConfig.find((task) => String(task.id) === taskId)?.defaultValues
      .task ||
    tasksConfig.find((task) => task.name === log.task)?.name ||
    log.task ||
    "";

  return {
    id: String(log.id),
    executor: log.farmer_name || log.executor || "",
    stage: mappedStage,
    lot: mappedLot,
    datetime: log.datetime || "",
    task: mappedTask,
    pest: log.pest || "",
    method: log.method || "",
    fertilizer: log.fertilizer || "",
    activeIngredient: log.active_ingredient || log.activeIngredient || "",
    dosage: log.dosage || "",
    quarantineTime: log.quarantine_time || log.quarantineTime || "",
    images: Array.isArray(log.images) ? log.images : [],
    wasteType: log.waste_type || log.wasteType || "",
    materialName: log.material_name || log.materialName || "",
    materialQuantity: log.material_quantity || log.materialQuantity || "",
  };
}

function mapApiIncidentReport(report: any): IncidentReport {
  return {
    id: String(report.id),
    executor: report.farmer_name || "",
    lot: report.lot_name || report.lot || "",
    datetime: report.datetime || "",
    reportType: report.report_type || report.reportType || "",
    description: report.description || "",
    images: Array.isArray(report.images) ? report.images : [],
  };
}

interface TaskCategory {
  id: string;
  name: string;
  taskIds: string[];
}

interface StageOption {
  id: string;
  name: string;
}

interface LotOption {
  id: string;
  name: string;
}

interface TaskConfig {
  id: string;
  name: string;
  icon: any;
  iconName?: string;
  color: string;
  requiresMaterials: boolean;
  defaultValues: {
    task: string;
    pest?: string;
    method?: string;
    fertilizer?: string;
    activeIngredient?: string;
    dosage?: string;
    quarantineTime?: string;
    wasteType?: string;
  };
}

import { Breadcrumb } from "./components/Breadcrumb";
import { SysAdminLoginScreen, SysAdminApp } from "./SysAdmin";

const TASK_ICON_MAP: Record<string, any> = {
  Droplets,
  Scissors,
  Leaf,
  CloudRain,
  Sprout,
  FlaskConical,
  BugOff,
  SprayCan,
  TreePine,
  Trash2,
  Package,
  Warehouse,
  HardHat,
};

function resolveTaskIcon(iconName?: string, icon?: any) {
  if (typeof icon === "function") return icon;
  if (iconName && TASK_ICON_MAP[iconName]) return TASK_ICON_MAP[iconName];
  if (typeof icon === "string" && TASK_ICON_MAP[icon])
    return TASK_ICON_MAP[icon];
  return Leaf;
}

function normalizeTaskConfig(task: any): TaskConfig {
  const iconName =
    task.iconName ||
    (typeof task.icon === "function"
      ? task.icon.name
      : typeof task.icon === "string"
        ? task.icon
        : undefined) ||
    task.icon ||
    "Leaf";
  const defaultValues = {
    ...(task.defaultValues || task.default_values || {}),
    task: (
      task.defaultValues?.task ||
      task.default_values?.task ||
      task.name ||
      task.task ||
      ""
    ).trim(),
  };

  return {
    id: String(task.id),
    name: task.name || task.title || task.label || "",
    icon: resolveTaskIcon(iconName, task.icon),
    iconName,
    color: task.color || task.colorHex || "bg-emerald-100 text-emerald-700",
    requiresMaterials: Boolean(
      task.requiresMaterials ?? task.requires_materials ?? false,
    ),
    defaultValues,
  };
}

// ============================================================
// HELPER FUNCTIONS - currentUser persistence
// ============================================================

const CURRENT_USER_STORAGE_KEY = "currentUser_farm_management";

const saveCurrentUserToStorage = (user: any) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      console.log("✅ [AUTH] Saved currentUser to localStorage:", user);
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      console.log("✅ [AUTH] Cleared currentUser from localStorage");
    }
  } catch (error) {
    console.error("❌ [AUTH] Failed to save currentUser:", error);
  }
};

const loadCurrentUserFromStorage = (): any => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      console.log("✅ [AUTH] Restored currentUser from localStorage:", user);
      return user;
    }
  } catch (error) {
    console.error("❌ [AUTH] Failed to load currentUser:", error);
  }
  return null;
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUserState] = useState<{
    id?: string | number;
    phone?: string;
    email?: string;
    name: string;
    role?: string;
    admin_id?: string | number;
  } | null>(() => {
    // Try to restore currentUser from localStorage on mount
    return loadCurrentUserFromStorage();
  });

  // Wrapper around setCurrentUser that also saves to localStorage
  const setCurrentUser = (user: any) => {
    setCurrentUserState(user);
    saveCurrentUserToStorage(user);
  };
  const [pendingAdminRegistration, setPendingAdminRegistration] =
    useState<PendingAdminRegistration | null>(null);
  const [activeTab, setActiveTab] = useState<"diary" | "report" | "settings">(
    "diary",
  );
  const [view, setView] = useState<"list" | "add">("list");
  const [selectedTaskConfig, setSelectedTaskConfig] =
    useState<TaskConfig | null>(null);
  const [tasksConfig, setTasksConfig] = useState<TaskConfig[]>(() => {
    const saved = window.localStorage.getItem("tasksConfig");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeTaskConfig);
    } catch {
      return [];
    }
  });
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>(() => {
    const saved = window.localStorage.getItem("taskCategories");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((category: any) => ({
        id: String(category.id),
        name: category.name || category.title || "Danh mục",
        taskIds: Array.isArray(category.taskIds)
          ? category.taskIds.map(String)
          : Array.isArray(category.task_ids)
            ? category.task_ids.map(String)
            : [],
      }));
    } catch {
      return [];
    }
  });
  const tasksList = Array.from(
    new Set(tasksConfig.map((t) => t.defaultValues.task)),
  );

  useEffect(() => {
    const serializableTasks = tasksConfig.map((task) => ({
      ...task,
      icon: undefined,
      iconName:
        task.iconName ||
        (typeof task.icon === "function"
          ? task.icon.name
          : typeof task.icon === "string"
            ? task.icon
            : "Leaf"),
    }));
    window.localStorage.setItem(
      "tasksConfig",
      JSON.stringify(serializableTasks),
    );
  }, [tasksConfig]);

  useEffect(() => {
    window.localStorage.setItem(
      "taskCategories",
      JSON.stringify(taskCategories),
    );
  }, [taskCategories]);

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [zones, setZones] = useState<PlantingZone[]>([]);
  const [logs, setLogs] = useState<FarmLog[]>([]);
  const [farm, setFarm] = useState<Farm | null>(null);

  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [lots, setLots] = useState<string[]>([]);
  const [stageOptions, setStageOptions] = useState<StageOption[]>([]);
  const [lotOptions, setLotOptions] = useState<LotOption[]>([]);

  // ============================================================
  // Effect: Protect /admin routes - redirect if not authenticated
  // ============================================================
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");
    const isAuthenticated = currentUser?.id && currentUser?.role === "admin";

    if (isAdminRoute && !isAuthenticated) {
      console.warn(
        "❌ [AUTH] Unauthenticated access to admin route, redirecting to login:",
        location.pathname,
      );
      navigate("/htx_login", { replace: true });
    }
  }, [location.pathname, currentUser?.id, currentUser?.role, navigate]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Load farmers - filter by admin for admin users
        if (currentUser?.id && currentUser?.role === "admin") {
          const apiFarmers = await farmAPI.getFarmers(String(currentUser.id));
          if (Array.isArray(apiFarmers)) {
            setFarmers(apiFarmers.length ? apiFarmers.map(mapApiFarmer) : []);
          } else {
            setFarmers([]);
          }
        } else {
          const apiFarmers = await farmAPI.getFarmers();
          if (Array.isArray(apiFarmers)) {
            setFarmers(apiFarmers.length ? apiFarmers.map(mapApiFarmer) : []);
          } else {
            setFarmers([]);
          }
        }
      } catch (error) {
        console.warn("Không thể tải nông dân từ backend:", error);
        setFarmers([]);
      }

      try {
        // Only load zones for the current admin user
        if (currentUser?.id && currentUser?.role === "admin") {
          const apiZones = await farmAPI.getPlantingZones(
            String(currentUser.id),
          );
          if (Array.isArray(apiZones)) {
            // Additional frontend filtering for safety - ensure only current admin's zones
            const filteredZones = apiZones.filter(
              (zone: any) =>
                !zone.admin || String(zone.admin) === String(currentUser.id),
            );
            setZones(filteredZones.length ? filteredZones.map(mapApiZone) : []);
          } else {
            setZones([]);
          }
        } else {
          setZones([]);
        }
      } catch (error) {
        console.warn("Không thể tải vùng trồng từ backend:", error);
        setZones([]);
      }

      try {
        // Load materials - filter by admin for admin users
        if (currentUser?.id && currentUser?.role === "admin") {
          const apiMaterials = await farmAPI.getMaterials(
            String(currentUser.id),
          );
          if (Array.isArray(apiMaterials)) {
            setMaterials(
              apiMaterials.length ? apiMaterials.map(mapApiMaterial) : [],
            );
          } else {
            setMaterials([]);
          }
        } else {
          const apiMaterials = await farmAPI.getMaterials();
          if (Array.isArray(apiMaterials)) {
            setMaterials(
              apiMaterials.length ? apiMaterials.map(mapApiMaterial) : [],
            );
          } else {
            setMaterials([]);
          }
        }
      } catch (error) {
        console.warn("Không thể tải vật tư từ backend:", error);
        setMaterials([]);
      }

      try {
        // Load tasks filtered by admin_id (HTX)
        let adminId: string | undefined;
        if (currentUser?.role === "admin") {
          // Admin: use their own id
          adminId = String(currentUser.id);
        } else if (currentUser?.admin_id && !currentUser?.role) {
          // Farmer: use their HTX's admin_id
          adminId = String(currentUser.admin_id);
        }
        
        const apiTasks = await farmAPI.getTasks(adminId);
        if (Array.isArray(apiTasks)) {
          setTasksConfig(apiTasks.map(normalizeTaskConfig));
        }
      } catch (error) {
        console.warn("Không thể tải công việc từ backend:", error);
      }

      try {
        // Load task categories - filter by admin_id (HTX)
        let categoryLoader: Promise<any[]>;
        
        if (currentUser?.role === "admin") {
          // Admin: filtered by their own admin_id
          categoryLoader = farmAPI.getTaskCategories(undefined, String(currentUser.id));
        } else if (currentUser?.admin_id && !currentUser?.role) {
          // Farmer: pass both farmer_id (access control) and admin_id (filtering)
          categoryLoader = farmAPI.getTaskCategories(
            String(currentUser.id),
            String(currentUser.admin_id)
          );
        } else {
          categoryLoader = Promise.resolve([]);
        }
        
        const apiTaskCategories = await categoryLoader;
        if (Array.isArray(apiTaskCategories)) {
          setTaskCategories(
            apiTaskCategories.map((category: any) => ({
              id: String(category.id),
              name: category.name || category.title || "Danh mục",
              taskIds: Array.isArray(category.task_ids)
                ? category.task_ids.map(String)
                : Array.isArray(category.taskIds)
                  ? category.taskIds.map(String)
                  : [],
            })),
          );
        }
      } catch (error) {
        console.warn("Không thể tải danh mục công việc từ backend:", error);
      }

      try {
        const apiStages = await farmAPI.getStages();
        if (Array.isArray(apiStages)) {
          const options = apiStages.map((stage: any) => ({
            id: String(stage.id),
            name: stage.name || String(stage.id),
          }));
          setStageOptions(options);
          setStages(options.map((stage) => stage.name));
        }
      } catch (error) {
        console.warn("Không thể tải giai đoạn từ backend:", error);
      }

      try {
        const apiLots = await farmAPI.getLots();
        if (Array.isArray(apiLots)) {
          const options = apiLots.map((lot: any) => ({
            id: String(lot.id),
            name: lot.name || String(lot.id),
          }));
          setLotOptions(options);
          setLots(options.map((lot) => lot.name));
        }
      } catch (error) {
        console.warn("Không thể tải lô đất từ backend:", error);
      }

      try {
        // Load farm logs - filter by admin for admin users, or by farmer for farmers
        let apiLogs: any[] = [];
        if (currentUser?.id && currentUser?.role === "admin") {
          // Admin: load logs of their farmers
          apiLogs = await farmAPI.getFarmLogs(String(currentUser.id));
        } else if (currentUser?.id && !currentUser?.role) {
          // Farmer: load their own logs
          apiLogs = await farmAPI.getFarmLogs(undefined, String(currentUser.id));
        }
        
        if (Array.isArray(apiLogs)) {
          setLogs(
            apiLogs.length
              ? apiLogs.map((log) =>
                  mapApiLog(log, stageOptions, lotOptions, tasksConfig),
                )
              : [],
          );
        } else {
          setLogs([]);
        }
      } catch (error) {
        console.warn("Không thể tải nhật ký từ backend:", error);
        setLogs([]);
      }

      try {
        // Load incident reports - filter by admin for admin users
        if (currentUser?.id && currentUser?.role === "admin") {
          const apiIncidentReports = await farmAPI.getIncidentReports(
            String(currentUser.id),
          );
          if (Array.isArray(apiIncidentReports)) {
            setIncidentReports(
              apiIncidentReports.length
                ? apiIncidentReports.map(mapApiIncidentReport)
                : [],
            );
          } else {
            setIncidentReports([]);
          }
        } else {
          const apiIncidentReports = await farmAPI.getIncidentReports();
          if (Array.isArray(apiIncidentReports)) {
            setIncidentReports(
              apiIncidentReports.length
                ? apiIncidentReports.map(mapApiIncidentReport)
                : [],
            );
          } else {
            setIncidentReports([]);
          }
        }
      } catch (error) {
        console.warn("Không thể tải báo cáo sự cố từ backend:", error);
        setIncidentReports([]);
      }

      // Fetch farm data if user is admin
      if (currentUser?.id && currentUser?.role === "admin") {
        try {
          const apiFarm = await farmAPI.getFarmByAdmin(String(currentUser.id));
          if (apiFarm) {
            setFarm(mapApiFarm(apiFarm));
          }
        } catch (error: any) {
          // Check if it's a "Farm not found" error (404) - this is expected for new admin accounts
          if (
            error.message?.includes("Farm not found") ||
            error.message?.includes("404")
          ) {
            console.log(
              "Admin account chưa có thông tin trang trại - cần tạo mới",
            );
            setFarm(null); // Explicitly set to null for new accounts
          } else {
            console.warn(
              "Không thể tải thông tin trang trại từ backend:",
              error,
            );
          }
        }
      }
    };

    fetchInitialData();
  }, [currentUser?.id, currentUser?.role]);

  const handleAddLog = (log: FarmLog) => {
    setLogs((prevLogs) => [log, ...prevLogs]);
    setView("list");
  };

  const handleSelectTask = (taskConfig: TaskConfig | null) => {
    setSelectedTaskConfig(taskConfig);
    setView("add");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingScreen
            onLoginClick={() => navigate("/login")}
            onRegisterClick={() => navigate("/register")}
            onHTXLoginClick={() => navigate("/htx_login")}
            onSysAdminLoginClick={() => navigate("/sysadmin_login")}
          />
        }
      />
      <Route
        path="/htx_login"
        element={
          <HTXLoginScreen
            onBack={() => navigate("/")}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              navigate("/admin");
            }}
          />
        }
      />
      <Route
        path="/sysadmin_login"
        element={
          <SysAdminLoginScreen
            onBack={() => navigate("/")}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              navigate("/sysadmin");
            }}
          />
        }
      />
      <Route
        path="/sysadmin/*"
        element={
          currentUser ? (
            <SysAdminApp
              currentUser={currentUser}
              onLogout={() => {
                setCurrentUser(null);
                navigate("/");
              }}
            />
          ) : (
            <Navigate to="/sysadmin_login" replace />
          )
        }
      />
      <Route
        path="/register"
        element={
          <RegisterScreen
            onBack={() => navigate("/")}
            onRegisterSuccess={(pending) => {
              setPendingAdminRegistration(pending);
              navigate("/onboard");
            }}
            onLoginClick={() => navigate("/login")}
          />
        }
      />
      <Route
        path="/onboard"
        element={
          <OnboardHTXScreen
            pendingRegistration={pendingAdminRegistration}
            onComplete={async (admin) => {
              if (admin) {
                setCurrentUser({
                  id: admin.id,
                  phone: admin.phone,
                  email: admin.google_email || undefined,
                  name: admin.name || admin.phone || "HTX",
                  role: "admin",
                });
              }
              setPendingAdminRegistration(null);
              navigate("/admin");
            }}
          />
        }
      />
      <Route
        path="/admin"
        element={
          <AdminDashboardScreen
            currentUser={currentUser ?? { name: "HTX" }}
            onLogout={() => {
              setCurrentUser(null);
              navigate("/");
            }}
            onNavigate={(screen) => {
              const routes: Record<string, string> = {
                admin_land: "/admin/land",
                admin_farmer: "/admin/farmer",
                admin_report: "/admin/report",
                admin_material: "/admin/material",
                admin_process: "/admin/process",
                admin_farm: "/admin/farm",
              };
              navigate(routes[screen] || "/");
            }}
            farmers={farmers}
            zones={zones}
            logs={logs}
            farm={farm}
          />
        }
      />
      <Route
        path="/admin/land"
        element={
          <LandManagementScreen
            onBack={() => navigate("/admin")}
            zones={zones}
            setZones={setZones}
            farmers={farmers}
            currentUser={currentUser}
          />
        }
      />
      <Route
        path="/admin/farmer"
        element={
          <FarmerManagementScreen
            onBack={() => navigate("/admin")}
            farmers={farmers}
            setFarmers={setFarmers}
            zones={zones}
            currentUser={currentUser}
          />
        }
      />
      <Route
        path="/admin/report"
        element={
          <ReportManagementScreen
            onBack={() => navigate("/admin")}
            logs={logs}
            incidentReports={incidentReports}
          />
        }
      />
      <Route
        path="/admin/report/log/:id"
        element={
          <LogDetailScreen
            onBack={() => navigate("/admin/report")}
            logs={logs}
          />
        }
      />
      <Route
        path="/admin/report/incident/:id"
        element={
          <IncidentDetailScreen
            onBack={() => navigate("/admin/report")}
            incidentReports={incidentReports}
          />
        }
      />
      <Route
        path="/admin/material"
        element={
          <MaterialManagementScreen
            onBack={() => navigate("/admin")}
            materials={materials}
            setMaterials={setMaterials}
          />
        }
      />
      <Route
        path="/admin/farm"
        element={
          <FarmInformationScreen
            onBack={() => navigate("/admin")}
            farm={farm}
            setFarm={setFarm}
            currentUser={currentUser}
          />
        }
      />
      <Route
        path="/admin/process"
        element={
          <ProcessManagementScreen
            onBack={() => navigate("/admin")}
            tasksConfig={tasksConfig}
            setTasksConfig={setTasksConfig}
            taskCategories={taskCategories}
            setTaskCategories={setTaskCategories}
            currentUser={currentUser}
          />
        }
      />
      <Route
        path="/login"
        element={
          <LoginScreen
            onLogin={(user) => {
              setCurrentUser(user);
              navigate("/app");
            }}
            onBack={() => navigate("/")}
          />
        }
      />
      <Route
        path="/app"
        element={
          currentUser ? (
            <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
              {/* Header */}
              <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeTab === "diary" && view === "add" && (
                    <button
                      onClick={() => setView("list")}
                      className="p-1 -ml-1 hover:bg-emerald-700 rounded-full"
                    >
                      <ArrowLeft size={24} />
                    </button>
                  )}
                  <h1 className="text-xl font-bold">
                    {activeTab === "diary"
                      ? "Nhật Ký Canh Tác"
                      : activeTab === "report"
                        ? "Báo Cáo Sự Cố"
                        : "Cài Đặt"}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium bg-emerald-700 px-3 py-1 rounded-full">
                    {currentUser?.name}
                  </span>
                </div>
              </header>

              {/* Main Content */}
              <main className="p-4 max-w-md mx-auto pb-24">
                {activeTab === "diary" &&
                  (view === "list" ? (
                    <>
                      <div className="mb-6">
                        <TaskGrid
                          onSelectTask={handleSelectTask}
                          tasksConfig={tasksConfig}
                          taskCategories={taskCategories}
                        />
                      </div>

                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                          Nhật ký gần đây
                        </h2>
                      </div>
                      <LogList logs={logs} />
                    </>
                  ) : (
                    <AddLogForm
                      initialData={selectedTaskConfig}
                      currentUser={currentUser}
                      onSave={handleAddLog}
                      onCancel={() => setView("list")}
                      tasksConfig={tasksConfig}
                      tasksList={tasksList}
                      stageOptions={stageOptions}
                      lotOptions={lotOptions}
                    />
                  ))}
                {activeTab === "report" && currentUser && (
                  <ReportScreen
                    currentUser={currentUser}
                    lotOptions={lotOptions}
                    onAddReport={(report) =>
                      setIncidentReports((prev) => [report, ...prev])
                    }
                  />
                )}
                {activeTab === "settings" && (
                  <SettingsScreen
                    currentUser={currentUser}
                    onLogout={() => {
                      setCurrentUser(null);
                      navigate("/");
                    }}
                  />
                )}
              </main>

              {/* FAB for Add */}
              {activeTab === "diary" && view === "list" && (
                <button
                  onClick={() => handleSelectTask(null)}
                  className="fixed bottom-20 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-full shadow-lg hover:bg-emerald-700 active:scale-95 transition-transform flex items-center gap-2 font-medium z-20"
                >
                  <Plus size={24} />
                  Thêm nhật ký
                </button>
              )}

              {/* Bottom Tab Bar */}
              <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center pb-safe z-30">
                <button
                  onClick={() => {
                    setActiveTab("diary");
                    setView("list");
                  }}
                  className={`flex flex-col items-center py-3 px-6 gap-1 ${activeTab === "diary" ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <ClipboardList size={24} />
                  <span className="text-xs font-medium">Nhật ký</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("report");
                    setView("list");
                  }}
                  className={`flex flex-col items-center py-3 px-6 gap-1 ${activeTab === "report" ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <AlertTriangle size={24} />
                  <span className="text-xs font-medium">Sự cố</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setView("list");
                  }}
                  className={`flex flex-col items-center py-3 px-6 gap-1 ${activeTab === "settings" ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <Settings size={24} />
                  <span className="text-xs font-medium">Cài đặt</span>
                </button>
              </nav>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

function LoginScreen({
  onLogin,
  onBack,
}: {
  onLogin: (user: {
    id?: string | number;
    phone: string;
    name: string;
    admin_id?: string | number;
  }) => void;
  onBack: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const farmer = await authAPI.farmerLogin(phone, pin);
      onLogin({
        id: farmer.id,
        phone: farmer.phone || phone,
        name: farmer.full_name || farmer.fullName || "Nông dân",
        admin_id: farmer.admin,
      });
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium hidden sm:inline">Quay lại</span>
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Sprout size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Open Farm
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Đăng nhập để ghi nhật ký canh tác
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập mã PIN 4 số"
                maxLength={4}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors mt-6"
          >
            Đăng nhập
          </button>
        </form>

        {/* <div className="mt-6 text-xs text-center text-gray-400">
          <p>Tài khoản dùng thử:</p>
          <p>0987654321 / 1234</p>
        </div> */}
      </div>
    </div>
  );
}

function TaskGrid({
  onSelectTask,
  tasksConfig,
  taskCategories,
}: {
  onSelectTask: (task: TaskConfig | null) => void;
  tasksConfig: TaskConfig[];
  taskCategories: TaskCategory[];
}) {
  return (
    <div className="space-y-5">
      {taskCategories.map((category) => (
        <div key={category.id}>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            {category.name}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {category.taskIds.map((taskId) => {
              const task = tasksConfig.find((t) => t.id === taskId);
              if (!task) return null;
              const Icon = task.icon;
              return (
                <button
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="flex flex-col items-center justify-start gap-2 p-2 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  <div className={`p-3 rounded-full ${task.color}`}>
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] sm:text-xs text-center font-medium leading-tight text-gray-700">
                    {task.name}
                  </span>
                </button>
              );
            })}
            {category.id === "quan_ly" && (
              <button
                onClick={() => onSelectTask(null)}
                className="flex flex-col items-center justify-start gap-2 p-2 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                  <Plus size={24} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] sm:text-xs text-center font-medium leading-tight text-gray-700">
                  Khác
                </span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function LogList({ logs }: { logs: FarmLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>Chưa có nhật ký nào.</p>
        <p>Bấm dấu + để thêm mới.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-emerald-800">
              {log.task || "Không tên công việc"}
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">
              {log.stage}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>
                {new Date(log.datetime).toLocaleString("vi-VN", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400" />
              <span>{log.lot}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <User size={14} className="text-gray-400" />
              <span>{log.executor}</span>
            </div>
          </div>

          {(log.materialName ||
            log.materialQuantity ||
            log.wasteType ||
            log.pest ||
            log.method ||
            log.fertilizer ||
            log.activeIngredient ||
            log.dosage ||
            log.quarantineTime) && (
            <div className="mt-3 pt-3 border-t border-gray-50 space-y-1.5 text-sm">
              {log.materialName && (
                <p>
                  <span className="text-gray-500">Vật tư:</span>{" "}
                  {log.materialName}
                </p>
              )}
              {log.activeIngredient && log.task === "Quản lý vật tư" && (
                <p>
                  <span className="text-gray-500">Hoạt chất:</span>{" "}
                  {log.activeIngredient}
                </p>
              )}
              {log.materialQuantity && (
                <p>
                  <span className="text-gray-500">Số lượng:</span>{" "}
                  {log.materialQuantity}
                </p>
              )}
              {log.wasteType && (
                <p>
                  <span className="text-gray-500">Loại xử lý:</span>{" "}
                  {log.wasteType}
                </p>
              )}
              {log.pest && (
                <p>
                  <span className="text-gray-500">Đối tượng:</span> {log.pest}
                </p>
              )}
              {log.method && (
                <p>
                  <span className="text-gray-500">Biện pháp:</span> {log.method}
                </p>
              )}
              {log.fertilizer && (
                <p>
                  <span className="text-gray-500">Phân bón:</span>{" "}
                  {log.fertilizer}
                </p>
              )}
              {log.activeIngredient && log.task !== "Quản lý vật tư" && (
                <p>
                  <span className="text-gray-500">Hoạt chất:</span>{" "}
                  {log.activeIngredient}
                </p>
              )}
              {log.dosage && (
                <p>
                  <span className="text-gray-500">Liều lượng:</span>{" "}
                  {log.dosage}
                </p>
              )}
              {log.quarantineTime && (
                <p className="text-amber-600 font-medium flex items-center gap-1 mt-1">
                  <ShieldAlert size={14} />
                  Cách ly: {log.quarantineTime}
                </p>
              )}
            </div>
          )}

          {log.images && log.images.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                {log.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Log"
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200 snap-start shrink-0"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AddLogForm({
  initialData,
  currentUser,
  onSave,
  onCancel,
  tasksConfig,
  tasksList,
  stageOptions,
  lotOptions,
}: {
  initialData: TaskConfig | null;
  currentUser: { name: string; id?: string | number };
  onSave: (log: FarmLog) => void;
  onCancel: () => void;
  tasksConfig: TaskConfig[];
  tasksList: string[];
  stageOptions: StageOption[];
  lotOptions: LotOption[];
}) {
  const defaultTask = initialData?.defaultValues?.task || "";
  const isTaskInList = tasksList.includes(defaultTask);

  const [isCustomTask, setIsCustomTask] = useState(
    !initialData || !isTaskInList,
  );
  const [requiresMaterials, setRequiresMaterials] = useState(
    initialData ? initialData.requiresMaterials : true,
  );
  const [isScanning, setIsScanning] = useState(false);

  const [formData, setFormData] = useState<Partial<FarmLog>>({
    executor: currentUser.name,
    stage: stageOptions[0]?.id || "",
    lot: lotOptions[0]?.id || "",
    datetime: new Date().toISOString().slice(0, 16),
    task: defaultTask || tasksList[0] || "",
    pest: initialData?.defaultValues?.pest || "",
    method: initialData?.defaultValues?.method || "",
    fertilizer: initialData?.defaultValues?.fertilizer || "",
    activeIngredient: initialData?.defaultValues?.activeIngredient || "",
    dosage: initialData?.defaultValues?.dosage || "",
    quarantineTime: initialData?.defaultValues?.quarantineTime || "",
    wasteType:
      initialData?.defaultValues?.wasteType || "Thu gom chất thải độc hại",
    materialName: "",
    materialQuantity: "",
    images: [],
  });

  useEffect(() => {
    if (!formData.stage && stageOptions.length > 0) {
      setFormData((prev) => ({ ...prev, stage: stageOptions[0].id }));
    }
  }, [stageOptions, formData.stage]);

  // Reset form fields when task changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      pest: "",
      method: "",
      fertilizer: "",
      activeIngredient: "",
      dosage: "",
      quarantineTime: "",
      wasteType:
        formData.task === "Xử lý chất thải"
          ? prev.wasteType || "Thu gom chất thải độc hại"
          : "",
      materialName: formData.task === "Quản lý vật tư" ? prev.materialName : "",
      materialQuantity:
        formData.task === "Quản lý vật tư" ? prev.materialQuantity : "",
    }));
  }, [formData.task]);

  useEffect(() => {
    if (!formData.lot && lotOptions.length > 0) {
      setFormData((prev) => ({ ...prev, lot: lotOptions[0].id }));
    }
  }, [lotOptions, formData.lot]);

  const handleScanMaterial = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setIsScanning(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise((resolve) => {
        reader.onload = resolve;
      });
      const base64Data = (reader.result as string).split(",")[1];
      const mimeType = file.type;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: "Extract the material name (tên vật tư/thuốc/phân bón), active ingredient (hoạt chất), and quantity/volume (dung tích/khối lượng) from this image. Return JSON.",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              materialName: {
                type: Type.STRING,
                description: "Tên vật tư/thuốc/phân bón",
              },
              activeIngredient: {
                type: Type.STRING,
                description: "Hoạt chất chính",
              },
              quantity: {
                type: Type.STRING,
                description: "Dung tích hoặc khối lượng",
              },
            },
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      setFormData((prev) => ({
        ...prev,
        materialName: result.materialName || prev.materialName,
        activeIngredient: result.activeIngredient || prev.activeIngredient,
        materialQuantity: result.quantity || prev.materialQuantity,
        images: [...(prev.images || []), reader.result as string], // Store base64 data URL
      }));
    } catch (error) {
      console.error("Error scanning material:", error);
      alert("Không thể nhận diện hình ảnh. Vui lòng nhập thủ công.");
    } finally {
      setIsScanning(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalData = { ...formData } as any;

    if (finalData.task !== "Xử lý chất thải") {
      delete finalData.wasteType;
    }
    if (finalData.task !== "Quản lý vật tư") {
      delete finalData.materialName;
      delete finalData.materialQuantity;
    } else {
      delete finalData.pest;
      delete finalData.method;
      delete finalData.fertilizer;
      delete finalData.dosage;
      delete finalData.quarantineTime;
    }

    // Don't delete images - send them to API
    // delete finalData.images;

    try {
      const selectedTask = tasksConfig.find(
        (task) =>
          task.defaultValues.task === finalData.task ||
          task.name === finalData.task,
      );

      const created = await farmAPI.createFarmLog({
        farmer: currentUser.id,
        stage: finalData.stage,
        lot: finalData.lot,
        datetime: finalData.datetime,
        task: selectedTask?.id,
        pest: finalData.pest,
        method: finalData.method,
        fertilizer: finalData.fertilizer,
        active_ingredient: finalData.activeIngredient,
        dosage: finalData.dosage,
        quarantine_time: finalData.quarantineTime,
        waste_type: finalData.wasteType,
        material_name: finalData.materialName,
        material_quantity: finalData.materialQuantity,
        images: finalData.images || [],
      });

      onSave(mapApiLog(created, stageOptions, lotOptions, tasksConfig));
      setFormData((prev) => ({
        ...prev,
        task: tasksList[0] || "",
        stage: stageOptions[0]?.id || "",
        lot: lotOptions[0]?.id || "",
      }));
      alert("Thêm nhật ký thành công!");
    } catch (error: any) {
      console.error("Không thể lưu nhật ký:", error);
      alert(error?.message || "Lưu nhật ký thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Thông tin cơ bản */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="font-semibold text-emerald-800 border-b pb-2 flex items-center gap-2">
          <Activity size={18} /> Thông tin chung
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Người thực hiện
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="executor"
              required
              value={formData.executor}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập tên người thực hiện"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giai đoạn
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {stageOptions.length === 0 ? (
                <option value="">Chưa có giai đoạn</option>
              ) : (
                stageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lô canh tác
            </label>
            <select
              name="lot"
              value={formData.lot}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {lotOptions.length === 0 ? (
                <option value="">Chưa có lô</option>
              ) : (
                lotOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-400" />
            </div>
            <input
              type="datetime-local"
              name="datetime"
              required
              value={formData.datetime}
              onChange={handleChange}
              className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung công việc
          </label>
          <select
            value={isCustomTask ? "Khác" : formData.task}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "Khác") {
                setIsCustomTask(true);
                setRequiresMaterials(true);
                setFormData((prev) => ({ ...prev, task: "" }));
              } else {
                setIsCustomTask(false);
                const predefined = tasksConfig.find(
                  (t) => t.defaultValues.task === val,
                );
                setRequiresMaterials(
                  predefined ? predefined.requiresMaterials : true,
                );
                setFormData((prev) => ({ ...prev, task: val }));
              }
            }}
            className={`w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white ${isCustomTask ? "mb-2" : ""}`}
          >
            {tasksList.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
            <option value="Khác">Khác...</option>
          </select>

          {isCustomTask && (
            <textarea
              name="task"
              required
              value={formData.task}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập nội dung công việc khác..."
            ></textarea>
          )}

          {formData.task === "Xử lý chất thải" && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại xử lý
              </label>
              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Thu gom chất thải độc hại">
                  Thu gom chất thải độc hại
                </option>
                <option value="Xử lý phụ phẩm">Xử lý phụ phẩm</option>
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh hoạt động / Kho vật tư
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {formData.images?.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={img}
                  alt={`Upload ${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images?.filter((_, i) => i !== idx),
                    }))
                  }
                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
              <ImageIcon size={24} className="mb-1 text-gray-400" />
              <span className="text-xs font-medium">Thêm ảnh</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    // Convert files to base64 data URLs for preview and storage
                    const processFiles = async () => {
                      const filesArray: string[] = [];
                      for (const file of Array.from(files)) {
                        const reader = new FileReader();
                        const dataUrl = await new Promise<string>((resolve) => {
                          reader.onload = () =>
                            resolve(reader.result as string);
                          reader.readAsDataURL(file);
                        });
                        filesArray.push(dataUrl);
                      }
                      setFormData((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), ...filesArray],
                      }));
                    };
                    processFiles();
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Quản lý vật tư */}
      {formData.task === "Quản lý vật tư" && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-semibold text-indigo-800 flex items-center gap-2">
              <Package size={18} /> Nhập kho vật tư
            </h2>
            <label className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100 transition-colors">
              {isScanning ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ScanLine size={16} />
              )}
              {isScanning ? "Đang quét..." : "Quét nhãn"}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleScanMaterial}
                disabled={isScanning}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên vật tư / Thuốc / Phân bón
            </label>
            <input
              type="text"
              name="materialName"
              required
              value={formData.materialName}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập hoặc quét ảnh để tự điền..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hoạt chất chính
            </label>
            <input
              type="text"
              name="activeIngredient"
              value={formData.activeIngredient}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ví dụ: Abamectin..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng / Dung tích
            </label>
            <input
              type="text"
              name="materialQuantity"
              required
              value={formData.materialQuantity}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ví dụ: 10 chai, 500ml..."
            />
          </div>
        </div>
      )}

      {/* Chi tiết vật tư / Thuốc */}
      {requiresMaterials && formData.task !== "Quản lý vật tư" && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-emerald-800 border-b pb-2 flex items-center gap-2">
            <Beaker size={18} /> Vật tư & Phòng trừ
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đối tượng gây hại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Bug size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="pest"
                value={formData.pest}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ví dụ: Rêu, Sâu rầy, Rệp..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên biện pháp / Thuốc
            </label>
            <input
              type="text"
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ví dụ: Champion, Najat 3.6..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân bón
            </label>
            <input
              type="text"
              name="fertilizer"
              value={formData.fertilizer}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ví dụ: Phân gà, NPK 30-10-10..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hoạt chất
            </label>
            <input
              type="text"
              name="activeIngredient"
              value={formData.activeIngredient}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ví dụ: Copper Hydroxide, Abamectin..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Liều lượng
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Droplet size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="VD: 2kg/1000L"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian cách ly
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldAlert size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="quarantineTime"
                  value={formData.quarantineTime}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="VD: 7 Ngày"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 pb-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-[2] bg-emerald-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <Save size={20} /> Lưu Nhật Ký
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function ReportScreen({
  currentUser,
  lotOptions,
  onAddReport,
}: {
  currentUser: { id?: string | number; name: string };
  lotOptions: LotOption[];
  onAddReport: (report: IncidentReport) => void;
}) {
  const [reportType, setReportType] = useState("Sâu bệnh");
  const [description, setDescription] = useState("");
  const [lot, setLot] = useState(lotOptions[0]?.id || "");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!lot && lotOptions.length > 0) {
      setLot(lotOptions[0].id);
    }
  }, [lotOptions, lot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!currentUser.id) {
      alert("Không thể xác định nông dân. Vui lòng đăng nhập lại.");
      setIsSubmitting(false);
      return;
    }

    try {
      const createdReport = await farmAPI.createIncidentReport({
        farmer: currentUser.id,
        lot: lot || null,
        datetime: new Date().toISOString(),
        report_type: reportType,
        description,
        images,
      });

      const report = mapApiIncidentReport(createdReport);
      onAddReport(report);
      alert("Báo cáo sự cố đã được gửi thành công!");
      setDescription("");
      setImages([]);
      setLot(lotOptions[0]?.id || "");
    } catch (error: any) {
      console.error("Không thể gửi báo cáo sự cố:", error);
      alert(error?.message || "Gửi báo cáo thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} />
          Báo cáo sự cố mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại sự cố
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="Sâu bệnh">Sâu bệnh bùng phát</option>
              <option value="Thời tiết">Thiệt hại do thời tiết</option>
              <option value="Thiết bị">Hỏng hóc thiết bị/hệ thống tưới</option>
              <option value="Khác">Vấn đề khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vị trí (Lô)
            </label>
            <select
              value={lot}
              onChange={(e) => setLot(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              {lotOptions.length === 0 ? (
                <option value="">Chưa có lô</option>
              ) : (
                lotOptions.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả chi tiết
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Mô tả rõ tình trạng sự cố..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh hiện trường
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={img}
                    alt={`Upload ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
                <Camera size={24} className="mb-1 text-gray-400" />
                <span className="text-xs font-medium">Chụp ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const filesArray = Array.from(files).map((file) =>
                        URL.createObjectURL(file),
                      );
                      setImages((prev) => [...prev, ...filesArray]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-amber-600 active:bg-amber-700 transition-colors shadow-sm disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <AlertTriangle size={20} />
            )}
            {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsScreen({
  currentUser,
  onLogout,
}: {
  currentUser: { name: string; admin_id?: string | number } | null;
  onLogout: () => void;
}) {
  const [farmData, setFarmData] = useState<any>(null);
  const [loadingFarm, setLoadingFarm] = useState(true);
  const [plantingZones, setPlantingZones] = useState<any[]>([]);
  const [loadingZones, setLoadingZones] = useState(true);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploadingCert, setUploadingCert] = useState(false);

  const displayName = currentUser?.name || "Người dùng";

  useEffect(() => {
    const fetchFarmData = async () => {
      if (!currentUser?.admin_id) {
        setLoadingFarm(false);
        return;
      }
      try {
        const farm = await farmAPI.getFarmByAdmin(currentUser.admin_id);
        setFarmData(farm);
      } catch (error: any) {
        if (
          error.message?.includes("Farm not found") ||
          error.message?.includes("404")
        ) {
          console.log("Tài khoản admin mới chưa có thông tin trang trại");
          setFarmData(null);
        } else {
          console.warn("Không thể tải thông tin trang trại:", error);
        }
      } finally {
        setLoadingFarm(false);
      }
    };
    fetchFarmData();
  }, [currentUser?.admin_id]);

  useEffect(() => {
    const fetchPlantingZones = async () => {
      if (!currentUser?.admin_id) {
        console.log("Không có admin_id, không tải bản đồ:", currentUser);
        setLoadingZones(false);
        setPlantingZones([]);
        return;
      }
      try {
        console.log("Tải bản đồ cho admin_id:", currentUser.admin_id);
        const zones = await farmAPI.getPlantingZones(currentUser.admin_id);
        console.log("Bản đồ lô canh tác nhận được:", zones);
        setPlantingZones(zones || []);
      } catch (error: any) {
        console.warn("Không thể tải bản đồ lô canh tác:", error);
        setPlantingZones([]);
      } finally {
        setLoadingZones(false);
      }
    };
    fetchPlantingZones();
  }, [currentUser?.admin_id]);

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const handleCertificateSubmit = async () => {
    if (!certificateFile) {
      alert("Vui lòng chọn file");
      return;
    }
    setUploadingCert(true);
    try {
      alert(
        "Tạm thời không trích xuất được. Vui lòng liên hệ admin để xử lý thủ công.",
      );
      setCertificateFile(null);
    } catch (error: any) {
      console.error("Lỗi upload:", error);
      alert("Upload thất bại");
    } finally {
      setUploadingCert(false);
    }
  };
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold">
          {displayName.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-800">{displayName}</h2>
          <p className="text-sm text-gray-500">Nông dân hợp tác xã</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Sprout size={18} className="text-emerald-600" />
            Thông tin trang trại
          </h3>
        </div>
        <div className="p-4 space-y-3 text-sm">
          {loadingFarm ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Đang tải thông tin...</p>
            </div>
          ) : farmData ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Tên HTX:</span>
                <span className="font-medium text-gray-800">
                  {farmData.cooperative_name || "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Địa chỉ:</span>
                <span className="font-medium text-gray-800 text-right">
                  {farmData.address || "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng diện tích:</span>
                <span className="font-medium text-gray-800">
                  {farmData.total_area
                    ? `${farmData.total_area} hecta`
                    : "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cây trồng chính:</span>
                <span className="font-medium text-gray-800">
                  {farmData.main_crop_type || "Chưa cập nhật"}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Sprout size={24} />
              </div>
              <div>
                <p className="text-gray-600 font-medium">
                  Chưa có thông tin trang trại
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Vui lòng liên hệ admin hệ thống để tạo thông tin trang trại
                  trong phần Quản lý HTX
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" />
              Bản đồ lô canh tác
            </h3>
            {currentUser?.admin_id && (
              <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                HTX ID: {currentUser.admin_id}
              </div>
            )}
          </div>
        </div>
        <div className="p-4">
          {loadingZones ? (
            <div className="text-center py-6 text-gray-500">
              <p>Đang tải bản đồ lô canh tác...</p>
            </div>
          ) : plantingZones.length > 0 ? (
            <div className="space-y-4">
              {plantingZones.map((zone: any, zoneIdx: number) => {
                const colors = [
                  {
                    bg: "bg-emerald-200",
                    border: "border-emerald-400",
                    text: "text-emerald-800",
                  },
                  {
                    bg: "bg-blue-200",
                    border: "border-blue-400",
                    text: "text-blue-800",
                  },
                  {
                    bg: "bg-amber-200",
                    border: "border-amber-400",
                    text: "text-amber-800",
                  },
                  {
                    bg: "bg-rose-200",
                    border: "border-rose-400",
                    text: "text-rose-800",
                  },
                  {
                    bg: "bg-violet-200",
                    border: "border-violet-400",
                    text: "text-violet-800",
                  },
                ];
                const color = colors[zoneIdx % colors.length];

                return (
                  <div key={zone.id}>
                    <h4 className="font-bold text-gray-800 mb-2">
                      {zone.name || `Vùng ${zone.id}`}
                    </h4>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">
                        {zone.crop_type || "Chưa hoàn thành"}
                      </span>
                      {zone.area && (
                        <span className="ml-3">Diện tích: {zone.area} ha</span>
                      )}
                    </div>
                    <div className="aspect-video bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center relative overflow-auto p-2 z-0">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(#10b981 1px, transparent 1px)",
                          backgroundSize: "10px 10px",
                        }}
                      ></div>
                      <div className="relative w-full h-full flex flex-wrap gap-2 content-start p-2 z-0">
                        {zone.lots && zone.lots.length > 0 ? (
                          zone.lots.map((lot: any, idx: number) => (
                            <div
                              key={lot.id}
                              className={`${color.bg} rounded border-2 ${color.border} flex items-center justify-center font-bold text-sm ${color.text} shadow-sm flex-grow`}
                              style={{ minHeight: "60px" }}
                            >
                              {lot.name || `Lô ${idx + 1}`}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm">
                            Không có lô canh tác
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-gray-600 font-medium">Chưa có lô canh tác</p>
                <p className="text-sm text-gray-500 mt-1">
                  Vui lòng liên hệ admin HTX để được cấp bản đồ lô canh tác
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full bg-white text-red-600 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100 transition-colors shadow-sm border border-red-100"
      >
        <LogOut size={20} /> Đăng xuất tài khoản
      </button>
    </div>
  );
}

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop",
    title: "Nền tảng Quản lý Nông nghiệp",
    subtitle: "Thông minh & Chuẩn VietGAP",
    description:
      "Giải pháp toàn diện giúp Hợp tác xã và Nông dân số hoá nhật ký canh tác, quản lý vật tư chuẩn VietGAP, và minh bạch nguồn gốc nông sản.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3023?q=80&w=2070&auto=format&fit=crop",
    title: "Nhật ký Canh tác Số",
    subtitle: "Dễ dàng & Nhanh chóng",
    description:
      "Nông dân dễ dàng ghi chép hoạt động bón phân, phun thuốc, thu hoạch ngay trên điện thoại. Dữ liệu được đồng bộ theo thời gian thực.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop",
    title: "Quản lý Vật tư",
    subtitle: "An toàn & Minh bạch",
    description:
      "HTX kiểm soát chặt chẽ danh mục phân bón, thuốc BVTV. Đảm bảo nông dân chỉ sử dụng các vật tư đạt chuẩn an toàn VietGAP.",
  },
];

function LandingScreen({
  onLoginClick,
  onRegisterClick,
  onHTXLoginClick,
  onSysAdminLoginClick,
}: {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onHTXLoginClick: () => void;
  onSysAdminLoginClick: () => void;
}) {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <Sprout size={28} />
            <span className="text-xl font-bold">Open Farm</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onLoginClick}
              className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors text-sm sm:text-base px-2"
            >
              Đăng Nhập Nông Dân
            </button>
            <button
              onClick={onRegisterClick}
              className="bg-emerald-600 text-white px-4 sm:px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition-colors text-sm sm:text-base"
            >
              Đăng ký HTX
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Slide Banner */}
      <main className="flex-1 flex flex-col">
        <section className="relative h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${banners[currentBanner].image})`,
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight text-white">
                    {banners[currentBanner].title}{" "}
                    <br className="hidden sm:block" />
                    <span className="text-emerald-400">
                      {banners[currentBanner].subtitle}
                    </span>
                  </h1>
                  <p className="text-base sm:text-xl text-gray-200 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
                    {banners[currentBanner].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0 w-full sm:w-auto">
                <button
                  onClick={onLoginClick}
                  className="w-full sm:w-auto bg-emerald-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-emerald-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <User size={20} />
                  Đăng nhập cho Nông dân
                </button>
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white/20 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Building size={20} />
                  Đăng ký Hợp tác xã
                </button>
              </div>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentBanner
                    ? "bg-emerald-500 w-8"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-20 px-4 bg-white flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Tính năng nổi bật
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base px-2">
                Hệ sinh thái công cụ quản lý trang trại toàn diện, kết nối chặt
                chẽ giữa Ban quản lý HTX và Nông dân.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <ClipboardList size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Nhật ký Canh tác Số
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Nông dân dễ dàng ghi chép hoạt động bón phân, phun thuốc, thu
                  hoạch ngay trên điện thoại. Dữ liệu được đồng bộ theo thời
                  gian thực.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Package size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Quản lý Vật tư VietGAP
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  HTX kiểm soát chặt chẽ danh mục phân bón, thuốc BVTV. Đảm bảo
                  nông dân chỉ sử dụng các vật tư đạt chuẩn an toàn VietGAP.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <MapPin size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Bản đồ Lô đất AI
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Tự động trích xuất tọa độ VN-2000 từ sổ đỏ bằng AI, vẽ bản đồ
                  phân lô trực quan giúp HTX quản lý diện tích canh tác chính
                  xác.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <ScanLine size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Nhận diện Vật tư bằng AI
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Sử dụng AI để quét và trích xuất thông tin từ bao bì vật tư
                  nông nghiệp, giúp nông dân nhập liệu nhanh chóng và chính xác.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <AlertTriangle size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Báo cáo Sự cố & Dịch bệnh
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Nông dân có thể báo cáo nhanh các sự cố, sâu bệnh kèm hình ảnh
                  thực tế để Ban quản lý HTX kịp thời hỗ trợ và xử lý.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Printer size={24} className="sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Thống kê & Xuất Báo cáo PDF
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Tổng hợp dữ liệu toàn HTX, cung cấp cái nhìn tổng quan qua các
                  biểu đồ và hỗ trợ xuất báo cáo chi tiết ra file PDF.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-10 text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-300">
          <Sprout size={24} />
          <span className="text-xl font-bold">Open Farm</span>
        </div>
        <p className="mb-6 text-sm sm:text-base">
          © 2026 Open Farm. Nền tảng nông nghiệp số.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onHTXLoginClick}
            className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors text-sm sm:text-base bg-gray-800 px-6 py-2.5 rounded-full"
          >
            Đăng nhập dành cho Ban quản lý HTX
          </button>
          <button
            onClick={onSysAdminLoginClick}
            className="text-gray-500 hover:text-gray-300 transition-colors text-xs underline"
          >
            Đăng nhập Quản trị Hệ thống
          </button>
        </div>
      </footer>
    </div>
  );
}

function RegisterScreen({
  onBack,
  onRegisterSuccess,
  onLoginClick,
}: {
  onBack: () => void;
  onRegisterSuccess: (pending: PendingAdminRegistration) => void;
  onLoginClick: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [googlePromptSuppressed, setGooglePromptSuppressed] = useState(false);

  const registerGoogleCallback = useCallback(
    (response: any) => {
      console.log("[Google Register Callback] response", response);
      const payload = decodeJwt(response?.credential);
      console.log("[Google Register Callback] decoded payload", payload);
      if (!payload?.email || !payload?.sub) {
        console.error("[Google Register Callback] invalid payload", payload);
        setError("Đăng ký Google thất bại. Vui lòng thử lại.");
        return;
      }
      onRegisterSuccess({
        email: payload.email,
        password: payload.sub,
        googleId: payload.sub,
      });
    },
    [onRegisterSuccess],
  );

  useEffect(() => {
    let mounted = true;
    loadGoogleIdentityScript()
      .then(() => {
        if (!mounted) return;
        ensureGoogleIdentityInitialized("signup");
        setGoogleIdentityHandler(registerGoogleCallback);
        setGoogleReady(true);
      })
      .catch((err) => {
        console.warn("Không thể tải Google Identity:", err);
      });
    return () => {
      if ((window as any).__googleIdentityHandler === registerGoogleCallback) {
        setGoogleIdentityHandler(null);
      }
      mounted = false;
    };
  }, [registerGoogleCallback]);

  const handleGoogleRegister = () => {
    setError("");

    if (!googleReady) {
      console.warn(
        "[Google Register] chưa sẵn sàng, vui lòng đợi hoặc tải lại",
      );
      setError("Google đang tải, vui lòng đợi một vài giây rồi thử lại.");
      return;
    }

    const google = (window as any).google;
    if (!google?.accounts?.id) {
      console.error(
        "[Google Register] google.accounts.id not available",
        google,
      );
      setError("Google chưa sẵn sàng. Vui lòng thử lại sau vài giây.");
      return;
    }

    ensureGoogleIdentityInitialized("signup");
    setGoogleIdentityHandler(registerGoogleCallback);

    console.log(
      "[Google Register] google.accounts.id prompt",
      google.accounts.id,
    );
    console.log(
      "[Google Register] Using FedCM-compatible notification handling",
    );

    // Check if FedCM is supported and enabled
    const isFedCMSupported = "IdentityCredential" in window;
    console.log("[Google Register] FedCM supported:", isFedCMSupported);

    try {
      google.accounts.id.prompt((notification: any) => {
        console.log("[Google Register] prompt notification", notification);

        // Handle FedCM compatibility - check if deprecated methods exist
        try {
          if (notification.isNotDisplayed && notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason
              ? notification.getNotDisplayedReason()
              : "unknown";
            console.warn("[Google Register] not displayed", reason);

            if (reason === "suppressed_by_user") {
              // User suppressed the prompt - don't retry automatically
              console.log(
                "[Google Register] suppressed_by_user - not retrying automatically",
              );
              if (google.accounts.id.disableAutoSelect) {
                google.accounts.id.disableAutoSelect();
              }
              setGooglePromptSuppressed(true);
              setError(
                "Google prompt bị chặn (suppressed_by_user). Vui lòng bật popup/cookie hoặc thử lại.",
              );
            } else {
              // Other reasons - inform user
              console.log("[Google Register] other reason:", reason);
              setGooglePromptSuppressed(false);
              setError(
                `Google prompt không hiển thị: ${reason}. Vui lòng kiểm tra pop-up và cookie.`,
              );
            }

            return;
          }
        } catch (fedcmError) {
          console.warn(
            "[Google Register] FedCM compatibility issue:",
            fedcmError,
          );
          // Continue with other checks
        }

        setGooglePromptSuppressed(false);

        try {
          if (notification.isSkippedMoment && notification.isSkippedMoment()) {
            console.warn(
              "[Google Register] skipped",
              notification.getSkippedReason
                ? notification.getSkippedReason()
                : "unknown",
            );
          }
          if (
            notification.isDismissedMoment &&
            notification.isDismissedMoment()
          ) {
            console.warn(
              "[Google Register] dismissed",
              notification.getDismissedReason
                ? notification.getDismissedReason()
                : "unknown",
            );
          }
        } catch (fedcmError) {
          console.warn(
            "[Google Register] FedCM moment methods issue:",
            fedcmError,
          );
        }
      });
    } catch (err: any) {
      console.error("[Google Register] prompt error:", err);
      if (err.name === "AbortError" || err.message?.includes("aborted")) {
        console.log(
          "[Google Register] FedCM AbortError - this is normal when user cancels or config issues",
        );
        setError("Google Sign-In bị hủy. Vui lòng thử lại.");
      } else if (
        err.message?.includes("FedCM") ||
        err.message?.includes("well-known")
      ) {
        console.warn("[Google Register] FedCM configuration issue:", err);
        setError("Cấu hình Google Sign-In có vấn đề. Vui lòng liên hệ hỗ trợ.");
      } else {
        setError(
          "Google Sign-In đang bảo trì. Vui lòng thử lại sau vài giây hoặc sử dụng phương thức đăng ký khác.",
        );
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    onRegisterSuccess({ email: email.trim(), password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium hidden sm:inline">Trang chủ</span>
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Building size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Đăng ký Hợp tác xã
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Tạo tài khoản quản lý HTX của bạn
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập địa chỉ email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Tạo mật khẩu"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors mt-6"
          >
            Tiếp tục
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="relative z-10 px-2 bg-white text-gray-500">
                Hoặc
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng ký bằng Google
          </button>

          {googlePromptSuppressed && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
              <p>
                Google prompt bị chặn (suppressed_by_user). Vui lòng bật
                pop-up/cookie và thử lại.
              </p>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setGooglePromptSuppressed(false);
                  if ((window as any).google?.accounts?.id) {
                    (window as any).google.accounts.id.disableAutoSelect();
                    (window as any).google.accounts.id.prompt();
                  }
                }}
                className="mt-2 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
              >
                Thử lại Google
              </button>
            </div>
          )}
        </form>
        <div className="mt-8 text-sm text-center text-gray-600">
          Đã có tài khoản?{" "}
          <button
            onClick={onLoginClick}
            className="text-emerald-600 font-medium hover:underline"
          >
            Đăng nhập HTX
          </button>
        </div>
      </div>
    </div>
  );
}

function HTXLoginScreen({
  onBack,
  onLoginSuccess,
}: {
  onBack: () => void;
  onLoginSuccess: (user: {
    id?: string | number;
    email?: string;
    name: string;
    role: string;
  }) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [googlePromptSuppressed, setGooglePromptSuppressed] = useState(false);

  const loginGoogleCallback = useCallback(
    async (response: any) => {
      console.log("[Google Login Callback] response", response);
      const payload = decodeJwt(response?.credential);
      console.log("[Google Login Callback] decoded payload", payload);
      if (!payload?.sub || !payload?.email) {
        console.error("[Google Login Callback] invalid payload", payload);
        setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
        return;
      }

      try {
        const admin = await authAPI.adminLoginGoogle(payload.sub);

        // Kiểm tra xem admin có được phê duyệt không
        if (admin?.status !== "approved") {
          const statusMessage =
            admin?.status === "rejected"
              ? "HTX của bạn đã bị từ chối"
              : "HTX của bạn chưa được phê duyệt. Vui lòng chờ admin xác nhận.";
          setError(statusMessage);
          return;
        }

        onLoginSuccess({
          id: admin?.id,
          email: admin?.email || payload.email,
          name: admin?.name || payload.email,
          role: admin?.role || "htx",
        });
      } catch (err: any) {
        setError(err?.message || "Đăng nhập Google thất bại");
      }
    },
    [onLoginSuccess],
  );

  useEffect(() => {
    let mounted = true;
    loadGoogleIdentityScript()
      .then(() => {
        if (!mounted) return;
        ensureGoogleIdentityInitialized("signin");
        setGoogleIdentityHandler(loginGoogleCallback);
        setGoogleReady(true);
      })
      .catch((err) => {
        console.warn("Không thể tải Google Identity:", err);
      });
    return () => {
      if ((window as any).__googleIdentityHandler === loginGoogleCallback) {
        setGoogleIdentityHandler(null);
      }
      mounted = false;
    };
  }, [loginGoogleCallback]);

  const handleGoogleLogin = () => {
    setError("");

    if (!googleReady) {
      console.warn("[Google Login] chưa sẵn sàng, vui lòng đợi hoặc tải lại");
      setError("Google đang tải, vui lòng đợi một vài giây rồi thử lại.");
      return;
    }

    const google = (window as any).google;
    if (!google?.accounts?.id) {
      console.error("[Google Login] google.accounts.id not available", google);
      setError("Google chưa sẵn sàng. Vui lòng thử lại sau vài giây.");
      return;
    }

    ensureGoogleIdentityInitialized("signin");
    setGoogleIdentityHandler(loginGoogleCallback);

    console.log("[Google Login] prompt", google.accounts.id);
    console.log("[Google Login] Using FedCM-compatible notification handling");
    try {
      google.accounts.id.prompt((notification: any) => {
        console.log("[Google Login] prompt notification", notification);

        // Handle FedCM compatibility - check if deprecated methods exist
        try {
          if (notification.isNotDisplayed && notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason
              ? notification.getNotDisplayedReason()
              : "unknown";
            console.warn("[Google Login] prompt not displayed", reason);

            if (reason === "suppressed_by_user") {
              // User suppressed the prompt - don't retry automatically
              console.log(
                "[Google Login] suppressed_by_user - not retrying automatically",
              );
              if (google.accounts.id.disableAutoSelect) {
                google.accounts.id.disableAutoSelect();
              }
              setGooglePromptSuppressed(true);
              setError(
                "Google prompt bị chặn (suppressed_by_user). Vui lòng bật popup/cookie hoặc thử lại.",
              );
            } else {
              // Other reasons - try again
              console.log("[Google Login] retrying for reason:", reason);
              setGooglePromptSuppressed(false);
              setError(
                `Google prompt không hiển thị: ${reason}. Vui lòng bật pop-up và cookie rồi thử lại.`,
              );
            }

            return;
          }
        } catch (fedcmError) {
          console.warn("[Google Login] FedCM compatibility issue:", fedcmError);
          // Continue with other checks
        }

        setGooglePromptSuppressed(false);

        try {
          if (notification.isSkippedMoment && notification.isSkippedMoment()) {
            console.warn(
              "[Google Login] prompt skipped",
              notification.getSkippedReason
                ? notification.getSkippedReason()
                : "unknown",
            );
          }
          if (
            notification.isDismissedMoment &&
            notification.isDismissedMoment()
          ) {
            console.warn(
              "[Google Login] prompt dismissed",
              notification.getDismissedReason
                ? notification.getDismissedReason()
                : "unknown",
            );
          }
        } catch (fedcmError) {
          console.warn(
            "[Google Login] FedCM moment methods issue:",
            fedcmError,
          );
        }
      });
    } catch (err: any) {
      console.error("[Google Login] prompt error:", err);
      if (err.name === "AbortError" || err.message?.includes("aborted")) {
        console.log(
          "[Google Login] FedCM AbortError - this is normal when user cancels or config issues",
        );
        setError("Google Sign-In bị hủy. Vui lòng thử lại.");
      } else if (
        err.message?.includes("FedCM") ||
        err.message?.includes("well-known")
      ) {
        console.warn("[Google Login] FedCM configuration issue:", err);
        setError("Cấu hình Google Sign-In có vấn đề. Vui lòng liên hệ hỗ trợ.");
      } else {
        setError(
          "Google Sign-In đang bảo trì. Vui lòng thử lại sau vài giây hoặc sử dụng đăng nhập HTX.",
        );
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const admin = await authAPI.adminLogin(email, password);

      // Kiểm tra xem admin có được phê duyệt không
      if (admin?.status !== "approved") {
        const statusMessage =
          admin?.status === "rejected"
            ? "HTX của bạn đã bị từ chối"
            : "HTX của bạn chưa được phê duyệt. Vui lòng chờ admin xác nhận.";
        setError(statusMessage);
        return;
      }

      onLoginSuccess({
        id: admin.id,
        email,
        name: admin.name || email,
        role: "admin",
      });
    } catch (err: any) {
      setError(err?.message || "Đăng nhập HTX thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium hidden sm:inline">Trang chủ</span>
      </button>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
            <Building size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Đăng nhập HTX
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Quản lý hoạt động hợp tác xã
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập địa chỉ email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors mt-6"
          >
            Đăng nhập
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng nhập bằng Google
          </button>

          {googlePromptSuppressed && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
              <p>
                Google prompt bị chặn (suppressed_by_user). Vui lòng bật
                popup/cookie hoặc thử lại.
              </p>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setGooglePromptSuppressed(false);
                  if ((window as any).google?.accounts?.id) {
                    (window as any).google.accounts.id.disableAutoSelect();
                    (window as any).google.accounts.id.prompt();
                  }
                }}
                className="mt-2 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
              >
                Thử lại Google
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function OnboardHTXScreen({
  pendingRegistration,
  onComplete,
}: {
  pendingRegistration: PendingAdminRegistration | null;
  onComplete: (admin: any) => void;
}) {
  const [htxName, setHtxName] = useState("");
  const [address, setAddress] = useState("");
  const [representative, setRepresentative] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pendingRegistration) {
      setError("Vui lòng hoàn thành bước 1 trước khi tiếp tục");
      return;
    }

    try {
      const payload: any = {
        name: htxName || "HTX Mới",
        address,
        representative,
        registration_certificate: fileName,
        google_email: pendingRegistration.email,
      };

      if (pendingRegistration.googleId) {
        payload.google_id = pendingRegistration.googleId;
      } else {
        payload.password = pendingRegistration.password;
        payload.pin = pendingRegistration.password;
      }

      const admin = await authAPI.adminRegister(payload);
      onComplete(admin);
    } catch (err: any) {
      setError(err?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Thiết lập Hợp tác xã
          </h1>
          <p className="text-gray-500 text-sm">
            Vui lòng cung cấp thông tin để hoàn tất đăng ký
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              1. Tên Hợp tác xã <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={htxName}
              onChange={(e) => setHtxName(e.target.value)}
              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="VD: HTX Nông Nghiệp Xanh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              2. Địa chỉ HTX <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Nhập địa chỉ đầy đủ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3. Người đại diện <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
              className="w-full rounded-xl border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Họ và tên người đại diện pháp luật"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              4. Giấy chứng nhận đăng ký HTX{" "}
              <span className="text-red-500">*</span>
            </label>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-emerald-400 cursor-pointer transition-colors">
              <Upload size={32} className="mb-2 text-emerald-500" />
              <span className="text-sm font-medium text-gray-700 mb-1">
                Tải lên tài liệu
              </span>
              <span className="text-xs text-gray-400">
                Hỗ trợ PDF, JPG, PNG (Tối đa 5MB)
              </span>
              <input
                type="file"
                required
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFileName(e.target.files[0].name);
                  }
                }}
              />
            </label>
            {fileName && (
              <div className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                <CheckCircle size={16} /> Đã chọn: {fileName}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors mt-8 shadow-sm"
          >
            Hoàn tất thiết lập
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboardScreen({
  currentUser,
  onLogout,
  onNavigate,
  farmers,
  zones,
  logs,
  farm,
}: {
  currentUser: { name: string };
  onLogout: () => void;
  onNavigate: (
    screen:
      | "landing"
      | "register"
      | "onboard"
      | "admin"
      | "admin_land"
      | "admin_farmer"
      | "admin_report"
      | "admin_material"
      | "admin_process"
      | "admin_farm"
      | "login"
      | "app",
  ) => void;
  farmers: Farmer[];
  zones: PlantingZone[];
  logs: FarmLog[];
  farm?: Farm | null;
}) {
  const totalLots = zones.reduce((acc, zone) => acc + zone.lots.length, 0);

  // Count all logs from HTX creation date to now
  // Use farm.createdAt if available, otherwise count all logs
  const activeTasks = (() => {
    if (farm?.createdAt) {
      const startDate = new Date(farm.createdAt);
      // Validate the date is valid
      if (!isNaN(startDate.getTime())) {
        const validLogs = logs.filter((log) => {
          try {
            const logDate = new Date(log.datetime);
            return !isNaN(logDate.getTime()) && logDate >= startDate;
          } catch {
            return false;
          }
        });
        return validLogs.length;
      }
    }
    // If no valid farm date, count all logs
    return logs.length;
  })();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building size={24} />
          <h1 className="text-xl font-bold">Quản lý HTX</h1>
        </div>
        <button
          onClick={onLogout}
          className="p-2 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <LogOut size={20} />
        </button>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <Breadcrumb />
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quản lý HTX</h2>
          <p className="text-gray-600">
            Chào mừng bạn đến với hệ thống quản lý của{" "}
            <strong>{currentUser?.name || "HTX"}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <User size={24} className="text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-gray-800">
              {farmers.length}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
              Nông dân
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <MapPin size={24} className="text-amber-500 mb-2" />
            <span className="text-2xl font-bold text-gray-800">
              {totalLots}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
              Lô đất
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <ClipboardList size={24} className="text-purple-500 mb-2" />
            <span className="text-2xl font-bold text-gray-800">
              {logs.length}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
              Nhật ký
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <Activity size={24} className="text-emerald-500 mb-2" />
            <span className="text-2xl font-bold text-gray-800">
              {activeTasks}
            </span>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
              Số Ngày Hoạt động HTX
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate("admin_process")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <Settings size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Quản lý Quy trình
            </h3>
            <p className="text-sm text-gray-500">
              Cấu hình các bước nhật ký canh tác cho nông dân.
            </p>
          </div>
          <div
            onClick={() => onNavigate("admin_farmer")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <User size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Quản lý Nông dân
            </h3>
            <p className="text-sm text-gray-500">
              Thêm, sửa, xóa tài khoản nông dân và phân công lô đất.
            </p>
          </div>
          <div
            onClick={() => onNavigate("admin_land")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Quản lý Mã vùng trồng
            </h3>
            <p className="text-sm text-gray-500">
              Thiết lập bản đồ, chia lô và theo dõi trạng thái canh tác.
            </p>
          </div>
          <div
            onClick={() => onNavigate("admin_report")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <ClipboardList size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Báo cáo tổng hợp
            </h3>
            <p className="text-sm text-gray-500">
              Xem thống kê nhật ký canh tác và sự cố từ tất cả nông dân.
            </p>
          </div>
          <div
            onClick={() => onNavigate("admin_material")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-lg flex items-center justify-center mb-4">
              <Package size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Quản lý Vật tư
            </h3>
            <p className="text-sm text-gray-500">
              Theo dõi kho phân bón, thuốc trừ sâu và vật tư nông nghiệp.
            </p>
          </div>
          <div
            onClick={() => onNavigate("admin_farm")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <Building size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Thông tin Trang trại
            </h3>
            <p className="text-sm text-gray-500">
              Quản lý thông tin HTX, địa chỉ, diện tích và cây trồng chính.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

interface Plant {
  id: string;
  varietyName: string;
  plantCode: string;
  qrCode: string;
  latLng: [number, number];
}

interface LandLot {
  id: string;
  name: string;
  area: number;
  coordinates: string;
  center: { x: number; y: number };
  latLngs?: [number, number][];
  plants?: Plant[];
}

interface PlantingZone {
  id: string;
  cropType: string;
  name: string;
  lots: LandLot[];
  certificateFiles?: string[];
}

interface Farmer {
  id: string;
  admin: string;
  adminName: string;
  phone: string;
  pin: string;
  cccd: string;
  fullName: string;
  birthYear: string;
  managedLot: string;
}

const MOCK_EXTRACTED_LOTS: LandLot[] = [
  {
    id: "l1",
    name: "Lô 1",
    area: 1.2,
    coordinates: "10,10 90,10 90,60 10,60",
    center: { x: 50, y: 35 },
    latLngs: [
      [10.5, 107.4],
      [10.501, 107.4],
      [10.501, 107.401],
      [10.5, 107.401],
    ],
  },
  {
    id: "l2",
    name: "Lô 2",
    area: 0.8,
    coordinates: "100,10 180,10 180,60 100,60",
    center: { x: 140, y: 35 },
    latLngs: [
      [10.5, 107.402],
      [10.501, 107.402],
      [10.501, 107.403],
      [10.5, 107.403],
    ],
  },
  {
    id: "l3",
    name: "Lô 3",
    area: 1.5,
    coordinates: "10,70 180,70 180,140 10,140",
    center: { x: 95, y: 105 },
    latLngs: [
      [10.498, 107.4],
      [10.499, 107.4],
      [10.499, 107.403],
      [10.498, 107.403],
    ],
  },
];

// Type cast for Leaflet components to avoid TypeScript compatibility issues
const MapContainerAny = MapContainer as unknown as React.ComponentType<any>;
const TileLayerAny = TileLayer as unknown as React.ComponentType<any>;
const PolygonAny = Polygon as unknown as React.ComponentType<any>;
const MarkerAny = Marker as unknown as React.ComponentType<any>;

function FarmerManagementScreen({
  onBack,
  farmers,
  setFarmers,
  zones,
  currentUser,
}: {
  onBack: () => void;
  farmers: Farmer[];
  setFarmers: (f: Farmer[]) => void;
  zones: PlantingZone[];
  currentUser?: any;
}) {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [newFarmer, setNewFarmer] = useState<Partial<Farmer>>({});
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const apiAdmins = await adminAPI.getAdmins();
        if (Array.isArray(apiAdmins)) {
          setAdmins(apiAdmins);
        }
      } catch (error) {
        console.warn("Không thể tải danh sách HTX:", error);
      }
    };
    fetchAdmins();
  }, []);

  const handleSaveFarmer = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!newFarmer.phone || !newFarmer.fullName) {
      alert("Vui lòng nhập số điện thoại và họ tên");
      return;
    }

    const payload: any = {
      phone: newFarmer.phone,
      pin: newFarmer.pin || "0000",
      cccd: newFarmer.cccd || "",
      full_name: newFarmer.fullName,
      birth_year: newFarmer.birthYear || "",
      managed_lot: newFarmer.managedLot || "",
    };

    // Include admin based on mode
    if (view === "edit") {
      // Edit mode: use existing admin or newFarmer.admin
      if (newFarmer.admin) {
        payload.admin = newFarmer.admin;
      }
    } else {
      // Create mode: use current user's ID (they must be an admin)
      if (currentUser?.id) {
        payload.admin = currentUser.id;
      }
    }

    try {
      // Edit mode - must have a valid ID
      if (view === "edit") {
        if (!newFarmer.id) {
          alert("Lỗi: ID nông dân không hợp lệ");
          console.error("Edit mode but newFarmer.id is:", newFarmer.id);
          return;
        }

        console.log(`Updating farmer ${newFarmer.id} with:`, payload);
        const updated = await farmAPI.updateFarmer(newFarmer.id, payload);
        setFarmers(
          farmers.map((f) =>
            String(f.id) === String(newFarmer.id) ? mapApiFarmer(updated) : f,
          ),
        );
        alert("Cập nhật nông dân thành công!");
      }
      // Create mode
      else {
        console.log("Creating new farmer with:", payload);
        const created = await farmAPI.createFarmer(payload);
        const mappedFarmer = mapApiFarmer(created);
        console.log("Created farmer:", mappedFarmer);
        setFarmers([...farmers, mappedFarmer]);
        alert("Tạo nông dân thành công!");
      }

      setView("list");
      setNewFarmer({});
      setSelectedZoneId("");
    } catch (err: any) {
      console.error("Lỗi chi tiết:", err);
      setError(err?.message || "Lưu nông dân thất bại");
      alert(`Lỗi: ${err?.message || "Không thể lưu nông dân"}`);
    }
  };

  const handleDeleteFarmer = async (id: string) => {
    try {
      await farmAPI.deleteFarmer(id);
      setFarmers(farmers.filter((f) => f.id !== id));
    } catch (err: any) {
      console.warn("Không thể xóa nông dân:", err);
      setFarmers(farmers.filter((f) => f.id !== id));
    }
  };

  const handleEdit = (farmer: Farmer) => {
    console.log("Editing farmer:", farmer);
    setNewFarmer(farmer);

    // Find the zone that contains this lot
    if (farmer.managedLot) {
      const zone = zones.find((z) =>
        z.lots.some((l) => l.name === farmer.managedLot),
      );
      if (zone) {
        setSelectedZoneId(zone.id);
      }
    }

    setView("edit");
  };

  const handleCancel = () => {
    setView("list");
    setNewFarmer({});
    setSelectedZoneId("");
  };

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button
          onClick={view === "list" ? onBack : () => setView("list")}
          className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Nông dân</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        {view === "list" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Danh sách Nông dân
              </h2>
              <button
                onClick={() => setView("add")}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} /> Thêm mới
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="p-4 font-medium whitespace-nowrap">
                        Họ và tên
                      </th>
                      <th className="p-4 font-medium whitespace-nowrap">SĐT</th>
                      <th className="p-4 font-medium whitespace-nowrap">
                        CCCD
                      </th>
                      <th className="p-4 font-medium whitespace-nowrap">
                        Năm sinh
                      </th>
                      <th className="p-4 font-medium whitespace-nowrap">
                        Lô quản lý
                      </th>
                      <th className="p-4 font-medium text-right whitespace-nowrap">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {farmers.map((farmer) => (
                      <tr
                        key={farmer.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                          {farmer.fullName}
                        </td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          {farmer.phone}
                        </td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          {farmer.cccd}
                        </td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          {farmer.birthYear}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                            {farmer.managedLot}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            className="text-blue-500 hover:text-blue-700 p-2 mr-2"
                            onClick={() => handleEdit(farmer)}
                          >
                            <Settings size={18} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 p-2"
                            onClick={() => handleDeleteFarmer(farmer.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {farmers.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-gray-500"
                        >
                          Chưa có nông dân nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {view === "edit" ? "Sửa thông tin Nông dân" : "Thêm Nông dân mới"}
            </h2>
            <form onSubmit={handleSaveFarmer} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newFarmer.fullName || ""}
                    onChange={(e) =>
                      setNewFarmer({ ...newFarmer, fullName: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={newFarmer.phone || ""}
                    onChange={(e) =>
                      setNewFarmer({ ...newFarmer, phone: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="SĐT đăng nhập"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã PIN (4 số) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    pattern="\d{4}"
                    value={newFarmer.pin || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);
                      setNewFarmer({ ...newFarmer, pin: value });
                    }}
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số CCCD
                  </label>
                  <input
                    type="text"
                    value={newFarmer.cccd || ""}
                    onChange={(e) =>
                      setNewFarmer({ ...newFarmer, cccd: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Nhập CCCD"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Năm sinh
                  </label>
                  <input
                    type="number"
                    value={newFarmer.birthYear || ""}
                    onChange={(e) =>
                      setNewFarmer({ ...newFarmer, birthYear: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="VD: 1980"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vùng trồng
                  </label>
                  <select
                    value={selectedZoneId || ""}
                    onChange={(e) => {
                      setSelectedZoneId(e.target.value);
                      // Reset managed lot when zone changes
                      setNewFarmer({ ...newFarmer, managedLot: "" });
                    }}
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="">-- Chọn vùng trồng --</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} ({zone.cropType})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lô đất quản lý
                  </label>
                  <select
                    value={newFarmer.managedLot || ""}
                    onChange={(e) =>
                      setNewFarmer({ ...newFarmer, managedLot: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    disabled={!selectedZoneId}
                  >
                    <option value="">Chọn lô đất</option>
                    {selectedZone?.lots.map((lot) => (
                      <option key={lot.id} value={lot.name}>
                        {lot.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                >
                  Lưu Nông dân
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapEvents({ onClick }: { onClick: (e: any) => void }) {
  useMapEvents({
    click(e: any) {
      onClick(e);
    },
  });
  return null;
}

function DrawMapScreen({
  onSave,
  onCancel,
}: {
  onSave: (lots: LandLot[]) => void;
  onCancel: () => void;
}) {
  const [lots, setLots] = useState<LandLot[]>([]);
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([10.5, 107.4]);
  const [isLocating, setIsLocating] = useState(false);

  const handleMapClick = (e: any) => {
    setCurrentPoints([...currentPoints, [e.latlng.lat, e.latlng.lng]]);
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.",
          );
          setIsLocating(false);
        },
      );
    } else {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      setIsLocating(false);
    }
  };

  const handleFinishLot = () => {
    if (currentPoints.length < 3) {
      alert("Cần ít nhất 3 điểm để tạo thành một lô đất.");
      return;
    }

    const area = currentPoints.length * 0.5;

    const newLot: LandLot = {
      id: `lot_${Date.now()}`,
      name: `Lô ${lots.length + 1}`,
      area: parseFloat(area.toFixed(1)),
      coordinates: currentPoints.map((p) => `${p[0]},${p[1]}`).join(" "),
      center: { x: currentPoints[0][0], y: currentPoints[0][1] },
      latLngs: currentPoints,
    };

    setLots([...lots, newLot]);
    setCurrentPoints([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Vẽ bản đồ thủ công</h2>
        <div className="flex gap-2">
          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2 text-sm"
          >
            {isLocating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <MapPin size={16} />
            )}
            Định vị GPS
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-4">
        Nhấn vào bản đồ để thêm các điểm góc ranh của lô đất. Cần ít nhất 3 điểm
        để tạo thành một lô.
      </p>

      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 mb-4 relative">
        <MapContainerAny
          center={mapCenter}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayerAny
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={22}
            maxNativeZoom={19}
          />
          <MapUpdater center={mapCenter} />
          <MapEvents onClick={handleMapClick} />

          {lots.map(
            (lot) =>
              lot.latLngs && (
                <PolygonAny
                  key={lot.id}
                  positions={lot.latLngs}
                  color="#10b981"
                  fillColor="#10b981"
                  fillOpacity={0.4}
                >
                  <Popup>{lot.name}</Popup>
                </PolygonAny>
              ),
          )}

          {currentPoints.length > 0 && (
            <PolygonAny
              positions={currentPoints}
              color="#3b82f6"
              fillColor="#3b82f6"
              fillOpacity={0.4}
              dashArray="5, 5"
            />
          )}

          {currentPoints.map((p, i) => (
            <MarkerAny key={i} position={p} />
          ))}
        </MapContainerAny>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-white p-2 rounded-xl shadow-lg border border-gray-200 flex gap-2">
          <button
            onClick={() => setCurrentPoints(currentPoints.slice(0, -1))}
            disabled={currentPoints.length === 0}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            Xóa điểm cuối
          </button>
          <button
            onClick={handleFinishLot}
            disabled={currentPoints.length < 3}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            Hoàn thành lô này
          </button>
        </div>
      </div>

      {lots.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-2">
            Các lô đã vẽ ({lots.length}):
          </h3>
          <div className="flex flex-wrap gap-2">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
              >
                {lot.name}
                <button
                  onClick={() => setLots(lots.filter((l) => l.id !== lot.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={() => onSave(lots)}
          disabled={lots.length === 0}
          className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          Lưu bản đồ ({lots.length} lô)
        </button>
      </div>
    </div>
  );
}

function LotDetailManagementScreen({
  zone,
  lot,
  onBack,
  onUpdateLot,
  farmers,
  currentUser,
}: {
  zone: PlantingZone;
  lot: LandLot;
  onBack: () => void;
  onUpdateLot: (updatedLot: LandLot) => void;
  farmers: Farmer[];
  currentUser?: { name: string; role?: string } | null;
}) {
  const [plants, setPlants] = useState<Plant[]>(lot.plants || []);
  const [isAddingPlant, setIsAddingPlant] = useState(false);
  const [newPlant, setNewPlant] = useState({
    varietyName: zone.cropType,
    plantCode: "",
    latLng: [0, 0] as [number, number],
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    lot.latLngs?.[0] || [10.5, 107.4],
  );
  const [previewPlant, setPreviewPlant] = useState<Plant | null>(null);

  const owner =
    farmers.find((f) => f.managedLot === lot.id)?.fullName ||
    "Chưa có chủ sở hữu";
  const htxName = currentUser?.name || "HTX";

  const handleMapClick = (e: any) => {
    if (isAddingPlant) {
      setNewPlant({ ...newPlant, latLng: [e.latlng.lat, e.latlng.lng] });
    }
  };

  const handleAddPlant = () => {
    if (!newPlant.plantCode) return;
    const plant: Plant = {
      id: Date.now().toString(),
      varietyName: newPlant.varietyName,
      plantCode: newPlant.plantCode,
      qrCode: `QR-${newPlant.plantCode}-${Date.now()}`,
      latLng: newPlant.latLng,
    };
    const updatedPlants = [...plants, plant];
    setPlants(updatedPlants);
    onUpdateLot({ ...lot, plants: updatedPlants });
    setIsAddingPlant(false);
    setNewPlant({ varietyName: zone.cropType, plantCode: "", latLng: [0, 0] });
  };

  const handleDeletePlant = (id: string) => {
    const updatedPlants = plants.filter((p) => p.id !== id);
    setPlants(updatedPlants);
    onUpdateLot({ ...lot, plants: updatedPlants });
  };

  const handlePrintQR = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Quản lý lô: {lot.name}
          </h2>
          <p className="text-sm text-gray-500">
            Vùng trồng: {zone.name} • Diện tích: {lot.area} ha
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              Bản đồ quy hoạch cây trồng
            </h3>
            <button
              onClick={() => setIsAddingPlant(!isAddingPlant)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                isAddingPlant
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              {isAddingPlant ? (
                <>
                  <X size={16} /> Hủy thêm
                </>
              ) : (
                <>
                  <Plus size={16} /> Thêm cây
                </>
              )}
            </button>
          </div>

          {isAddingPlant && (
            <div className="p-3 bg-blue-50 border-b border-blue-100 text-blue-800 text-sm flex items-start gap-2">
              <MapPin size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Chế độ thêm cây trồng</p>
                <p>1. Click vào bản đồ để chọn vị trí cây.</p>
                <p>2. Nhập thông tin cây ở cột bên phải.</p>
              </div>
            </div>
          )}

          <div className="h-[500px] w-full relative">
            <MapContainerAny
              center={mapCenter}
              zoom={18}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayerAny
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={22}
                maxNativeZoom={19}
              />
              <MapEvents onClick={handleMapClick} />

              {lot.latLngs && (
                <PolygonAny
                  positions={lot.latLngs}
                  color="#10b981"
                  fillColor="#10b981"
                  fillOpacity={0.1}
                  weight={2}
                />
              )}

              {plants.map((plant) => (
                <MarkerAny key={plant.id} position={plant.latLng}>
                  <Popup>
                    <div className="font-bold text-emerald-800">
                      {plant.plantCode}
                    </div>
                    <div className="text-sm mb-1">
                      Giống: {plant.varietyName}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 break-all">
                      QR: {plant.qrCode}
                    </div>
                    <button
                      onClick={() => handleDeletePlant(plant.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Xóa cây này
                    </button>
                  </Popup>
                </MarkerAny>
              ))}

              {isAddingPlant && newPlant.latLng[0] !== 0 && (
                <MarkerAny position={newPlant.latLng} opacity={0.6}>
                  <Popup>Vị trí đang chọn</Popup>
                </MarkerAny>
              )}
            </MapContainerAny>
          </div>
        </div>

        <div className="space-y-6">
          {isAddingPlant && newPlant.latLng[0] !== 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-200">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Sprout size={20} /> Thông tin cây mới
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên giống
                  </label>
                  <input
                    type="text"
                    value={newPlant.varietyName}
                    onChange={(e) =>
                      setNewPlant({ ...newPlant, varietyName: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã số cây <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPlant.plantCode}
                    onChange={(e) =>
                      setNewPlant({ ...newPlant, plantCode: e.target.value })
                    }
                    placeholder="VD: SR-001"
                    className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleAddPlant}
                    disabled={!newPlant.plantCode}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Lưu cây trồng
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Danh sách cây ({plants.length})</span>
            </h3>

            {plants.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                Chưa có cây nào trong lô này.
                <br />
                Nhấn "Thêm cây" để bắt đầu quy hoạch.
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {plants.map((plant) => (
                  <div
                    key={plant.id}
                    className="p-3 border border-gray-100 rounded-lg hover:border-emerald-200 transition-colors bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-emerald-700">
                        {plant.plantCode}
                      </span>
                      <button
                        onClick={() => handleDeletePlant(plant.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Giống: {plant.varietyName}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="bg-white p-1 rounded border border-gray-200 flex-shrink-0">
                          <QRCode value={plant.qrCode} size={40} />
                        </div>
                        <div
                          className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded truncate min-w-0"
                          title={plant.qrCode}
                        >
                          {plant.qrCode}
                        </div>
                      </div>
                      <button
                        onClick={() => setPreviewPlant(plant)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 flex-shrink-0"
                      >
                        <ScanLine size={12} /> Xem & In QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Preview Modal */}
      {previewPlant && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Xem trước mã QR</h3>
              <button
                onClick={() => setPreviewPlant(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center justify-center bg-gray-50 print:bg-white print:p-0">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center print:shadow-none print:border-none print:p-4 w-full">
                <h4 className="font-bold text-xl text-gray-900 mb-1">
                  {previewPlant.plantCode}
                </h4>
                <p className="text-sm font-medium text-emerald-700 mb-4">
                  {previewPlant.varietyName}
                </p>

                <div className="bg-white p-2 inline-block rounded-lg border border-gray-100 mb-4">
                  <QRCode value={previewPlant.qrCode} size={200} />
                </div>

                <div className="text-left text-sm text-gray-700 space-y-1 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-200">
                  <p>
                    <span className="text-gray-500">Lô:</span>{" "}
                    <span className="font-medium">{lot.name}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Chủ sở hữu:</span>{" "}
                    <span className="font-medium">{owner}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Vùng trồng:</span>{" "}
                    <span className="font-medium">
                      {zone.name} ({zone.id})
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">HTX:</span>{" "}
                    <span className="font-medium">{htxName}</span>
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-4 font-mono">
                  {previewPlant.qrCode}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex gap-3 print:hidden">
              <button
                onClick={() => setPreviewPlant(null)}
                className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handlePrintQR}
                className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} /> In mã QR này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LandManagementScreen({
  onBack,
  zones,
  setZones,
  farmers,
  currentUser,
}: {
  onBack: () => void;
  zones: PlantingZone[];
  setZones: (z: PlantingZone[]) => void;
  farmers: Farmer[];
  currentUser?: { id?: string | number; name: string; role?: string } | null;
}) {
  const [view, setView] = useState<
    | "list"
    | "add_info"
    | "add_upload"
    | "add_extracting"
    | "add_preview"
    | "lot_detail"
    | "add_draw_map"
    | "add_extraction_error"
  >("list");
  const [newZone, setNewZone] = useState({ cropType: "Sầu riêng", name: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedLots, setExtractedLots] =
    useState<LandLot[]>(MOCK_EXTRACTED_LOTS);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploadingCert, setUploadingCert] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const handleCertificateSubmit = async () => {
    if (!certificateFile) {
      alert("Vui lòng chọn file");
      return;
    }
    setUploadingCert(true);
    try {
      alert(
        "Tạm thời không trích xuất được. Vui lòng liên hệ admin để xử lý thủ công.",
      );
      setCertificateFile(null);
    } catch (error: any) {
      console.error("Lỗi upload:", error);
      alert("Upload thất bại");
    } finally {
      setUploadingCert(false);
    }
  };

  const startExtraction = async () => {
    if (!files || files.length === 0) {
      setExtractionError("Vui lòng chọn ít nhất 1 file để trích xuất toạ độ.");
      setView("add_extraction_error");
      return;
    }

    setExtractionError(null);
    setView("add_extracting");

    // Simulate API call to extract coordinates from files
    // In production, this should call: await farmAPI.extractCoordinates(files)
    setTimeout(() => {
      try {
        // Mock extraction: currently returns MOCK_EXTRACTED_LOTS
        // In real implementation, this would parse PDF/images and extract coordinates
        const extractedData = MOCK_EXTRACTED_LOTS;

        if (!extractedData || extractedData.length === 0) {
          throw new Error(
            "Không thể trích xuất danh sách toạ độ từ tài liệu upload. Vui lòng kiểm tra file có chứa bảng toạ độ VN-2000 không.",
          );
        }

        setExtractedLots(extractedData);
        setView("add_preview");
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          "Lỗi khi trích xuất toạ độ. Vui lòng thử lại hoặc chọn file khác.";
        setExtractionError(errorMessage);
        setView("add_extraction_error");
      }
    }, 2500);
  };

  const handleDrawMapDirectSave = async (drawnLots: LandLot[]) => {
    if (drawnLots.length === 0) {
      alert("Vui lòng vẽ ít nhất 1 lô đất");
      return;
    }

    setIsLoading(true);
    try {
      // Save directly from manual map drawing - no preview step
      const payload: any = {
        crop_type: newZone.cropType,
        name: newZone.name,
        lots: drawnLots, // Already includes latLngs from manual drawing
      };
      // Add admin to ensure data belongs to current HTX
      if (currentUser?.id) {
        payload.admin = currentUser.id;
      }
      const createdZone = await farmAPI.createPlantingZone(payload);
      const zone: PlantingZone = mapApiZone(createdZone);
      setZones([...zones, zone]);
      setView("list");
      setNewZone({ cropType: "Sầu riêng", name: "" });
      setExtractedLots(MOCK_EXTRACTED_LOTS);
      alert("Tạo vùng trồng thành công!");
    } catch (error) {
      console.warn("Không thể lưu vùng trồng từ bản đồ:", error);
      alert("Lưu vùng trồng thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawMapSave = (drawnLots: LandLot[]) => {
    handleDrawMapDirectSave(drawnLots);
  };

  const confirmAndSave = async () => {
    // Used only for Upload method - shows preview first
    const formData = new FormData();
    formData.append("crop_type", newZone.cropType);
    formData.append("name", newZone.name);
    formData.append("lots", JSON.stringify(extractedLots));
    // Add admin to ensure data belongs to current HTX
    if (currentUser?.id) {
      formData.append("admin", String(currentUser.id));
    }
    files.forEach((file) => formData.append("certificate_files", file));

    try {
      setIsLoading(true);
      const createdZone = await farmAPI.createPlantingZone(formData);
      const zone: PlantingZone = mapApiZone(createdZone);
      setZones([...zones, zone]);
      setView("list");
      setNewZone({ cropType: "Sầu riêng", name: "" });
      setFiles([]);
      setExtractedLots(MOCK_EXTRACTED_LOTS);
      alert("Tạo vùng trồng thành công!");
    } catch (error) {
      console.warn("Không thể lưu vùng trồng:", error);
      alert("Lưu vùng trồng thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button
          onClick={view === "list" ? onBack : () => setView("list")}
          className="p-1 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Mã vùng trồng</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        {view === "list" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                Danh sách Mã vùng trồng
              </h2>
              <button
                onClick={() => setView("add_info")}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} /> Thêm vùng trồng
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={32} className="animate-spin text-emerald-600" />
              </div>
            ) : zones.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                <MapIcon className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Chưa có mã vùng trồng nào.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Hãy thêm vùng trồng và upload sổ đỏ để hệ thống tự động vẽ bản
                  đồ.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                            Cây trồng: {zone.cropType}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {zone.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tổng diện tích</p>
                        <p className="font-bold text-emerald-600">
                          {zone.lots
                            .reduce((acc, lot) => acc + lot.area, 0)
                            .toFixed(1)}{" "}
                          ha
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Danh sách lô đất ({zone.lots.length}):
                      </p>
                      <div className="flex flex-col gap-2 mb-4">
                        {zone.lots.map((lot) => (
                          <div
                            key={lot.id}
                            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-700 text-sm font-medium">
                                {lot.name} ({lot.area} ha)
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedZoneId(zone.id);
                                  setSelectedLotId(lot.id);
                                  setView("lot_detail");
                                }}
                                className="text-emerald-600 hover:bg-emerald-100 px-3 py-1 rounded text-xs font-medium transition-colors"
                              >
                                Quản lý chi tiết
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden opacity-60">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Upload size={18} className="text-gray-400" />
                  Tải lên Giấy chứng nhận QSDĐ
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn file giấy chứng nhận
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      disabled
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Hỗ trợ: PDF, JPG, PNG
                  </p>
                </div>
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-2.5 rounded-lg font-medium cursor-not-allowed"
                >
                  Tải lên
                </button>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  ⚠️{" "}
                  <span className="font-medium">
                    Tạm thời không trích xuất được.
                  </span>{" "}
                  Vui lòng liên hệ admin để xử lý thủ công.
                </div>
              </div>
            </div> */}
          </div>
        )}

        {view === "add_info" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thông tin Vùng trồng
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại cây trồng <span className="text-red-500">*</span>
                </label>
                <select
                  value={newZone.cropType}
                  onChange={(e) =>
                    setNewZone({ ...newZone, cropType: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Sầu riêng">Sầu riêng</option>
                  <option value="Cà phê">Cà phê</option>
                  <option value="Hồ tiêu">Hồ tiêu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên vùng trồng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newZone.name}
                  onChange={(e) =>
                    setNewZone({ ...newZone, name: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="VD: Vùng trồng Sầu riêng Xuyên Mộc"
                />
              </div>
              <button
                onClick={() => setView("add_upload")}
                disabled={!newZone.cropType || !newZone.name}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 mt-4"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {view === "add_upload" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Upload Giấy chứng nhận QSDĐ
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Tải lên các trang sổ đỏ có chứa bảng toạ độ góc ranh (VN-2000) của
              các lô đất thuộc vùng trồng này.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800">
                <span className="font-medium">
                  ⚠️ Tạm thời không trích xuất được.
                </span>
              </p>
              <p className="text-xs text-amber-700 mt-2">
                Chức năng tải lên và tự động trích xuất toạ độ từ giấy chứng
                nhận QSDĐ sẽ sớm có.
              </p>
            </div>

            <label className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 cursor-not-allowed mb-6 opacity-50">
              <Upload size={40} className="mb-3 text-gray-400" />
              <span className="font-medium mb-1">Nhấn để chọn file</span>
              <span className="text-xs opacity-70">
                Hỗ trợ PDF, JPG, PNG (Có thể chọn nhiều file)
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,image/*"
                className="hidden"
                disabled
              />
            </label>

            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 rounded-xl font-medium cursor-not-allowed mb-4"
            >
              Xử lý & Trích xuất toạ độ
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <button
              onClick={() => setView("add_draw_map")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin size={20} /> Vẽ bản đồ thủ công
            </button>
          </div>
        )}

        {view === "add_draw_map" && (
          <DrawMapScreen
            onSave={handleDrawMapSave}
            onCancel={() => setView("add_upload")}
          />
        )}

        {view === "add_extracting" && (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center flex flex-col items-center justify-center">
            <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Đang phân tích tài liệu...
            </h2>
            <p className="text-gray-500 text-sm">
              Hệ thống AI đang đọc giấy chứng nhận và trích xuất danh sách toạ
              độ VN-2000 để vẽ bản đồ.
            </p>
          </div>
        )}

        {view === "add_extraction_error" && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertCircle size={40} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Lỗi trích xuất toạ độ
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {extractionError ||
                "Không thể trích xuất danh sách toạ độ từ tài liệu upload. Vui lòng kiểm tra lại:"}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Các nguyên nhân có thể:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>File upload không chứa bảng toạ độ góc ranh</li>
                <li>File bị hỏng hoặc không đúng định dạng PDF/JPG/PNG</li>
                <li>
                  Chất lượng ảnh quá kém để nhận dạng (upload ảnh chụp rõ hơn)
                </li>
                <li>Toạ độ không phải định dạng VN-2000 tiêu chuẩn</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setView("add_upload");
                  setExtractionError(null);
                  setFiles([]);
                }}
                className="flex-1 bg-red-100 text-red-700 py-3 rounded-xl font-medium hover:bg-red-200 transition-colors"
              >
                Thử lại với file khác
              </button>
              <button
                onClick={() => {
                  setView("add_upload");
                  setExtractionError(null);
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Vẽ bản đồ thủ công
              </button>
            </div>
          </div>
        )}

        {view === "add_preview" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Xác nhận Bản đồ Vùng trồng
                </h2>
                <p className="text-gray-500 text-sm">
                  Hệ thống đã nhận diện được {extractedLots.length} lô đất từ
                  tài liệu.
                </p>
              </div>
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg font-bold">
                {newZone.cropType}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <div className="p-3 bg-gray-100 border-b border-gray-200 font-medium text-sm text-gray-700 flex items-center gap-2">
                  <MapIcon size={16} /> Bản đồ mô phỏng
                </div>
                <div className="p-4 aspect-video flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 160"
                    className="w-full h-full drop-shadow-sm"
                  >
                    {extractedLots.map((lot) => (
                      <g key={lot.id}>
                        <polygon
                          points={lot.coordinates}
                          className="fill-emerald-200 stroke-emerald-600 stroke-[1.5] hover:fill-emerald-300 transition-colors cursor-pointer"
                        />
                        <text
                          x={lot.center.x}
                          y={lot.center.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-[8px] font-bold fill-emerald-900 pointer-events-none"
                        >
                          {lot.name}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-3">
                  Danh sách lô đất trích xuất:
                </h3>
                <div className="space-y-3 mb-6">
                  {extractedLots.map((lot) => (
                    <div
                      key={lot.id}
                      className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded flex items-center justify-center font-bold text-sm">
                            {lot.name.replace("Lô ", "")}
                          </div>
                          <span className="font-medium text-gray-800">
                            {lot.name}
                          </span>
                        </div>
                        <span className="text-emerald-600 font-bold">
                          {lot.area} ha
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100 mb-6">
                  <span className="font-medium text-emerald-800">
                    Tổng diện tích:
                  </span>
                  <span className="font-bold text-xl text-emerald-600">
                    {extractedLots
                      .reduce((acc, lot) => acc + lot.area, 0)
                      .toFixed(1)}{" "}
                    ha
                  </span>
                </div>

                <button
                  onClick={confirmAndSave}
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle size={20} /> Xác nhận & Lưu vùng trồng
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "lot_detail" && selectedZoneId && selectedLotId && (
          <LotDetailManagementScreen
            zone={zones.find((z) => z.id === selectedZoneId)!}
            lot={
              zones
                .find((z) => z.id === selectedZoneId)!
                .lots.find((l) => l.id === selectedLotId)!
            }
            onBack={() => setView("list")}
            farmers={farmers}
            currentUser={currentUser}
            onUpdateLot={(updatedLot: LandLot) => {
              setZones(
                zones.map((z) => {
                  if (z.id === selectedZoneId) {
                    return {
                      ...z,
                      lots: z.lots.map((l) =>
                        l.id === selectedLotId ? updatedLot : l,
                      ),
                    };
                  }
                  return z;
                }),
              );
            }}
          />
        )}
      </main>
    </div>
  );
}

function ReportManagementScreen({
  onBack,
  logs,
  incidentReports,
}: {
  onBack: () => void;
  logs: FarmLog[];
  incidentReports: IncidentReport[];
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Báo cáo tổng hợp</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />

        <div className="flex justify-end mb-4">
          <button
            onClick={() => window.print()}
            className="print:hidden flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
          >
            <Printer size={16} />
            Xuất PDF toàn bộ báo cáo
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Nhật ký canh tác toàn HTX
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium whitespace-nowrap">
                    Thời gian
                  </th>
                  <th className="p-4 font-medium whitespace-nowrap">
                    Nông dân
                  </th>
                  <th className="p-4 font-medium whitespace-nowrap">Lô đất</th>
                  <th className="p-4 font-medium whitespace-nowrap">
                    Công việc
                  </th>
                  <th className="p-4 font-medium min-w-[200px]">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => navigate(`/admin/report/log/${log.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {new Date(log.datetime).toLocaleDateString("vi-VN")}{" "}
                      {new Date(log.datetime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                      {log.executor}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                        {log.lot}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800 whitespace-nowrap">
                      {log.task}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {log.fertilizer && (
                        <div>
                          Phân bón: {log.fertilizer} ({log.dosage})
                        </div>
                      )}
                      {log.pest && <div>Sâu bệnh: {log.pest}</div>}
                      {log.method && <div>Phương pháp: {log.method}</div>}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Chưa có nhật ký nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Báo cáo sự cố từ Nông dân
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium whitespace-nowrap">
                    Thời gian
                  </th>
                  <th className="p-4 font-medium whitespace-nowrap">
                    Nông dân
                  </th>
                  <th className="p-4 font-medium whitespace-nowrap">Lô đất</th>
                  <th className="p-4 font-medium whitespace-nowrap">
                    Loại sự cố
                  </th>
                  <th className="p-4 font-medium min-w-[200px]">Mô tả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {incidentReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() =>
                      navigate(`/admin/report/incident/${report.id}`)
                    }
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {new Date(report.datetime).toLocaleDateString("vi-VN")}{" "}
                      {new Date(report.datetime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                      {report.executor}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                        {report.lot}
                      </span>
                    </td>
                    <td className="p-4 text-amber-600 font-medium whitespace-nowrap">
                      {report.reportType}
                    </td>
                    <td className="p-4 text-gray-700 text-sm">
                      {report.description}
                    </td>
                  </tr>
                ))}
                {incidentReports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Chưa có báo cáo sự cố nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

interface Material {
  id: string;
  name: string;
  type: "Phân bón" | "Thuốc BVTV" | "Khác";
  activeIngredient: string;
  isVietGAP: boolean;
  unit: string;
  quantity: number;
}

function ProcessManagementScreen({
  onBack,
  tasksConfig,
  setTasksConfig,
  taskCategories,
  setTaskCategories,
  currentUser,
}: {
  onBack: () => void;
  tasksConfig: TaskConfig[];
  setTasksConfig: React.Dispatch<React.SetStateAction<TaskConfig[]>>;
  taskCategories: TaskCategory[];
  setTaskCategories: React.Dispatch<React.SetStateAction<TaskCategory[]>>;
  currentUser?: any;
}) {
  const [view, setView] = useState<"list" | "edit" | "add">("list");
  const [currentTask, setCurrentTask] = useState<TaskConfig | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    taskCategories[0]?.id || "",
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!selectedCategoryId && taskCategories.length > 0) {
      setSelectedCategoryId(taskCategories[0].id);
    }
  }, [taskCategories, selectedCategoryId]);

  const handleEdit = (task: TaskConfig) => {
    setCurrentTask(task);
    setView("edit");
  };

  const handleAdd = () => {
    const categoryId = taskCategories[0]?.id || "";
    setCurrentTask({
      id: `task_${Date.now()}`,
      name: "",
      icon: Leaf,
      color: "bg-emerald-100 text-emerald-600",
      requiresMaterials: false,
      defaultValues: { task: "" },
    });
    setSelectedCategoryId(categoryId);
    setView("add");
  };

  const handleDelete = async () => {
    if (!currentTask) return;

    try {
      await farmAPI.deleteTask(currentTask.id);
    } catch (error) {
      console.warn("Không thể xóa công việc từ backend:", error);
    }

    const updatedCategories = taskCategories.map((cat) => ({
      ...cat,
      taskIds: cat.taskIds.filter((id) => id !== currentTask.id),
    }));

    setTasksConfig(tasksConfig.filter((t) => t.id !== currentTask.id));
    setTaskCategories(updatedCategories);
    setView("list");
    setCurrentTask(null);
    setShowDeleteConfirm(false);

    updatedCategories.forEach(async (cat) => {
      try {
        await farmAPI.updateTaskCategory(cat.id, { task_ids: cat.taskIds });
      } catch (error) {
        console.warn("Không thể cập nhật nhóm công việc sau khi xóa:", error);
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask) return;

    const taskPayload = {
      name: currentTask.name,
      icon:
        currentTask.iconName ||
        (typeof currentTask.icon === "function"
          ? currentTask.icon.name
          : typeof currentTask.icon === "string"
            ? currentTask.icon
            : "Leaf"),
      color: currentTask.color,
      requires_materials: currentTask.requiresMaterials,
      default_values: currentTask.defaultValues,
      admin: currentUser?.id,
    };

    if (view === "add") {
      try {
        const createdTask = await farmAPI.createTask(taskPayload);
        const normalizedTask = normalizeTaskConfig(createdTask);
        const newTaskId = normalizedTask.id;

        setTasksConfig((prev) => [...prev, normalizedTask]);

        const selectedCategory = taskCategories.find(
          (cat) => cat.id === selectedCategoryId,
        );
        if (selectedCategory) {
          const updatedTaskIds = [...selectedCategory.taskIds, newTaskId];
          setTaskCategories(
            taskCategories.map((cat) =>
              cat.id === selectedCategory.id
                ? { ...cat, taskIds: updatedTaskIds }
                : cat,
            ),
          );
          try {
            await farmAPI.updateTaskCategory(selectedCategory.id, {
              task_ids: updatedTaskIds,
            });
          } catch (error) {
            console.warn(
              "Không thể cập nhật nhóm quy trình trong backend:",
              error,
            );
          }
        } else {
          const newCategoryName = "Nhóm mặc định";
          try {
            const createdCategory = await farmAPI.createTaskCategory({
              name: newCategoryName,
              task_ids: [newTaskId],
            });
            setTaskCategories(
              (prev) =>
                [
                  ...prev,
                  {
                    id: String(createdCategory.id),
                    name: createdCategory.name || newCategoryName,
                    taskIds: Array.isArray(createdCategory.task_ids)
                      ? createdCategory.task_ids.map(String)
                      : [newTaskId],
                  },
                ] as TaskCategory[],
            );
          } catch (error) {
            console.warn("Không thể tạo nhóm quy trình trong backend:", error);
            setTaskCategories(
              (prev) =>
                [
                  ...prev,
                  {
                    id: `category_${Date.now()}`,
                    name: newCategoryName,
                    taskIds: [newTaskId],
                  },
                ] as TaskCategory[],
            );
          }
        }
        alert("Thêm quy trình thành công!");
      } catch (error: any) {
        console.error("Không thể tạo công việc mới trong backend:", error);
        alert(error?.message || "Thêm quy trình thất bại. Vui lòng thử lại.");
        return;
      }
    } else {
      try {
        const updatedTask = await farmAPI.updateTask(
          currentTask.id,
          taskPayload,
        );
        const normalizedTask = normalizeTaskConfig(updatedTask);
        setTasksConfig(
          tasksConfig.map((t) =>
            t.id === currentTask.id ? normalizedTask : t,
          ),
        );
        alert("Cập nhật quy trình thành công!");
      } catch (error: any) {
        console.error("Không thể cập nhật công việc trong backend:", error);
        alert(error?.message || "Cập nhật quy trình thất bại. Vui lòng thử lại.");
        setTasksConfig(
          tasksConfig.map((t) => (t.id === currentTask.id ? currentTask : t)),
        );
        return;
      }
    }

    setView("list");
    setCurrentTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button
          onClick={view === "list" ? onBack : () => setView("list")}
          className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Quy trình</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        {view === "list" ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-800">
                Cấu hình Nhật ký Canh tác
              </h2>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                Thêm quy trình
              </button>
            </div>

            {taskCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700">{category.name}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {category.taskIds.map((taskId) => {
                    const task = tasksConfig.find((t) => t.id === taskId);
                    if (!task) return null;
                    const Icon = task.icon;
                    return (
                      <div
                        key={task.id}
                        className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${task.color}`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {task.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {task.requiresMaterials
                                ? "Có sử dụng vật tư/thuốc"
                                : "Không dùng vật tư"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-sm px-3 py-1.5 rounded hover:bg-emerald-50 transition-colors"
                        >
                          Cấu hình
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          currentTask && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {view === "add"
                  ? "Thêm quy trình mới"
                  : `Cấu hình: ${currentTask.name}`}
              </h2>
              <form onSubmit={handleSave} className="space-y-5">
                {view === "add" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhóm quy trình <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {taskCategories.length === 0 ? (
                        <option value="">Chưa có nhóm quy trình</option>
                      ) : (
                        taskCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên quy trình <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentTask.name}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        name: e.target.value,
                        defaultValues: {
                          ...currentTask.defaultValues,
                          task: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <input
                    type="checkbox"
                    id="requiresMaterials"
                    checked={currentTask.requiresMaterials}
                    onChange={(e) =>
                      setCurrentTask({
                        ...currentTask,
                        requiresMaterials: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="requiresMaterials"
                    className="font-medium text-emerald-800 cursor-pointer"
                  >
                    Quy trình này có sử dụng Vật tư / Phân bón / Thuốc
                  </label>
                </div>

                {currentTask.requiresMaterials && (
                  <div className="space-y-4 border-t border-gray-100 pt-4">
                    <h3 className="font-medium text-gray-800">
                      Giá trị mặc định (Gợi ý cho nông dân)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Đối tượng gây hại (Sâu bệnh)
                        </label>
                        <input
                          type="text"
                          value={currentTask.defaultValues.pest || ""}
                          onChange={(e) =>
                            setCurrentTask({
                              ...currentTask,
                              defaultValues: {
                                ...currentTask.defaultValues,
                                pest: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="VD: Rầy xanh, Nhện đỏ..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên thuốc / Biện pháp
                        </label>
                        <input
                          type="text"
                          value={currentTask.defaultValues.method || ""}
                          onChange={(e) =>
                            setCurrentTask({
                              ...currentTask,
                              defaultValues: {
                                ...currentTask.defaultValues,
                                method: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="VD: Champion, Najat 3.6..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phân bón
                        </label>
                        <input
                          type="text"
                          value={currentTask.defaultValues.fertilizer || ""}
                          onChange={(e) =>
                            setCurrentTask({
                              ...currentTask,
                              defaultValues: {
                                ...currentTask.defaultValues,
                                fertilizer: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="VD: Phân gà, NPK..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hoạt chất
                        </label>
                        <input
                          type="text"
                          value={
                            currentTask.defaultValues.activeIngredient || ""
                          }
                          onChange={(e) =>
                            setCurrentTask({
                              ...currentTask,
                              defaultValues: {
                                ...currentTask.defaultValues,
                                activeIngredient: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="VD: Abamectin..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Liều lượng
                        </label>
                        <input
                          type="text"
                          value={currentTask.defaultValues.dosage || ""}
                          onChange={(e) =>
                            setCurrentTask({
                              ...currentTask,
                              defaultValues: {
                                ...currentTask.defaultValues,
                                dosage: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="VD: 800ml/800L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thời gian cách ly
                        </label>
                        <input
                          type="text"
                          value={currentTask.defaultValues.quarantineTime || ""}
                          onChange={(e) =>
                            setCurrentTask({
                              ...currentTask,
                              defaultValues: {
                                ...currentTask.defaultValues,
                                quarantineTime: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="VD: 7 Ngày"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                  {view === "edit" ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                      Xóa
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setView("list")}
                      className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                    >
                      Lưu Cấu hình
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-gray-900">
                  Xác nhận xóa
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa quy trình{" "}
                <strong>{currentTask?.name}</strong>? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                >
                  Xóa Quy trình
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FarmInformationScreen({
  onBack,
  farm,
  setFarm,
  currentUser,
}: {
  onBack: () => void;
  farm: Farm | null;
  setFarm: (farm: Farm | null) => void;
  currentUser: { id?: string | number; name: string } | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Farm>>({});

  useEffect(() => {
    const fetchFarmInfo = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await farmAPI.getFarmByAdmin(String(currentUser.id));
        if (response) {
          setFarm(mapApiFarm(response));
          setFormData(mapApiFarm(response));
        }
      } catch (error: any) {
        // Check if it's a "Farm not found" error (404) - this is expected for new admin accounts
        if (
          error.message?.includes("Farm not found") ||
          error.message?.includes("404")
        ) {
          console.log(
            "Tài khoản admin mới chưa có thông tin trang trại - cần tạo mới trong phần Thông tin Trang trại",
          );
          setFarm(null); // Explicitly set to null for new accounts
          setFormData({
            cooperativeName: "",
            address: "",
            totalArea: 0,
            mainCropType: "",
          }); // Set empty form data
        } else {
          console.warn("Không thể tải thông tin trang trại:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmInfo();
  }, [currentUser?.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalArea"
          ? Number(value)
          : name === "admin"
            ? currentUser?.id
            : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        admin: currentUser?.id,
        cooperative_name: formData.cooperativeName,
        address: formData.address,
        total_area: Number(formData.totalArea || 0),
        main_crop_type: formData.mainCropType,
      };

      let updated;
      if (farm?.id) {
        // Update existing farm
        updated = await farmAPI.updateFarm(farm.id, payload);
      } else {
        // Create new farm
        updated = await farmAPI.createFarm(payload);
      }

      setFarm(mapApiFarm(updated));
      setIsEditing(false);
      alert(
        farm?.id
          ? "Cập nhật thông tin trang trại thành công!"
          : "Tạo thông tin trang trại thành công!",
      );
    } catch (error: any) {
      console.error("Lỗi khi lưu thông tin trang trại:", error);
      alert("Không thể lưu thông tin. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Thông tin Trang trại</h1>
        {!isEditing && farm && (
          <button
            onClick={() => {
              setIsEditing(true);
              setFormData(farm);
            }}
            className="ml-auto px-4 py-2 bg-white text-emerald-700 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              ></path>
            </svg>
            Chỉnh sửa
          </button>
        )}
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        <Breadcrumb />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={32} className="animate-spin text-emerald-600" />
          </div>
        ) : farm && !isEditing ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Tên HTX
              </label>
              <p className="text-lg font-medium text-gray-900">
                {farm.cooperativeName || "Chưa cập nhật"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Địa chỉ
              </label>
              <p className="text-gray-700">{farm.address || "Chưa cập nhật"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tổng diện tích
                </label>
                <p className="text-lg font-medium text-gray-900">
                  {farm.totalArea} ha
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Cây trồng chính
                </label>
                <p className="text-lg font-medium text-gray-900">
                  {farm.mainCropType || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {farm
                  ? "Cập nhật Thông tin Trang trại"
                  : "Tạo Thông tin Trang trại"}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên HTX <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cooperativeName"
                  required
                  value={formData.cooperativeName || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="VD: HTX Xã Liêm Tuyền"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Nhập địa chỉ trang trại"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tổng diện tích (ha) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalArea"
                    required
                    step="0.01"
                    value={formData.totalArea || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="VD: 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cây trồng chính <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="mainCropType"
                    required
                    value={formData.mainCropType || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="">-- Chọn cây trồng --</option>
                    <option value="Rau">Rau</option>
                    <option value="Lúa">Lúa</option>
                    <option value="Cà phê">Cà phê</option>
                    <option value="Ngô">Ngô</option>
                    <option value="Sắn">Sắn</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    if (farm) setFormData(farm);
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Lưu thay đổi
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

function MaterialManagementScreen({
  onBack,
  materials,
  setMaterials,
}: {
  onBack: () => void;
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
}) {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({});

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: currentMaterial.name || "",
      type: currentMaterial.type || "Khác",
      active_ingredient: currentMaterial.activeIngredient || "",
      is_vietgap: Boolean(currentMaterial.isVietGAP),
      unit: currentMaterial.unit || "",
      quantity: Number(currentMaterial.quantity || 0),
    };

    try {
      if (view === "edit" && currentMaterial.id) {
        const updated = await farmAPI.updateMaterial(
          currentMaterial.id,
          payload,
        );
        setMaterials(
          materials.map((m) =>
            m.id === currentMaterial.id ? mapApiMaterial(updated) : m,
          ),
        );
      } else {
        const created = await farmAPI.createMaterial(payload);
        setMaterials([...materials, mapApiMaterial(created)]);
      }
    } catch (err: any) {
      console.warn("Không thể lưu vật tư:", err);
      if (view === "edit" && currentMaterial.id) {
        setMaterials(
          materials.map((m) =>
            m.id === currentMaterial.id ? (currentMaterial as Material) : m,
          ),
        );
      } else {
        setMaterials([
          ...materials,
          { ...(currentMaterial as Material), id: Date.now().toString() },
        ]);
      }
    }

    setView("list");
    setCurrentMaterial({});
  };

  const handleEdit = (material: Material) => {
    setCurrentMaterial(material);
    setView("edit");
  };

  const handleDelete = async (id: string) => {
    try {
      await farmAPI.deleteMaterial(id);
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (err: any) {
      console.warn("Không thể xóa vật tư:", err);
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button
          onClick={view === "list" ? onBack : () => setView("list")}
          className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Quản lý Vật tư (VietGAP)</h1>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        {view === "list" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Danh mục Vật tư
              </h2>
              <button
                onClick={() => {
                  setCurrentMaterial({ isVietGAP: true, type: "Phân bón" });
                  setView("add");
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} /> Thêm mới
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                      <th className="p-4 font-medium whitespace-nowrap">
                        Tên vật tư
                      </th>
                      <th className="p-4 font-medium whitespace-nowrap">
                        Loại
                      </th>
                      <th className="p-4 font-medium whitespace-nowrap">
                        Hoạt chất
                      </th>
                      <th className="p-4 font-medium text-center whitespace-nowrap">
                        Chuẩn VietGAP
                      </th>
                      <th className="p-4 font-medium text-right whitespace-nowrap">
                        Tồn kho
                      </th>
                      <th className="p-4 font-medium text-right whitespace-nowrap">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {materials.map((material) => (
                      <tr
                        key={material.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                          {material.name}
                        </td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${material.type === "Phân bón" ? "bg-amber-100 text-amber-700" : material.type === "Thuốc BVTV" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {material.type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          {material.activeIngredient}
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          {material.isVietGAP ? (
                            <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 p-1 rounded-full">
                              <CheckCircle size={16} />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center bg-red-100 text-red-600 p-1 rounded-full">
                              <AlertTriangle size={16} />
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right text-gray-800 font-medium whitespace-nowrap">
                          {material.quantity}{" "}
                          <span className="text-gray-500 text-sm font-normal">
                            {material.unit}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <button
                              className="text-blue-500 hover:text-blue-700 p-2"
                              onClick={() => handleEdit(material)}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                ></path>
                              </svg>
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 p-2"
                              onClick={() => handleDelete(material.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {materials.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-gray-500"
                        >
                          Chưa có vật tư nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {view === "add" ? "Thêm Vật tư mới" : "Cập nhật Vật tư"}
            </h2>
            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên vật tư (Thương mại){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentMaterial.name || ""}
                    onChange={(e) =>
                      setCurrentMaterial({
                        ...currentMaterial,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="VD: Phân Lân Văn Điển"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại vật tư <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={currentMaterial.type || "Phân bón"}
                    onChange={(e) =>
                      setCurrentMaterial({
                        ...currentMaterial,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="Phân bón">Phân bón</option>
                    <option value="Thuốc BVTV">Thuốc Bảo vệ thực vật</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hoạt chất chính
                  </label>
                  <input
                    type="text"
                    value={currentMaterial.activeIngredient || ""}
                    onChange={(e) =>
                      setCurrentMaterial({
                        ...currentMaterial,
                        activeIngredient: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="VD: P2O5, Copper Hydroxide..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị tính <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentMaterial.unit || ""}
                    onChange={(e) =>
                      setCurrentMaterial({
                        ...currentMaterial,
                        unit: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="VD: Bao 50kg, Chai 1L..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng tồn kho
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentMaterial.quantity || 0}
                    onChange={(e) =>
                      setCurrentMaterial({
                        ...currentMaterial,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3 mt-2 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <input
                    type="checkbox"
                    id="vietgap"
                    checked={currentMaterial.isVietGAP || false}
                    onChange={(e) =>
                      setCurrentMaterial({
                        ...currentMaterial,
                        isVietGAP: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="vietgap"
                    className="font-medium text-emerald-800 cursor-pointer"
                  >
                    Vật tư được phép sử dụng trong tiêu chuẩn VietGAP
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                >
                  Lưu Vật tư
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export function LogDetailScreen({
  onBack,
  logs,
}: {
  onBack: () => void;
  logs: FarmLog[];
}) {
  const { id } = useParams();
  const log = logs.find((l) => l.id === id);

  if (!log) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy nhật ký
          </h2>
          <button onClick={onBack} className="text-emerald-600 hover:underline">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Chi tiết Nhật ký</h1>
      </header>
      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{log.task}</h2>
              <p className="text-gray-500">
                {new Date(log.datetime).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {log.lot}
              </span>
              <button
                onClick={() => window.print()}
                className="print:hidden flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Printer size={16} />
                Xuất PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Người thực hiện
                </h3>
                <p className="text-gray-900 font-medium">{log.executor}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Giai đoạn
                </h3>
                <p className="text-gray-900">{log.stage}</p>
              </div>
              {log.pest && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Sâu bệnh
                  </h3>
                  <p className="text-gray-900">{log.pest}</p>
                </div>
              )}
              {log.method && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Phương pháp
                  </h3>
                  <p className="text-gray-900">{log.method}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {log.fertilizer && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Phân bón / Thuốc
                  </h3>
                  <p className="text-gray-900">{log.fertilizer}</p>
                </div>
              )}
              {log.activeIngredient && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Hoạt chất
                  </h3>
                  <p className="text-gray-900">{log.activeIngredient}</p>
                </div>
              )}
              {log.dosage && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Liều lượng
                  </h3>
                  <p className="text-gray-900">{log.dosage}</p>
                </div>
              )}
              {log.quarantineTime && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Thời gian cách ly
                  </h3>
                  <p className="text-gray-900">{log.quarantineTime}</p>
                </div>
              )}
            </div>
          </div>

          {log.images && log.images.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Hình ảnh đính kèm
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {log.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Hình ảnh nhật ký ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export function IncidentDetailScreen({
  onBack,
  incidentReports,
}: {
  onBack: () => void;
  incidentReports: IncidentReport[];
}) {
  const { id } = useParams();
  const report = incidentReports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy báo cáo
          </h2>
          <button onClick={onBack} className="text-emerald-600 hover:underline">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-10 shadow-md flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 -ml-1 hover:bg-emerald-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Chi tiết Sự cố</h1>
      </header>
      <main className="p-4 max-w-4xl mx-auto">
        <Breadcrumb />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-amber-600 flex items-center gap-2">
                <AlertTriangle size={24} />
                {report.reportType}
              </h2>
              <p className="text-gray-500 mt-1">
                {new Date(report.datetime).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {report.lot}
              </span>
              <button
                onClick={() => window.print()}
                className="print:hidden flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <Printer size={16} />
                Xuất PDF
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Người báo cáo
              </h3>
              <p className="text-gray-900 font-medium">{report.executor}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                Mô tả chi tiết
              </h3>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                {report.description}
              </p>
            </div>
            {report.images && report.images.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Hình ảnh đính kèm
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {report.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Hình ảnh sự cố ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

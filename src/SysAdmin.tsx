import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Mail,
  Lock,
  Building,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  UploadCloud,
  Save,
  X,
  Activity,
  FileCheck,
  MapPin,
  Calendar,
  Download,
  Map as MapIcon,
  Search,
  Plus,
  Trash2,
  Edit2,
  Globe,
  Send,
  FilePlus,
  Loader2,
} from "lucide-react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import { authAPI, adminAPI, farmAPI } from "./lib/api";
import { getMediaUrl } from "./lib/config";
import "leaflet/dist/leaflet.css";

type HTX = {
  id: string;
  name?: string;
  representative?: string;
  phone?: string;
  email?: string;
  address?: string;
  registrationDate?: string;
  status?: string;
  farmers?: number;
  area?: string;
  activeLogs?: number;
  documents?: any[];
  zones?: any[];
};

type VietgapReq = {
  id: string;
  admin?: string;
  htxName?: string;
  registration_type?: string;
  registration_type_label?: string;
  crop_type?: string;
  production_quantity?: string;
  planting_zone?: string;
  region_code?: string;
  date?: string;
  document?: string;
  status?: string;
  status_label?: string;
  document_files?: string[];
  notes?: string;
};

const MapContainerAny = MapContainer as unknown as React.ComponentType<any>;
const TileLayerAny = TileLayer as unknown as React.ComponentType<any>;
const PolygonAny = Polygon as unknown as React.ComponentType<any>;

// Helper component to control map from outside
function MapController({
  center,
  zoom,
}: {
  center: [number, number] | null;
  zoom: number;
}) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

function normalizeVietGAPRequest(req: any, htxs: any[] = []): any {
  const adminName =
    req.htx_name ||
    (req.admin && typeof req.admin === "object" ? req.admin.name : undefined) ||
    htxs.find((h) => String(h.id) === String(req.admin))?.name ||
    req.htxName ||
    "Hợp tác xã";

  const registrationType = req.registration_type || req.regType || "vietgap";

  const status =
    req.status === "reviewing"
      ? "pending"
      : req.status || req.status || "pending";

  const documentFiles = Array.isArray(req.document_files)
    ? req.document_files
    : req.documentFiles
      ? Array.isArray(req.documentFiles)
        ? req.documentFiles
        : [req.documentFiles]
      : req.document
        ? [req.document]
        : [];

  return {
    id: String(req.id || Date.now()),
    admin: req.admin || null,
    htxName: adminName,
    registration_type: registrationType,
    registration_type_label:
      req.registration_type_label ||
      (registrationType === "gacc" ? "GACC" : "VietGAP"),
    crop_type: req.crop_type || "",
    production_quantity: req.production_quantity || "",
    planting_zone: req.planting_zone || "",
    region_code: req.region_code || req.regionCode || "",
    status,
    status_label:
      req.status_label ||
      (status === "approved"
        ? "Đã cấp mã"
        : status === "rejected"
          ? "Cần bổ sung"
          : "Đang thẩm định"),
    document_files: documentFiles,
    document:
      req.document ||
      documentFiles[0] ||
      `HoSo_${registrationType.toUpperCase()}_${adminName.replace(/\s+/g, "")}.pdf`,
    notes: req.notes || "",
    date:
      req.date ||
      (req.created_at ? req.created_at.split("T")[0] : undefined) ||
      new Date().toISOString().split("T")[0],
  };
}

function resolveAdminRegistrationCertificateUrl(value?: string | null): string {
  if (!value) return "";

  const trimmed = String(value).trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return getMediaUrl(trimmed);
  }

  // Legacy value can be only a file name (ex: "R.png").
  // Convert it to backend media URL so browser does not resolve it as a relative frontend route.
  return getMediaUrl(`/media/${trimmed}`);
}

export function SysAdminLoginScreen({
  onBack,
  onLoginSuccess,
}: {
  onBack: () => void;
  onLoginSuccess: (user: { name: string; role: string }) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const admin = await authAPI.sysAdminLogin(email, password);
      onLoginSuccess({
        name: admin.name || admin.full_name || "Quản trị viên Hệ thống",
        role: "sysadmin",
      });
    } catch (err: any) {
      setError(err?.message || "Email hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
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
          <div className="bg-slate-100 p-4 rounded-full text-slate-700">
            <ShieldCheck size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Quản trị Hệ thống
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Đăng nhập dành cho Admin Open Farm
        </p>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
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
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                placeholder="admin@openfarm.vn"
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
                className="pl-10 w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-900 active:bg-black transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function SysAdminApp({
  currentUser,
  onLogout,
}: {
  currentUser: { name: string };
  onLogout: () => void;
}) {
  const [htxs, setHtxs] = useState<any[]>([]);

  const [vietgapReqs, setVietgapReqs] = useState<any[]>([]);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const admins = await adminAPI.getAdmins();
        if (admins.length) {
          // Load farmers to calculate farmer count per HTX
          let farmerCountByAdmin: Record<string, number> = {};
          try {
            const farmers = await farmAPI.getFarmers();
            farmerCountByAdmin = farmers.reduce(
              (acc: Record<string, number>, farmer: any) => {
                const adminId = String(farmer.admin);
                acc[adminId] = (acc[adminId] || 0) + 1;
                return acc;
              },
              {},
            );
          } catch (farmerError) {
            console.warn("Cannot load farmers, using 0 count:", farmerError);
            farmerCountByAdmin = {};
          }

          const mapped = admins.map((admin: any) => ({
            id: String(admin.id),
            name: admin.name || admin.google_email || "HTX",
            representative: admin.representative || "",
            phone: admin.phone || "",
            email: admin.google_email || "",
            address: admin.address || "",
            registrationDate: admin.created_at
              ? admin.created_at.slice(0, 10)
              : "",
            status: admin.status || "pending",
            farmers: farmerCountByAdmin[String(admin.id)] || 0,
            area:
              admin.area || admin.total_area
                ? `${admin.area || admin.total_area} ha`
                : "0 ha",
            activeLogs: 0,
            documents: [],
            zones: [],
          }));
          setHtxs(mapped);
        }
      } catch (error) {
        console.warn("Cannot load HTX admin list from backend:", error);
      }
    };

    const loadVietGAPRequests = async () => {
      try {
        const requests = await farmAPI.getVietGAPRegistrations();
        if (Array.isArray(requests)) {
          setVietgapReqs(
            requests.map((req: any) => normalizeVietGAPRequest(req, [])),
          );
        }
      } catch (error) {
        console.warn("Cannot load VietGAP registrations from backend:", error);
      }
    };

    loadAdmins();
    loadVietGAPRequests();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SysAdminDashboardScreen
            currentUser={currentUser}
            onLogout={onLogout}
            htxs={htxs}
            setHtxs={setHtxs}
            vietgapReqs={vietgapReqs}
            setVietgapReqs={setVietgapReqs}
          />
        }
      />
      <Route
        path="/htx/:id"
        element={<SysAdminHTXDetailScreen htxs={htxs} setHtxs={setHtxs} />}
      />
      <Route path="/materials" element={<SysAdminMaterialsScreen />} />
      <Route path="/maps" element={<SysAdminMapsScreen htxs={htxs} />} />
      <Route
        path="/vietgap/new"
        element={
          <SysAdminVietGAPCreateScreen
            htxs={htxs}
            vietgapReqs={vietgapReqs}
            setVietgapReqs={setVietgapReqs}
          />
        }
      />
    </Routes>
  );
}

export function SysAdminDashboardScreen({
  currentUser,
  onLogout,
  htxs,
  setHtxs,
  vietgapReqs,
  setVietgapReqs,
}: {
  currentUser: { name: string };
  onLogout: () => void;
  htxs: HTX[];
  setHtxs: (htxs: HTX[]) => void;
  vietgapReqs: VietgapReq[];
  setVietgapReqs: (reqs: VietgapReq[]) => void;
}) {
  const [activeTab, setActiveTab] = useState<"htx" | "vietgap" | "settings">(
    "htx",
  );
  const navigate = useNavigate();

  const [viewingHtx, setViewingHtx] = useState<any>(null);
  const [editingVietgap, setEditingVietgap] = useState<any>(null);

  const handleApproveHtx = async (id: string) => {
    try {
      await adminAPI.updateAdmin(parseInt(id), { status: "approved" });
      setHtxs(
        htxs.map((h: HTX) => (h.id === id ? { ...h, status: "approved" } : h)),
      );
      alert("HTX đã được phê duyệt thành công");
    } catch (error: any) {
      console.error("Lỗi khi phê duyệt HTX:", error);
      alert("Phê duyệt thất bại. Vui lòng thử lại.");
    }
  };

  const handleRejectHtx = async (id: string) => {
    try {
      await adminAPI.updateAdmin(parseInt(id), { status: "rejected" });
      setHtxs(
        htxs.map((h: HTX) => (h.id === id ? { ...h, status: "rejected" } : h)),
      );
      alert("HTX đã bị từ chối");
    } catch (error: any) {
      console.error("Lỗi khi từ chối HTX:", error);
      alert("Từ chối thất bại. Vui lòng thử lại.");
    }
  };

  const handleUpdateVietgap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVietgap) return;

    try {
      await farmAPI.updateVietGAPRegistration(editingVietgap.id, {
        status: editingVietgap.status,
        notes: editingVietgap.notes,
      });

      setVietgapReqs(
        vietgapReqs.map((r: any) =>
          r.id === editingVietgap.id ? editingVietgap : r,
        ),
      );
      setEditingVietgap(null);
    } catch (error: any) {
      console.error("Cannot update VietGAP registration:", error);
      alert(error?.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-slate-800 text-white p-4 sticky top-0 z-10 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={24} />
          <h1 className="text-xl font-bold">Open Farm Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-300 hidden sm:block">
            Xin chào,{" "}
            <span className="font-bold text-white">
              {currentUser?.name || "Quản trị viên"}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
            title="Đăng xuất"
          >
            <Lock size={18} />
          </button>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto">
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("htx")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${activeTab === "htx" ? "bg-slate-800 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            <Building size={20} />
            Quản lý Hợp tác xã
          </button>
          <button
            onClick={() => setActiveTab("vietgap")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${activeTab === "vietgap" ? "bg-slate-800 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            <FileText size={20} />
            Hồ sơ VietGAP & Mã vùng trồng
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${activeTab === "settings" ? "bg-slate-800 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            <Settings size={20} />
            Cấu hình Hệ thống
          </button>
        </div>

        {activeTab === "htx" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                Danh sách Hợp tác xã đăng ký
              </h2>
              <button
                onClick={() => navigate("/sysadmin/maps")}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 font-medium transition-colors"
              >
                <MapIcon size={18} />
                Xem bản đồ tổng hợp
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="p-4 font-medium whitespace-nowrap">
                      Tên HTX
                    </th>
                    <th className="p-4 font-medium whitespace-nowrap">
                      Người đại diện
                    </th>
                    <th className="p-4 font-medium whitespace-nowrap">
                      Quy mô
                    </th>
                    <th className="p-4 font-medium whitespace-nowrap">
                      Trạng thái
                    </th>
                    <th className="p-4 font-medium whitespace-nowrap text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {htxs.map((htx: HTX) => (
                    <tr
                      key={htx.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {htx.name}
                      </td>
                      <td className="p-4 text-gray-600">
                        <div>{htx.representative}</div>
                        <div className="text-xs text-gray-400">{htx.phone}</div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users size={14} /> {htx.farmers} nông dân
                        </div>
                        <div className="text-xs text-gray-400">
                          Diện tích: {htx.area || "0 ha"}
                        </div>
                      </td>
                      <td className="p-4">
                        {htx.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle size={12} /> Đã duyệt
                          </span>
                        ) : htx.status === "rejected" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle size={12} /> Đã từ chối
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Eye size={12} /> Chờ duyệt
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button
                            onClick={() => navigate(`/sysadmin/htx/${htx.id}`)}
                            className="text-sm text-slate-600 hover:text-slate-900 font-medium underline flex items-center gap-1"
                          >
                            <Eye size={16} /> Chi tiết
                          </button>
                          {htx.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApproveHtx(htx.id)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Phê duyệt"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectHtx(htx.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Từ chối"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "vietgap" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  Hỗ trợ cấp chứng nhận VietGAP & Mã vùng trồng
                </h2>
                <p className="text-gray-500 text-sm">
                  Quản lý hồ sơ, tài liệu và hỗ trợ HTX tạo báo cáo chuẩn để xin
                  cấp chứng nhận.
                </p>
              </div>
              <button
                onClick={() => navigate("/sysadmin/vietgap/new")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
              >
                <FilePlus size={18} />
                Tạo hồ sơ mới
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="p-4 font-medium whitespace-nowrap">
                      Hợp tác xã
                    </th>
                    <th className="p-4 font-medium whitespace-nowrap">
                      Ngày nộp
                    </th>
                    <th className="p-4 font-medium whitespace-nowrap">
                      Hồ sơ đính kèm
                    </th>
                    <th className="p-4 font-medium whitespace-nowrap">
                      Trạng thái
                    </th>
                    <th className="p-4 font-medium whitespace-nowrap text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vietgapReqs.map((req: VietgapReq) => (
                    <tr
                      key={req.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {req.htxName}
                      </td>
                      <td className="p-4 text-gray-600">{req.date}</td>
                      <td className="p-4 text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                        <FileText size={16} /> {req.document}
                      </td>
                      <td className="p-4">
                        {req.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle size={12} /> Đã cấp mã
                          </span>
                        ) : req.status === "rejected" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <XCircle size={12} /> Cần bổ sung
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <Eye size={12} /> Đang thẩm định
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setEditingVietgap(req)}
                          className="text-sm text-slate-600 hover:text-slate-900 font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Cập nhật hồ sơ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Cấu hình Hệ thống Chung
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <FileCheck size={20} />
                  </div>
                  <h3 className="font-bold text-gray-800">
                    Danh mục Vật tư Chuẩn
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Quản lý danh sách các loại phân bón, thuốc BVTV được phép sử
                  dụng theo chuẩn VietGAP.
                </p>
                <button
                  onClick={() => navigate("/sysadmin/materials")}
                  className="text-sm font-medium text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 w-full text-center"
                >
                  Quản lý Danh mục
                </button>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Activity size={20} />
                  </div>
                  <h3 className="font-bold text-gray-800">
                    Cấu hình AI Nhận diện
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Thiết lập các tham số cho mô hình AI nhận diện bao bì vật tư
                  và trích xuất sổ đỏ.
                </p>
                <button className="text-sm font-medium text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 w-full text-center">
                  Cài đặt AI Model
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Update VietGAP Modal */}
      {editingVietgap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-gray-800">
                Cập nhật Hồ sơ VietGAP
              </h2>
              <button
                onClick={() => setEditingVietgap(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateVietgap} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hợp tác xã
                </label>
                <input
                  type="text"
                  disabled
                  value={editingVietgap.htxName}
                  className="w-full rounded-xl border-gray-300 border p-3 bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái thẩm định
                </label>
                <select
                  value={editingVietgap.status}
                  onChange={(e) =>
                    setEditingVietgap({
                      ...editingVietgap,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="reviewing">Đang thẩm định</option>
                  <option value="rejected">Yêu cầu bổ sung</option>
                  <option value="approved">Đã cấp mã / Đạt chuẩn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tài liệu đính kèm mới (Tùy chọn)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                  <UploadCloud
                    size={24}
                    className="mx-auto text-gray-400 mb-2"
                  />
                  <span className="text-sm text-gray-500">
                    Tải lên file PDF hoặc Word
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú / Phản hồi cho HTX
                </label>
                <textarea
                  rows={3}
                  value={editingVietgap.notes}
                  onChange={(e) =>
                    setEditingVietgap({
                      ...editingVietgap,
                      notes: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="Nhập ghi chú hoặc yêu cầu bổ sung..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingVietgap(null)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-2"
                >
                  <Save size={18} /> Lưu cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function SysAdminMapsScreen({ htxs }: any) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState(10);
  const [allZones, setAllZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminsMap, setAdminsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadZonesAndAdmins = async () => {
      try {
        setLoading(true);

        // Load all zones from API
        const zones = await farmAPI.getPlantingZones();

        // Load all admins to map admin ID to name
        const admins = await adminAPI.getAdmins();
        const adminMap: Record<string, string> = {};
        admins.forEach((admin: any) => {
          adminMap[String(admin.id)] =
            admin.name || admin.google_email || "HTX";
        });
        setAdminsMap(adminMap);

        // Enrich zones with admin info
        const enrichedZones = (zones || []).map((zone: any) => {
          // Ensure lots array is present and has latLngs
          const lotsWithCoords = (zone.lots || []).map((lot: any) => ({
            ...lot,
            latLngs:
              lot.latLngs ||
              (lot.coordinates
                ? lot.coordinates
                    .split(" ")
                    .map((coord: string) =>
                      coord.split(",").map((c: string) => parseFloat(c)),
                    )
                : []),
          }));

          return {
            ...zone,
            cropType: zone.crop_type || zone.cropType || "",
            lots: lotsWithCoords,
            htxName: adminMap[String(zone.admin)] || "HTX không xác định",
            htxId: zone.admin,
            // Convert lots to polygon format for Leaflet
            polygon:
              lotsWithCoords && lotsWithCoords.length > 0
                ? lotsWithCoords.flatMap((lot: any) =>
                    lot.latLngs && lot.latLngs.length > 0 ? lot.latLngs : [],
                  )
                : [],
            area:
              lotsWithCoords && lotsWithCoords.length > 0
                ? `${lotsWithCoords.reduce((sum: number, lot: any) => sum + (lot.area || 0), 0).toFixed(1)} ha`
                : "0 ha",
          };
        });

        console.log("Enriched zones:", enrichedZones);
        setAllZones(enrichedZones);
      } catch (error) {
        console.warn("Lỗi khi tải vùng trồng:", error);
        setAllZones([]);
      } finally {
        setLoading(false);
      }
    };

    loadZonesAndAdmins();
  }, []);

  const filteredZones = allZones.filter(
    (zone: any) =>
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.htxName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate center of all zones
  const defaultCenter: [number, number] = [10.45, 105.63]; // Default to Dong Thap area

  const handleZoneClick = (zone: any) => {
    if (zone.polygon && zone.polygon.length > 0) {
      setMapCenter(zone.polygon[0]);
      setMapZoom(14);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 shrink-0 z-10 shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/sysadmin")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Bản đồ Vùng trồng Toàn Hệ thống
            </h1>
          </div>
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Tìm kiếm vùng trồng, HTX..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col z-10 shadow-lg">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-gray-800">
              Danh sách vùng trồng ({filteredZones.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <Loader2
                  size={32}
                  className="text-emerald-600 animate-spin mx-auto mb-2"
                />
                <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
              </div>
            ) : filteredZones.length > 0 ? (
              filteredZones.map((zone: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-emerald-300 transition-colors cursor-pointer"
                  onClick={() => handleZoneClick(zone)}
                >
                  <div className="p-4">
                    <h3
                      className="font-bold text-gray-800 mb-1"
                      title={zone.name}
                    >
                      {zone.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <Building size={14} className="shrink-0" />
                      <span className="truncate" title={zone.htxName}>
                        {zone.htxName}
                      </span>
                    </div>
                    <div className="mb-2 text-xs text-gray-600">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block mb-1">
                        {zone.cropType || "Loại cây"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        {zone.area}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sysadmin/htx/${zone.htxId}`);
                        }}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Chi tiết HTX
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  Không tìm thấy vùng trồng nào
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative z-0">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <Loader2
                  size={48}
                  className="text-emerald-600 animate-spin mx-auto mb-3"
                />
                <p className="text-gray-600">Đang tải bản đồ...</p>
              </div>
            </div>
          ) : (
            <MapContainerAny
              center={defaultCenter}
              zoom={10}
              className="w-full h-full"
            >
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayerAny
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredZones.flatMap((zone: any, zoneIndex: number) => {
                if (!zone.lots || zone.lots.length === 0) return null;
                // Render từng lô riêng biệt trên bản đồ
                return zone.lots.map((lot: any, lotIndex: number) => {
                  if (!lot.latLngs || lot.latLngs.length === 0) return null;
                  const lotKey = `${zoneIndex}-${lotIndex}`;
                  const colors = [
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#ec4899",
                    "#06b6d4",
                    "#14b8a6",
                  ];
                  const color = colors[lotIndex % colors.length];

                  return (
                    <PolygonAny
                      key={lotKey}
                      positions={lot.latLngs}
                      pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.35,
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div className="p-3 min-w-[320px]">
                          <h4 className="font-bold text-gray-800 mb-1">
                            {zone.name} - {lot.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Building size={14} />
                            {zone.htxName}
                          </div>
                          <div className="text-xs text-gray-600 mb-3 pb-3 border-b border-gray-200">
                            <div>
                              <span className="font-medium">Loại cây:</span>{" "}
                              {lot.crop_type ||
                                lot.cropType ||
                                zone.cropType ||
                                "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">Diện tích lô:</span>{" "}
                              {lot.area || "N/A"} ha
                            </div>
                          </div>

                          {/* Tọa độ của lô */}
                          {lot.latLngs && lot.latLngs.length > 0 && (
                            <div className="mb-3 pb-3 border-b border-gray-200">
                              <h5 className="font-semibold text-xs text-gray-700 mb-2">
                                Tọa độ lô:
                              </h5>
                              <div className="text-gray-600 font-mono text-[10px] space-y-0.5 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                                {lot.latLngs.map(
                                  (coord: [number, number], idx: number) => (
                                    <div key={idx}>
                                      {idx + 1}. {coord[0].toFixed(4)},{" "}
                                      {coord[1].toFixed(4)}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() =>
                              navigate(`/sysadmin/htx/${zone.htxId}`)
                            }
                            className="w-full text-xs text-blue-600 hover:underline font-medium bg-blue-50 py-2 rounded mt-3"
                          >
                            Xem chi tiết HTX
                          </button>
                        </div>
                      </Popup>
                    </PolygonAny>
                  );
                });
              })}
            </MapContainerAny>
          )}
        </div>
      </main>
    </div>
  );
}

export function SysAdminVietGAPCreateScreen({
  htxs,
  vietgapReqs,
  setVietgapReqs,
}: any) {
  const navigate = useNavigate();
  const [selectedHtx, setSelectedHtx] = useState("");
  const [regType, setRegType] = useState("vietgap");
  const [cropType, setCropType] = useState("");
  const [productionQuantity, setProductionQuantity] = useState("");
  const [plantingZone, setPlantingZone] = useState("");
  const [plantingZones, setPlantingZones] = useState<any[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);

  useEffect(() => {
    const loadPlantingZones = async () => {
      if (!selectedHtx) {
        setPlantingZones([]);
        return;
      }

      setLoadingZones(true);
      try {
        const zones = await farmAPI.getPlantingZones();
        // Filter zones by selected admin/HTX
        const filteredZones = zones.filter((zone: any) => {
          const zoneAdminId =
            typeof zone.admin === "object" ? zone.admin.id : zone.admin;
          return String(zoneAdminId) === String(selectedHtx);
        });
        setPlantingZones(filteredZones);
        setPlantingZone(""); // Reset selected zone
      } catch (error) {
        console.warn("Cannot load planting zones:", error);
        setPlantingZones([]);
      } finally {
        setLoadingZones(false);
      }
    };

    loadPlantingZones();
  }, [selectedHtx]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const htx = htxs.find((h: any) => h.id === selectedHtx);
    if (!htx) {
      alert("Vui lòng chọn Hợp tác xã trước khi tạo hồ sơ.");
      return;
    }

    try {
      const documentName = `HoSo_${regType.toUpperCase()}_${htx.name.replace(/\s+/g, "")}.pdf`;
      const created = await farmAPI.createVietGAPRegistration({
        admin: selectedHtx,
        registration_type: regType,
        crop_type: cropType,
        production_quantity: productionQuantity,
        planting_zone: plantingZone,
        region_code: "",
        status: "pending",
        document_files: [documentName],
        notes: "Hồ sơ mới tạo",
      });

      const newReq = normalizeVietGAPRequest(
        {
          ...created,
          admin: selectedHtx,
          htxName: htx.name,
          document: documentName,
          document_files: [documentName],
        },
        htxs,
      );

      setVietgapReqs([newReq, ...vietgapReqs]);
      navigate("/sysadmin");
    } catch (error: any) {
      console.error("Cannot create VietGAP registration:", error);
      alert(error?.message || "Tạo hồ sơ thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/sysadmin")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Tạo Hồ sơ Đăng ký Mới
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8"
        >
          {/* Section 1: Basic Info */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> Thông tin chung
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại hồ sơ đăng ký *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${regType === "vietgap" ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <input
                      type="radio"
                      name="regType"
                      value="vietgap"
                      checked={regType === "vietgap"}
                      onChange={(e) => setRegType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <ShieldCheck
                        size={24}
                        className={
                          regType === "vietgap"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }
                      />
                      <div>
                        <p
                          className={`font-bold ${regType === "vietgap" ? "text-blue-900" : "text-gray-700"}`}
                        >
                          Chuẩn VietGAP
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Chứng nhận thực hành nông nghiệp tốt
                        </p>
                      </div>
                    </div>
                  </label>
                  <label
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${regType === "gacc" ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <input
                      type="radio"
                      name="regType"
                      value="gacc"
                      checked={regType === "gacc"}
                      onChange={(e) => setRegType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <Globe
                        size={24}
                        className={
                          regType === "gacc"
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }
                      />
                      <div>
                        <p
                          className={`font-bold ${regType === "gacc" ? "text-emerald-900" : "text-gray-700"}`}
                        >
                          Mã vùng trồng GACC
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Xuất khẩu thị trường Trung Quốc
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn Hợp tác xã *
                </label>
                <select
                  required
                  value={selectedHtx}
                  onChange={(e) => setSelectedHtx(e.target.value)}
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn Hợp tác xã --</option>
                  {htxs
                    .filter((h: any) => h.status === "approved")
                    .map((h: any) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Details */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <MapIcon size={20} className="text-emerald-600" /> Chi tiết đăng
              ký
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại cây trồng *
                </label>
                <input
                  type="text"
                  required
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  placeholder="VD: Sầu riêng, Thanh long..."
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sản lượng dự kiến (tấn/năm) *
                </label>
                <input
                  type="text"
                  required
                  value={productionQuantity}
                  onChange={(e) => setProductionQuantity(e.target.value)}
                  placeholder="VD: 500"
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn vùng trồng đăng ký *
                </label>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  {selectedHtx ? (
                    loadingZones ? (
                      <p className="text-sm text-gray-500 italic text-center py-2">
                        Đang tải dữ liệu vùng trồng...
                      </p>
                    ) : plantingZones.length > 0 ? (
                      <div className="space-y-2">
                        {plantingZones.map((zone: any) => (
                          <label
                            key={zone.id}
                            className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="radio"
                              name="plantingZone"
                              value={zone.name}
                              checked={plantingZone === zone.name}
                              onChange={(e) => setPlantingZone(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="font-medium text-gray-700">
                              {zone.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({zone.crop_type})
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        HTX này chưa có dữ liệu vùng trồng.
                      </p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500 italic text-center py-2">
                      Vui lòng chọn Hợp tác xã trước
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/sysadmin")}
              className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Save size={18} /> Lưu nháp
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Send size={18} /> Kết xuất & Nộp hồ sơ
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export function SysAdminHTXDetailScreen({
  htxs,
  setHtxs,
}: {
  htxs: HTX[];
  setHtxs: (htxs: HTX[]) => void;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const htx = htxs.find((h: HTX) => h.id === id);
  const [htxData, setHtxData] = useState<any>(null);
  const [loadingHtx, setLoadingHtx] = useState(false);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [zones, setZones] = useState<any[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [totalArea, setTotalArea] = useState<string>("0 ha");

  const registrationCertificateRaw = htxData?.registration_certificate || "";
  const registrationCertificateUrl = resolveAdminRegistrationCertificateUrl(
    registrationCertificateRaw,
  );

  useEffect(() => {
    const loadHtxData = async () => {
      if (!id) return;
      setLoadingHtx(true);
      try {
        const admins = await adminAPI.getAdmins();
        const admin = admins.find((a: any) => String(a.id) === String(id));
        if (admin) {
          setHtxData(admin);
        }
      } catch (error) {
        console.warn("Cannot load HTX data:", error);
      } finally {
        setLoadingHtx(false);
      }
    };

    const loadFarmers = async () => {
      if (!htx || !id) return;
      setLoadingFarmers(true);
      try {
        const farmersData = await farmAPI.getFarmersByAdminId(id);
        setFarmers(farmersData);
      } catch (error) {
        console.warn("Cannot load farmers for HTX:", error);
        setFarmers([]);
      } finally {
        setLoadingFarmers(false);
      }
    };

    const loadPlantingZones = async () => {
      if (!id) return;
      setLoadingZones(true);
      try {
        const allZones = await farmAPI.getPlantingZones();
        // Filter zones by admin_id
        const filteredZones = allZones.filter((zone: any) => {
          const zoneAdminId =
            typeof zone.admin === "object" ? zone.admin.id : zone.admin;
          return String(zoneAdminId) === String(id);
        });
        setZones(filteredZones);
      } catch (error) {
        console.warn("Cannot load planting zones for HTX:", error);
        setZones([]);
      } finally {
        setLoadingZones(false);
      }
    };

    loadHtxData();
    loadFarmers();
    loadPlantingZones();
  }, [htx, id]);

  // Calculate total area from zones and lots
  useEffect(() => {
    if (zones && zones.length > 0) {
      let totalAreaValue = 0;
      zones.forEach((zone: any) => {
        if (zone.lots && Array.isArray(zone.lots)) {
          zone.lots.forEach((lot: any) => {
            if (lot && typeof lot === "object" && lot.area) {
              totalAreaValue += parseFloat(lot.area) || 0;
            }
          });
        }
      });
      setTotalArea(
        totalAreaValue > 0 ? `${totalAreaValue.toFixed(1)} ha` : "0 ha",
      );
    } else {
      setTotalArea("0 ha");
    }
  }, [zones]);

  if (!htx) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Không tìm thấy Hợp tác xã
        </h2>
        <button
          onClick={() => navigate("/sysadmin")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    setHtxs(
      htxs.map((h: any) => (h.id === id ? { ...h, status: "approved" } : h)),
    );
  };

  const handleReject = () => {
    setHtxs(
      htxs.map((h: any) => (h.id === id ? { ...h, status: "rejected" } : h)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/sysadmin")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Chi tiết Hợp tác xã
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {htx.status === "pending" && (
              <>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 text-sm"
                >
                  Từ chối
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 text-sm"
                >
                  Phê duyệt
                </button>
              </>
            )}
            {htx.status === "approved" && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                <CheckCircle size={16} /> Đã duyệt
              </span>
            )}
            {htx.status === "rejected" && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700">
                <XCircle size={16} /> Đã từ chối
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        {/* Header Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shrink-0">
              <Building size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {htx.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-gray-400" />{" "}
                  {htx.representative}
                </div>
                <div className="flex items-center gap-1">
                  <Mail size={16} className="text-gray-400" /> {htx.email}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-gray-400" /> {htx.address}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-gray-400" /> Đăng ký:{" "}
                  {htx.registrationDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Stats & Documents */}
          <div className="space-y-6">
            {htx.status === "approved" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-blue-600" /> Tổng quan
                  hoạt động
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                    <div className="text-2xl font-bold text-emerald-700">
                      {htx.farmers}
                    </div>
                    <div className="text-sm text-emerald-600">Nông dân</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {totalArea}
                    </div>
                    <div className="text-sm text-blue-600">Diện tích</div>
                  </div>
                </div>
              </div>
            )}

            {/* Farmers List Section */}
            {htx.status === "approved" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users size={18} className="text-purple-600" /> Danh sách nông
                  dân
                </h3>
                {loadingFarmers ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <p className="text-sm text-gray-500 mt-2">Đang tải...</p>
                  </div>
                ) : farmers.length > 0 ? (
                  <div className="space-y-3">
                    {farmers.map((farmer: any) => (
                      <div
                        key={farmer.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {farmer.full_name ||
                                farmer.google_email ||
                                "Nông dân"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {farmer.phone || "Chưa có SĐT"} •{" "}
                              {farmer.managed_lot || "Chưa có lô"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle size={12} /> Hoạt động
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có nông dân nào đăng ký
                  </p>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-slate-600" /> Tài liệu đăng
                ký
              </h3>
              <div className="space-y-3">
                {htxData?.registration_certificate ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                      <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          Giấy chứng nhận đăng ký HTX
                        </p>
                        <p className="text-xs text-gray-500">
                          {htxData.registration_certificate.split("/").pop()}
                        </p>
                      </div>
                    </div>
                    {registrationCertificateUrl ? (
                      <a
                        href={registrationCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                        title="Xem tài liệu"
                      >
                        <Download size={16} />
                      </a>
                    ) : (
                      <span
                        className="p-2 text-gray-400 rounded-lg shrink-0 cursor-not-allowed"
                        title="Trường này hiện chỉ là mã tài liệu, chưa có đường dẫn file"
                      >
                        <Download size={16} />
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có tài liệu đăng ký
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Zones & Maps */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MapIcon size={18} className="text-emerald-600" /> Bản đồ & Giấy
                chứng nhận QSDĐ
              </h3>

              <div className="space-y-8">
                {loadingZones ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    <p className="text-sm text-gray-500 mt-3">
                      Đang tải dữ liệu vùng trồng...
                    </p>
                  </div>
                ) : zones.length > 0 ? (
                  zones.map((zone: any) => (
                    <div
                      key={zone.id}
                      className="border border-gray-200 rounded-2xl overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-800">
                            {zone.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Cây trồng: {zone.crop_type}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Các lô quản lý:
                          </p>
                          {zone.lots && zone.lots.length > 0 ? (
                            <div className="space-y-3">
                              {zone.lots.map((lot: any, idx: number) => {
                                const lotName =
                                  typeof lot === "string"
                                    ? lot
                                    : lot.name || `Lô ${idx + 1}`;
                                const lotCoordinates =
                                  lot.latLngs ||
                                  (lot.coordinates
                                    ? lot.coordinates
                                        .split(" ")
                                        .map((coord: string) => {
                                          const [lat, lng] = coord
                                            .split(",")
                                            .map((n: string) =>
                                              parseFloat(n.trim()),
                                            );
                                          return [lat, lng] as [number, number];
                                        })
                                        .filter(
                                          ([lat, lng]: [number, number]) =>
                                            !isNaN(lat) && !isNaN(lng),
                                        )
                                    : null);

                                const hasValidCoordinates =
                                  lotCoordinates &&
                                  lotCoordinates.length > 0 &&
                                  lotCoordinates.every(
                                    ([lat, lng]: [number, number]) =>
                                      lat >= -90 &&
                                      lat <= 90 &&
                                      lng >= -180 &&
                                      lng <= 180,
                                  );

                                return (
                                  <div
                                    key={idx}
                                    className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                                  >
                                    <div className="p-2 bg-white border-b border-gray-200 flex justify-between items-center">
                                      <p className="text-sm font-medium text-gray-800">
                                        {lotName}
                                      </p>
                                      {typeof lot !== "string" && lot.area && (
                                        <p className="text-xs text-gray-500">
                                          Diện tích: {lot.area} ha
                                        </p>
                                      )}
                                    </div>
                                    {hasValidCoordinates ? (
                                      <div
                                        style={{
                                          height: "200px",
                                          width: "100%",
                                        }}
                                        className="relative"
                                      >
                                        <MapContainerAny
                                          center={lotCoordinates[0]}
                                          zoom={16}
                                          style={{
                                            height: "100%",
                                            width: "100%",
                                            zIndex: 1,
                                          }}
                                        >
                                          <TileLayerAny
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            maxZoom={22}
                                            maxNativeZoom={19}
                                          />
                                          <PolygonAny
                                            positions={lotCoordinates}
                                            color="#10b981"
                                            fillColor="#10b981"
                                            fillOpacity={0.2}
                                            weight={2}
                                          >
                                            <Popup>
                                              <div className="text-sm font-bold text-emerald-800">
                                                {lotName}
                                              </div>
                                              {typeof lot !== "string" &&
                                                lot.area && (
                                                  <div className="text-xs text-gray-600">
                                                    Diện tích: {lot.area} ha
                                                  </div>
                                                )}
                                            </Popup>
                                          </PolygonAny>
                                        </MapContainerAny>
                                      </div>
                                    ) : (
                                      <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
                                        {typeof lot !== "string" &&
                                        lot.coordinates
                                          ? "Tọa độ không hợp lệ"
                                          : "Chưa có tọa độ"}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              Chưa có lô nào
                            </p>
                          )}
                        </div>
                        {zone.certificate_files &&
                          zone.certificate_files.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Giấy chứng nhận QSDĐ:
                              </p>
                              {zone.certificate_files.map(
                                (file: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl mb-2"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <FileCheck size={16} />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-blue-900">
                                          {file.split("/").pop()}
                                        </p>
                                      </div>
                                    </div>
                                    <a
                                      href={file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                                      title="Xem file"
                                    >
                                      <Download size={16} />
                                    </a>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <MapIcon size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      Chưa có dữ liệu vùng trồng
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Hợp tác xã chưa cập nhật thông tin vùng trồng.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function SysAdminMaterialsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"fertilizer" | "pesticide">(
    "fertilizer",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [materialsError, setMaterialsError] = useState("");

  const mapBackendMaterialTypeToUi = (type: string) => {
    if (type === "Phân bón") return "fertilizer";
    if (type === "Thuốc BVTV") return "pesticide";
    return "fertilizer";
  };

  const mapUiMaterialTypeToBackend = (type: string) => {
    if (type === "fertilizer") return "Phân bón";
    if (type === "pesticide") return "Thuốc BVTV";
    return "Khác";
  };

  const mapApiMaterialToUi = (material: any) => ({
    id: `mat-${material.id}`,
    backendId: material.id,
    type: mapBackendMaterialTypeToUi(material.type),
    name: material.name || "",
    activeIngredient: material.active_ingredient || "",
    target: material.unit || "",
    status: material.status || (material.is_vietgap ? "active" : "banned"),
    quantity: material.quantity ?? 0,
    min_stock: material.min_stock ?? 0,
  });

  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoadingMaterials(true);
      setMaterialsError("");
      try {
        const apiMaterials = await farmAPI.getMaterials();
        setMaterials(apiMaterials.map(mapApiMaterialToUi));
      } catch (error) {
        console.error("Cannot load materials:", error);
        setMaterialsError("Không thể tải danh mục vật tư từ server.");
      } finally {
        setIsLoadingMaterials(false);
      }
    };
    loadMaterials();
  }, []);

  const filteredMaterials = materials.filter(
    (m) =>
      m.type === activeTab &&
      (m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const payload = {
      name: editingItem.name,
      type: mapUiMaterialTypeToBackend(editingItem.type),
      active_ingredient: editingItem.activeIngredient,
      is_vietgap: editingItem.status === "active", // vẫn giữ để không ảnh hưởng BE cũ
      status: editingItem.status, // Gửi đúng status: 'active', 'inactive', 'banned'
      unit: editingItem.target || "kg",
      quantity: Number(editingItem.quantity ?? 0),
      min_stock: Number(editingItem.min_stock ?? 0),
    };

    try {
      if (editingItem.backendId) {
        const updated = await farmAPI.updateMaterial(
          editingItem.backendId,
          payload,
        );
        setMaterials(
          materials.map((m) =>
            m.backendId === editingItem.backendId
              ? mapApiMaterialToUi(updated)
              : m,
          ),
        );
      } else {
        const created = await farmAPI.createMaterial(payload);
        setMaterials([mapApiMaterialToUi(created), ...materials]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Cannot save material:", error);
      window.alert("Lưu vật tư thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: string) => {
    const item = materials.find((m) => m.id === id);
    if (!item) return;

    if (window.confirm("Bạn có chắc chắn muốn xóa vật tư này?")) {
      if (item.backendId) {
        try {
          await farmAPI.deleteMaterial(item.backendId);
          setMaterials(materials.filter((m) => m.id !== id));
        } catch (error) {
          console.error("Cannot delete material:", error);
          window.alert("Xóa vật tư thất bại. Vui lòng thử lại.");
        }
      } else {
        setMaterials(materials.filter((m) => m.id !== id));
      }
    }
  };

  const openAddModal = () => {
    setEditingItem({
      name: "",
      activeIngredient: "",
      target: "",
      status: "active",
      type: activeTab,
      quantity: 0,
      min_stock: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/sysadmin")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              Danh mục Vật tư Chuẩn VietGAP
            </h1>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 text-sm transition-colors"
          >
            <Plus size={16} /> Thêm vật tư mới
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
            <div className="flex bg-white rounded-xl p-1 border border-gray-200 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("fertilizer")}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "fertilizer" ? "bg-emerald-100 text-emerald-800" : "text-gray-500 hover:text-gray-700"}`}
              >
                Phân bón
              </button>
              <button
                onClick={() => setActiveTab("pesticide")}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "pesticide" ? "bg-blue-100 text-blue-800" : "text-gray-500 hover:text-gray-700"}`}
              >
                Thuốc BVTV
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm tên, hoạt chất..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full rounded-xl border-gray-300 border py-2 focus:ring-slate-500 focus:border-slate-500 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium whitespace-nowrap">
                    Tên thương mại
                  </th>
                  <th className="p-4 font-medium whitespace-nowrap">
                    Hoạt chất chính
                  </th>
                  <th className="p-4 font-medium whitespace-nowrap">
                    Đối tượng / Công dụng
                  </th>
                  <th className="p-4 font-medium whitespace-nowrap">
                    Trạng thái
                  </th>
                  <th className="p-4 font-medium whitespace-nowrap text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {item.activeIngredient}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">{item.target}</td>
                    <td className="p-4">
                      {item.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle size={12} /> Cho phép
                        </span>
                      ) : item.status === "inactive" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <Activity size={12} /> Hạn chế
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <XCircle size={12} /> Cấm sử dụng
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMaterials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Không tìm thấy vật tư nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingItem.id
                  ? "Cập nhật Vật tư"
                  : `Thêm ${activeTab === "fertilizer" ? "Phân bón" : "Thuốc BVTV"} mới`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thương mại
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="VD: Phân bón NPK..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hoạt chất chính / Thành phần
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.activeIngredient}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      activeIngredient: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="VD: N: 20%, P2O5: 20%..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đối tượng / Công dụng
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.target}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, target: e.target.value })
                  }
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                  placeholder="VD: Cải tạo đất, trị rầy nâu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái (Chuẩn VietGAP)
                </label>
                <select
                  value={editingItem.status}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, status: e.target.value })
                  }
                  className="w-full rounded-xl border-gray-300 border p-3 focus:ring-slate-500 focus:border-slate-500"
                >
                  <option value="active">Cho phép sử dụng</option>
                  <option value="inactive">Hạn chế sử dụng</option>
                  <option value="banned">Cấm sử dụng</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-2"
                >
                  <Save size={18} /> Lưu vật tư
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

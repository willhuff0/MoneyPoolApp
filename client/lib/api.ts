import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE =
  (process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

async function request<T>(
  path: string,
  init: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (withAuth) {
    const token = await AsyncStorage.getItem("authToken");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON or empty body
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const err: any = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data as T;
}

// Try multiple endpoint names until success
async function tryEndpoints<T>(
  attempts: { path: string; body?: any; method?: "POST" | "GET"; withAuth?: boolean }[]
): Promise<T> {
  let lastErr: any;
  for (const a of attempts) {
    try {
      const method = a.method || "POST";
      const init: RequestInit =
        method === "POST" ? { method, body: JSON.stringify(a.body || {}) } : { method };
      return await request<T>(a.path, init, !!a.withAuth);
    } catch (e) {
      lastErr = e;
      // keep trying
    }
  }
  throw lastErr || new Error("No matching endpoint responded");
}

/* ====================== AUTH ====================== */

export interface RegisterReq {
  displayName: string;
  userName: string;
  email: string;
  password: string;
}
export interface RegisterRes {
  token: string;
}

export async function register(payload: RegisterReq): Promise<RegisterRes> {
  const data = await tryEndpoints<RegisterRes>([
    { path: "/auth/register", body: payload },
    { path: "/auth/create-user", body: payload }, // maps to AuthController.createUser
  ]);
  if ((data as any)?.token) await AsyncStorage.setItem("authToken", (data as any).token);
  return data;
}

export interface LoginReq {
  userName?: string;
  email?: string;
  password: string;
}
export interface LoginRes {
  token: string;
  email: string;
  userName: string;
  displayName: string;
  chompScore: number;
}

export async function login(payload: LoginReq): Promise<LoginRes> {
  const data = await tryEndpoints<LoginRes>([
    { path: "/auth/login", body: payload },
    { path: "/auth/start-session", body: payload }, // maps to AuthController.startSession
  ]);
  if ((data as any)?.token) await AsyncStorage.setItem("authToken", (data as any).token);
  return data;
}

export async function logoutAll(): Promise<void> {
  try {
    await tryEndpoints<void>([
      { path: "/auth/logout-all", body: {}, withAuth: true },
      { path: "/auth/logoutAll", body: {}, withAuth: true },
    ]);
  } catch {
    // ignore if not implemented
  } finally {
    await AsyncStorage.removeItem("authToken");
  }
}

// ===== AUTH: forgot password (no backend edits; tries multiple routes) =====
export interface ForgotPasswordReq {
  email: string;
}
export interface ForgotPasswordRes {
  message?: string;
  ok?: boolean;
}

export async function requestPasswordReset(
  payload: ForgotPasswordReq
): Promise<ForgotPasswordRes> {
  // Reuse tryEndpoints from this file
  return await tryEndpoints<ForgotPasswordRes>([
    { path: "/auth/forgot-password", body: payload },         // common
    { path: "/auth/request-password-reset", body: payload },  // alt
    { path: "/auth/password/forgot", body: payload },         // alt
  ]);
}


/* ====================== USERS (protected) ====================== */

export interface UserDto {
  userId: string;
  displayName: string;
  userName: string;
  email: string;
  chompScore: number;
}

// GET /api/users/:user_id (requires Bearer token)
export async function getUser(userId: string): Promise<UserDto> {
  return request<UserDto>(`/users/${encodeURIComponent(userId)}`, { method: "GET" }, true);
}

export async function searchUsers(query = "", start = 0, limit = 20): Promise<UserDto[]> {
  return request<UserDto[]>(
    `/users?query=${encodeURIComponent(query)}&start=${start}&limit=${limit}`,
    { method: "GET" },
    true
  );
}

/* ====================== UTIL ====================== */

export async function getStoredToken(): Promise<string | null> {
  return AsyncStorage.getItem("authToken");
}
export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem("authToken");
}

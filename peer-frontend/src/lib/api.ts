const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }

  getToken(): string | null {
    if (!this.accessToken && typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
    }
    return this.accessToken;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.accessToken}`;
        const retry = await fetch(`${API_BASE}${path}`, { ...options, headers });
        if (!retry.ok) throw new ApiError(retry.status, await retry.text());
        if (retry.status === 204 || retry.status === 201) {
          const text = await retry.text();
          if (!text) return undefined as T;
          return JSON.parse(text);
        }
        return retry.json();
      }
      this.setToken(null);
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      throw new ApiError(401, "Unauthorized");
    }

    if (!res.ok) {
      const body = await res.text();
      throw new ApiError(res.status, body);
    }

    if (res.status === 204 || res.status === 201) {
      const text = await res.text();
      if (!text) return undefined as T;
      return JSON.parse(text);
    }
    return res.json();
  }

  private async tryRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      this.setToken(data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string
  ) {
    super(`API Error ${status}: ${body}`);
  }
}

export const api = new ApiClient();

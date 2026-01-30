import axios, {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { logger } from "@/lib/logger";
import { envBool, isServer } from "@/lib/utils";


type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type APIClientEnvConfig = {
    /**
     * Prefer NEXT_PUBLIC_* so the same client works in browser and server.
     * If you want a different server-only base URL, also set API_BASE_URL.
     */
    baseURL: string;

    timeoutMs: number;

    /**
     * If true, logs request/response (sanitized). Keep false in prod if you want quiet logs.
     */
    enableLogging: boolean;

    /**
     * If true, includes a response body in debug logs for non-2xx (be careful with PII).
     */
    logErrorResponseBody: boolean;

    /**
     * Optional header name to set a request id.
     */
    requestIdHeader: string;
};

export type APIClientConfig = {
    env?: Partial<APIClientEnvConfig>;
    axios?: AxiosRequestConfig;
    /**
     * Optional: supply auth token getter (client-side cookies, server session, etc.)
     * Return undefined when not available.
     */
    getAuthToken?: () => string | undefined;
    /**
     * Optional: called on 401 responses (logout, refresh, etc.)
     */
    onUnauthorized?: (error: AxiosError) => void;
};

export class APIError extends Error {
    name = "APIError";
    status?: number;
    code?: string;
    details?: unknown;

    constructor(message: string, opts?: { status?: number; code?: string; details?: unknown }) {
        super(message);
        this.status = opts?.status;
        this.code = opts?.code;
        this.details = opts?.details;
    }
}

function envNumber(name: string, defaultValue: number): number {
    const v = process.env[name];
    if (v == null) return defaultValue;
    const n = Number(v);
    return Number.isFinite(n) ? n : defaultValue;
}

function getBaseUrlFromEnv(): string {
    // One client usable everywhere:
    // - In the browser: only NEXT_PUBLIC_* is available.
    // - On the server: allow API_BASE_URL override.
    const serverOverride = process.env.API_BASE_URL?.trim();
    const publicUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

    const base = (isServer() ? serverOverride || publicUrl : publicUrl) || "";
    if (!base) {
        // Fail loudly, so misconfig is obvious during dev/test
        throw new Error(
            "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL (and optionally API_BASE_URL for server-only override).",
        );
    }
    return base;
}

function defaultEnvConfig(): APIClientEnvConfig {
    const isProd = (process.env.NODE_ENV ?? "development") === "production";

    return {
        baseURL: getBaseUrlFromEnv(),
        timeoutMs: envNumber("API_TIMEOUT_MS", 15_000),
        enableLogging: envBool("API_LOGGING", !isProd),
        logErrorResponseBody: envBool("API_LOG_ERROR_BODY", !isProd),
        requestIdHeader: process.env.API_REQUEST_ID_HEADER?.trim() || "x-request-id",
    };
}

function sanitizeHeaders(headers: unknown) {
    // Avoid leaking secrets in logs
    const h = (headers ?? {}) as Record<string, unknown>;
    const out: Record<string, unknown> = { ...h };

    for (const key of Object.keys(out)) {
        const k = key.toLowerCase();
        if (k === "authorization" || k === "cookie" || k === "set-cookie" || k === "x-api-key") {
            out[key] = "[REDACTED]";
        }
    }
    return out;
}

function safeStringify(value: unknown) {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function generateRequestId() {
    // Use crypto.randomUUID when available
    const g = globalThis as unknown as { crypto?: { randomUUID?: () => string } };
    return g.crypto?.randomUUID?.() ?? `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export class APIClient {
    private readonly client: AxiosInstance;
    private env: APIClientEnvConfig;
    private log = logger.child("api");

    constructor(config: APIClientConfig = {}) {
        this.env = { ...defaultEnvConfig(), ...(config.env ?? {}) };

        this.client = axios.create({
            baseURL: this.env.baseURL,
            timeout: this.env.timeoutMs,
            ...config.axios,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(config.axios?.headers ?? {}),
            },
        });

        this.client.interceptors.request.use((req: InternalAxiosRequestConfig) => {
            req.headers = AxiosHeaders.from(req.headers);
            // Request ID
            const headerName = this.env.requestIdHeader;
            if (headerName && !req.headers[headerName]) {
                req.headers[headerName] = generateRequestId();
            }

            // Auth token (optional)
            const token = config.getAuthToken?.();
            if (token && !req.headers.Authorization) {
                req.headers.Authorization = `Bearer ${token}`;
            }

            // Logging
            if (this.env.enableLogging) {
                const url = `${req.baseURL ?? ""}${req.url ?? ""}`;
                this.log.debug("HTTP request", {
                    method: req.method?.toUpperCase(),
                    url,
                    params: req.params,
                    headers: sanitizeHeaders(req.headers),
                });
            }

            return req;
        });

        this.client.interceptors.response.use(
            (res: AxiosResponse) => {
                if (this.env.enableLogging) {
                    const req = res.config;
                    const url = `${req.baseURL ?? ""}${req.url ?? ""}`;
                    this.log.debug("HTTP response", {
                        method: req.method?.toUpperCase(),
                        url,
                        status: res.status,
                    });
                }
                return res;
            },
            (err: AxiosError) => {
                if (err.response?.status === 401) {
                    config.onUnauthorized?.(err);
                }

                if (this.env.enableLogging) {
                    const req = err.config;
                    const url = `${req?.baseURL ?? ""}${req?.url ?? ""}`;
                    const payload =
                        this.env.logErrorResponseBody && err.response
                            ? { status: err.response.status, data: err.response.data }
                            : { status: err.response?.status };

                    this.log.warn("HTTP error", {
                        method: req?.method?.toUpperCase(),
                        url,
                        code: err.code,
                        ...payload,
                    });
                }

                return Promise.reject(err);
            },
        );
    }

    /**
     * Low-level request helper. Prefer using get/post/put/patch/delete wrappers.
     */
    async request<TRES>(config: AxiosRequestConfig): Promise<TRES> {
        try {
            const response = await this.client.request<TRES>(config);
            return response.data;
        } catch (e) {
            throw this.toAPIError(e);
        }
    }

    async get<TRES>(endpoint: string, config?: AxiosRequestConfig): Promise<TRES> {
        return this.request<TRES>({ ...config, url: endpoint, method: "GET" as HttpMethod });
    }

    async post<TREQ, TRES>(endpoint: string, data: TREQ, config?: AxiosRequestConfig): Promise<TRES> {
        return this.request<TRES>({ ...config, url: endpoint, method: "POST" as HttpMethod, data });
    }

    async put<TREQ, TRES>(endpoint: string, data: TREQ, config?: AxiosRequestConfig): Promise<TRES> {
        return this.request<TRES>({ ...config, url: endpoint, method: "PUT" as HttpMethod, data });
    }

    async patch<TREQ, TRES>(endpoint: string, data: TREQ, config?: AxiosRequestConfig): Promise<TRES> {
        return this.request<TRES>({ ...config, url: endpoint, method: "PATCH" as HttpMethod, data });
    }

    async delete<TRES>(endpoint: string, config?: AxiosRequestConfig): Promise<TRES> {
        return this.request<TRES>({ ...config, url: endpoint, method: "DELETE" as HttpMethod });
    }

    /**
     * Expose the underlying axios instance for advanced use cases
     * (custom interceptors per module, cancellation, etc.)
     */
    get axios(): AxiosInstance {
        return this.client;
    }

    get baseURL(): string {
        return this.env.baseURL;
    }

    private toAPIError(err: unknown): APIError {
        if (!axios.isAxiosError(err)) {
            return new APIError("Unknown API error", { details: err });
        }

        const status = err.response?.status;
        const code = err.code;

        // Prefer a server-provided message if present
        const serverMessage =
            typeof err.response?.data === "object" && err.response?.data &&
            "message" in err.response.data && typeof err.response.data.message === "string"
                ? err.response.data.message
                : undefined;

        const message =
            serverMessage ||
            err.message ||
            (status ? `Request failed with status ${status}` : "Request failed");

        // Keep details smallish but useful
        const details = {
            status,
            code,
            url: err.config?.url,
            method: err.config?.method?.toUpperCase(),
            response: this.env.logErrorResponseBody ? err.response?.data : undefined,
        };

        return new APIError(message, { status, code, details: safeStringify(details) });
    }
}

/**
 * Singleton client: import-and-go across the app with zero call-site changes.
 */
const apiClient = new APIClient();
export default apiClient;
export { apiClient };

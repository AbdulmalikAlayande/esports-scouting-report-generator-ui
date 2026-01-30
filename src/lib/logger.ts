import chalk from "chalk";
import { format as formatDate } from "date-fns";
import {isServer, envBool} from "@/lib/utils";

type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

type LoggerConfig = {
    level: LogLevel;
    name?: string;

    timestamps: boolean;
    colors: boolean;

    console: {
        enabled: boolean;
    };

    file: {
        enabled: boolean;
        path: string; // e.g. "logs/app.log"
    };
};

type LogRecord = {
    ts: Date;
    level: LogLevel;
    name?: string;
    scope?: string;
    message: string;
    data?: unknown[];
};

interface Transport {
    enabled: boolean;
    log(rec: LogRecord): void;
    flush?(): Promise<void>;
}

const LEVEL_ORDER: Record<LogLevel, number> = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10,
};

function envLevel(name: string, defaultValue: LogLevel): LogLevel {
    const v = process.env[name]?.trim().toLowerCase();
    if (!v) return defaultValue;

    if (v === "fatal" || v === "error" || v === "warn" || v === "info" || v === "debug" || v === "trace") {
        return v;
    }
    return defaultValue;
}

function safeStringify(value: unknown): string {
    if (typeof value === "string") return value;

    if (value instanceof Error) {
        return JSON.stringify(
            {
                name: value.name,
                message: value.message,
                stack: value.stack,
            },
            null,
            0,
        );
    }

    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function formatTimestamp(ts: Date) {
    // date-fns: readable and consistent. Example: 2026-01-30 16:27:03.123
    return formatDate(ts, "yyyy-MM-dd HH:mm:ss.SSS");
}

function levelLabel(level: LogLevel) {
    return level.toUpperCase().padEnd(5, " ");
}

function colorizeLevel(level: LogLevel, text: string, enabled: boolean) {
    if (!enabled) return text;
    switch (level) {
        case "fatal":
            return chalk.magentaBright(text);
        case "error":
            return chalk.redBright(text);
        case "warn":
            return chalk.yellowBright(text);
        case "info":
            return chalk.greenBright(text);
        case "debug":
            return chalk.cyanBright(text);
        case "trace":
            return chalk.gray(text);
    }
}

function pickConsoleMethod(level: LogLevel): "error" | "warn" | "info" | "debug" | "log" {
    if (level === "fatal" || level === "error") return "error";
    if (level === "warn") return "warn";
    if (level === "info") return "info";
    if (level === "debug") return "debug";
    return "log";
}

function formatLine(rec: LogRecord, opts: { timestamps: boolean; colors: boolean }) {
    const parts: string[] = [];

    if (opts.timestamps) {
        const ts = formatTimestamp(rec.ts);
        parts.push(opts.colors ? chalk.dim(ts) : ts);
    }

    const lvl = colorizeLevel(rec.level, levelLabel(rec.level), opts.colors);
    parts.push(lvl);

    if (rec.name) {
        const name = `[${rec.name}]`;
        parts.push(opts.colors ? chalk.gray(name) : name);
    }

    if (rec.scope) {
        const scope = `[${rec.scope}]`;
        parts.push(opts.colors ? chalk.gray(scope) : scope);
    }

    parts.push(rec.message);

    if (rec.data && rec.data.length > 0) {
        parts.push(rec.data.map((d) => safeStringify(d)).join(" "));
    }

    return parts.join(" ");
}

class ConsoleTransport implements Transport {
    enabled: boolean;
    private readonly colors: boolean;
    private readonly timestamps: boolean;

    constructor(opts: { enabled: boolean; colors: boolean; timestamps: boolean }) {
        this.enabled = opts.enabled;
        this.colors = opts.colors;
        this.timestamps = opts.timestamps;
    }

    log(rec: LogRecord) {
        if (!this.enabled) return;

        const line = formatLine(rec, { colors: this.colors, timestamps: this.timestamps });
        const method = pickConsoleMethod(rec.level);
        console[method](line);
    }
}

class FileTransport implements Transport {
    enabled: boolean;
    private readonly filePath: string;
    private chain: Promise<void> = Promise.resolve();

    constructor(opts: { enabled: boolean; path: string }) {
        this.enabled = opts.enabled;
        this.filePath = opts.path;
    }

    log(rec: LogRecord) {
        if (!this.enabled) return;
        if (!isServer()) return; // ignore in browser

        // Always write plain text + timestamps to file for parsing
        const line = formatLine(rec, { colors: false, timestamps: true }) + "\n";

        this.chain = this.chain.then(() => this.append(line)).catch(() => {
            // Swallow logging failures (filesystem not available, permissions, edge runtime, etc.)
            // You can change this to throw if you want 'fail-fast'.
        });
    }

    async flush() {
        await this.chain;
    }

    private async append(text: string) {
        const fs = await import("node:fs/promises");
        const path = await import("node:path");

        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.appendFile(this.filePath, text, { encoding: "utf8" });
    }
}

export class Logger {
    private readonly config: LoggerConfig;
    private readonly transports: Transport[];
    private readonly scope?: string;

    constructor(config?: Partial<LoggerConfig>, scope?: string) {
        const defaults = Logger.fromEnv();
        this.config = {
            ...defaults,
            ...config,
            console: { ...defaults.console, ...(config?.console ?? {}) },
            file: { ...defaults.file, ...(config?.file ?? {}) },
        };

        this.scope = scope;

        // chalk supports colors in most terminals; still allow disabling via config/env
        const colors = this.config.colors && isServer() && !process.env.NO_COLOR;

        this.transports = [
            new ConsoleTransport({
                enabled: this.config.console.enabled,
                colors,
                timestamps: this.config.timestamps,
            }),
            new FileTransport({
                enabled: this.config.file.enabled,
                path: this.config.file.path,
            }),
        ];

        // keep your original binding style
        this.log = this.log.bind(this);
        this.fatal = this.fatal.bind(this);
        this.error = this.error.bind(this);
        this.warn = this.warn.bind(this);
        this.info = this.info.bind(this);
        this.debug = this.debug.bind(this);
        this.trace = this.trace.bind(this);

        this.child = this.child.bind(this);
        this.setLevel = this.setLevel.bind(this);
        this.enableConsole = this.enableConsole.bind(this);
        this.enableFile = this.enableFile.bind(this);
        this.flush = this.flush.bind(this);
    }

    static fromEnv(): LoggerConfig {
        const nodeEnv = process.env.NODE_ENV ?? "development";
        const isProd = nodeEnv === "production";

        return {
            level: envLevel("LOG_LEVEL", isProd ? "info" : "debug"),
            name: process.env.LOG_NAME?.trim() || undefined,

            timestamps: envBool("LOG_TIMESTAMPS", true),
            colors: envBool("LOG_COLORS", !isProd),

            console: {
                enabled: envBool("LOG_TO_CONSOLE", !isProd),
            },

            file: {
                enabled: envBool("LOG_TO_FILE", isProd),
                path: process.env.LOG_FILE_PATH?.trim() || "logs/app.log",
            },
        };
    }

    child(scope: string) {
        return new Logger(this.config, scope);
    }

    setLevel(level: LogLevel) {
        this.config.level = level;
    }

    enableConsole(enabled: boolean) {
        this.config.console.enabled = enabled;
        const t = this.transports.find((x) => x instanceof ConsoleTransport);
        if (t) t.enabled = enabled;
    }

    enableFile(enabled: boolean, path?: string) {
        this.config.file.enabled = enabled;
        if (path) this.config.file.path = path;

        // recreate file transport if the path changes
        const fileIndex = this.transports.findIndex((x) => x instanceof FileTransport);
        if (fileIndex >= 0) {
            this.transports[fileIndex] = new FileTransport({
                enabled,
                path: this.config.file.path,
            });
        } else {
            this.transports.push(
                new FileTransport({
                    enabled,
                    path: this.config.file.path,
                }),
            );
        }
    }

    // your original API (log maps to info)
    log(message: string, ...data: unknown[]) {
        this.info(message, ...data);
    }

    fatal(message: string, ...data: unknown[]) {
        this.write("fatal", message, data);
    }

    error(message: string, ...data: unknown[]) {
        this.write("error", message, data);
    }

    warn(message: string, ...data: unknown[]) {
        this.write("warn", message, data);
    }

    info(message: string, ...data: unknown[]) {
        this.write("info", message, data);
    }

    debug(message: string, ...data: unknown[]) {
        this.write("debug", message, data);
    }

    trace(message: string, ...data: unknown[]) {
        this.write("trace", message, data);
    }

    async flush() {
        await Promise.all(this.transports.map((t) => t.flush?.()));
    }

    private write(level: LogLevel, message: string, data?: unknown[]) {
        if (LEVEL_ORDER[level] < LEVEL_ORDER[this.config.level]) return;

        const rec: LogRecord = {
            ts: new Date(),
            level,
            name: this.config.name,
            scope: this.scope,
            message,
            data,
        };

        for (const t of this.transports) t.log(rec);
    }
}

// Export both: a class (for your `import { Logger } ...` usage) and a default singleton.
export const logger = new Logger();
export default logger;
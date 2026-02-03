/**
 * Polling service for report generation status
 * Handles automatic status checks until report is ready
 */
import {ReportStatusResponse} from "@/lib/types/interfaces";
import apiClient from "@/lib/api/apiclient";


export interface PollingOptions {
    /** Polling interval in milliseconds (default: 3000) */
    interval?: number;
    /** Maximum number of poll attempts (default: 60 = 3 minutes at 3s interval) */
    maxAttempts?: number;
    /** Callback for progress updates */
    onProgress?: (status: ReportStatusResponse) => void;
    /** Callback for errors */
    onError?: (error: Error) => void;
}

export class ReportPoller {
    private readonly requestId: string;
    private options: Required<PollingOptions>;
    private attempts: number = 0;
    private timeoutId: NodeJS.Timeout | null = null;
    private isPolling: boolean = false;

    constructor(requestId: string, options: PollingOptions = {}) {
        this.requestId = requestId;
        this.options = {
            interval: options.interval ?? 3000,
            maxAttempts: options.maxAttempts ?? 60,
            onProgress: options.onProgress ?? (() => {}),
            onError: options.onError ?? (() => {}),
        };
    }

    /**
     * Start polling for report status
     * Returns a promise that resolves when report is ready or rejects on error/timeout
     */
    async start(): Promise<ReportStatusResponse> {
        if (this.isPolling) {
            throw new Error('Polling already in progress');
        }

        this.isPolling = true;
        this.attempts = 0;

        return new Promise((resolve, reject) => {
            this.poll(resolve, reject);
        });
    }

    /**
     * Stop polling
     */
    stop(): void {
        this.isPolling = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    /**
     * Internal polling logic
     */
    private async poll(
        resolve: (value: ReportStatusResponse) => void,
        reject: (reason: Error) => void
    ): Promise<void> {
        if (!this.isPolling) {
            reject(new Error('Polling stopped'));
            return;
        }

        if (this.attempts >= this.options.maxAttempts) {
            this.isPolling = false;
            reject(new Error('Polling timeout: Maximum attempts reached'));
            return;
        }

        this.attempts++;

        try {
            const status = await apiClient.get<ReportStatusResponse>(
                `/reports/${this.requestId}/status`
            );

            // Notify progress callback
            this.options.onProgress(status);

            // Check if report is ready
            if (status.status === 'COMPLETED' && status.reportAvailable) {
                this.isPolling = false;
                resolve(status);
                return;
            }

            // Check if report failed
            if (status.status === 'FAILED') {
                this.isPolling = false;
                reject(new Error(status.error || 'Report generation failed'));
                return;
            }

            // Continue polling
            this.timeoutId = setTimeout(() => {
                this.poll(resolve, reject);
            }, this.options.interval);

        } catch (error) {
            this.isPolling = false;
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error during polling';

            this.options.onError(new Error(errorMessage));
            reject(new Error(errorMessage));
        }
    }

    /**
     * Get current polling state
     */
    getState() {
        return {
            isPolling: this.isPolling,
            attempts: this.attempts,
            maxAttempts: this.options.maxAttempts,
            progress: Math.min((this.attempts / this.options.maxAttempts) * 100, 100),
        };
    }
}

/**
 * Convenience function for simple polling
 * @param requestId Report request UUID
 * @param options Polling options
 * @returns Promise that resolves when report is ready
 */
export async function pollForReport(
    requestId: string,
    options?: PollingOptions
): Promise<ReportStatusResponse> {
    const poller = new ReportPoller(requestId, options);
    return poller.start();
}

/**
 * Hook-friendly polling with cancellation
 */
export function createReportPoller(
    requestId: string,
    options?: PollingOptions
) {
    const poller = new ReportPoller(requestId, options);

    return {
        start: () => poller.start(),
        stop: () => poller.stop(),
        getState: () => poller.getState(),
    };
}
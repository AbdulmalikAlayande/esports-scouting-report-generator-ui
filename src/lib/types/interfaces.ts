export type ReportRequest = {
    userPrompt: string
}

export type ReportStatusResponse = {
    status: string
    requestId: string;
    error: string;
    message: string;
    progress: number; // 0-100
    currentStep: string;
    createdAt: string;
    reportAvailable: boolean;
    completedAt: string;

    // Additive contract fields (optional for compatibility)
    workflowState?: string;
    errorCode?: string;
    retryable?: boolean;
    contractVersion?: string;
}

export type ScoutingReportResponse = {
    requestId: string;
    reportType: string;
    reportTitle: string;
    summary: string;
    createdAt: string;
    sections: ReportSections[]

    // Additive contract fields (optional for compatibility)
    contractVersion?: string;
    modelVersion?: string;
    featureVersion?: string;
    generatedAt?: string;
    lineage?: {
        requestId?: string;
        jobId?: number | null;
        attempt?: number;
    };
}

export type ReportSections = {
    title: string;
    content: string;
    order: number;
}

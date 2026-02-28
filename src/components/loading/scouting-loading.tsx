"use client";

import React, { useState, useEffect } from 'react';
import { 
    Loader2, 
    ShieldCheck, 
    Database, 
    Search, 
    Cpu, 
    BarChart3, 
    CheckCircle2,
    XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/icon/logo";

interface ScoutingLoadingProps {
    progress?: number;
    currentStep?: string;
    onCancel?: () => void;
}

const LOADING_STEPS = [
    { id: 'pending', label: 'Ingesting GRID Match Data', icon: Database },
    { id: 'processing', label: 'Parsing Round-by-Round Events', icon: Search },
    { id: 'analyzing', label: 'Calculating Performance Velocity', icon: Cpu },
    { id: 'generating', label: 'Synthesizing Strategic Insights', icon: BarChart3 },
    { id: 'finalizing', label: 'Finalizing Intelligence Brief', icon: ShieldCheck },
];

export function ScoutingLoading({ progress: externalProgress, currentStep: externalStep, onCancel }: ScoutingLoadingProps) {
    const [internalProgress, setInternalProgress] = useState(0);

    // Uses external progress if provided, otherwise simulate
    const progress = externalProgress ?? internalProgress;
    const currentStepIndex = useMemo(() => {
        if (externalStep) {
            const idx = LOADING_STEPS.findIndex(s => s.id === externalStep);
            return idx !== -1 ? idx : 0;
        }
        const idx = Math.floor((progress / 100) * LOADING_STEPS.length);
        return Math.min(idx, LOADING_STEPS.length - 1);
    }, [externalStep, progress]);
    useEffect(() => {
        if (externalProgress === undefined) {
            const interval = setInterval(() => {
                setInternalProgress((prev) => {
                    if (prev >= 100) return 100;
                    const increment = Math.random() * 5;
                    return Math.min(prev + increment, 100);
                });
            }, 300);
            return () => clearInterval(interval);
        }
    }, [externalProgress]);


    return (
        <div className="fixed inset-0 z-100 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-md space-y-12">
                {/* Tactical Brain / Logo */}
                <div className="relative">
                    <div className="absolute inset-0 bg-[#0FA3B1]/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative flex justify-center">
                        <div className="p-6 rounded-3xl bg-card border border-[#0FA3B1]/30 shadow-2xl">
                            <Logo size={64} showText={false} />
                            <div className="absolute -top-2 -right-2">
                                <Loader2 className="w-8 h-8 text-[#0FA3B1] animate-spin" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Generating Intelligence Briefing
                    </h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">
                        Analyzing {LOADING_STEPS[currentStepIndex].label}...
                    </p>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-6">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border">
                        <div 
                            className="h-full bg-[#0FA3B1] transition-all duration-300 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                        </div>
                    </div>

                    {/* Step Indicators */}
                    <div className="space-y-3">
                        {LOADING_STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStepIndex;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div 
                                    key={step.id}
                                    className={`flex items-center gap-3 transition-all duration-500 ${
                                        isActive ? 'opacity-100 translate-x-2' : isCompleted ? 'opacity-50' : 'opacity-20'
                                    }`}
                                >
                                    <div className={`p-1.5 rounded-lg ${
                                        isCompleted ? 'bg-green-500/10' : isActive ? 'bg-[#0FA3B1]/10' : 'bg-muted'
                                    }`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#0FA3B1] animate-pulse' : 'text-muted-foreground'}`} />
                                        )}
                                    </div>
                                    <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-8 flex flex-col items-center gap-4">
                    <p className="text-xs text-muted-foreground italic">
                        Estimated time remaining: {Math.max(0, Math.ceil((100 - progress) / 5))} seconds
                    </p>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onCancel}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                        <XCircle className="w-4 h-4" />
                        Cancel Analysis
                    </Button>
                </div>
            </div>
            
            {/* Background Decorative Elements */}
            <div className="absolute bottom-12 left-12 opacity-5 pointer-events-none hidden lg:block">
                <div className="font-mono text-[10px] text-left space-y-1">
                    <div>[SYSTEM_INIT] ... OK</div>
                    <div>[GRID_HANDSHAKE] ... OK</div>
                    <div>[PARSING_SERIES_ID_53625] ... IN_PROGRESS</div>
                    <div>[CALCULATING_PLAYER_ELO] ... OK</div>
                    <div>[DETECTING_DEFENSE_TENDENCIES] ... OK</div>
                </div>
            </div>
        </div>
    );
}

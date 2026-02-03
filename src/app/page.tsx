"use client";

import React, { useState } from 'react';
import { 
    Search, 
    TrendingUp, 
    ShieldAlert, 
    History, 
    ArrowRight,
    Zap,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/icon/logo";
import { ScoutingLoading } from "@/components/loading/scouting-loading";

import { useRouter } from 'next/navigation';
import apiClient from "@/lib/api/apiclient";
import {ReportRequest, ReportStatusResponse} from "@/lib/types/interfaces";
import {pollForReport} from "@/app/report/[teamId]/polling";
import logger from "@/lib/logger";

export default function Home() {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingStep, setLoadingStep] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setLoadingProgress(0);
        setLoadingStep("Initializing...");

        try {
            const response = await apiClient.post<ReportRequest, ReportStatusResponse>(
                '/reports/generate',
                {userPrompt: prompt}
            );
            const requestId = response.requestId;
            console.log('Report request created:', requestId);

            const finalStatus = await pollForReport(requestId, {
                interval: 3000, // Poll every 3 seconds
                maxAttempts: 60, // 3 minutes max
                onProgress: (status) => {
                    logger.info('Poll update:', status);
                    setLoadingProgress(status.progress);
                    setLoadingStep(status.currentStep);
                },
                onError: (err) => {
                    logger.error('Polling error:', err);
                }
            });
            logger.info('Report ready:', finalStatus);

            router.push(`/report/${requestId}`);
        }
        catch (error) {
            logger.error('Report generation failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const examplePrompts = [
        "Scout Team Liquid vs Sentinels",
        "Recent form of Cloud9 on Ascent",
        "How to exploit NRG's B-site defense?",
        "Compare TenZ vs Aspas statistics"
    ];

    const features = [
        {
            icon: <Zap className="w-6 h-6 text-blue-500" />,
            title: "90-Second Executive Brief",
            description: "Get the most critical win conditions and map vetoes in seconds, not hours."
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-green-500" />,
            title: "Velocity & Trend Analysis",
            description: "Identify if teams are slumping or peaking with momentum-based performance tracking."
        },
        {
            icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
            title: "Counter-Risk Modeling",
            description: "Understand the second-order effects of your tactical decisions before the match starts."
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-[#0FA3B1]/30">
            {
                isLoading && <ScoutingLoading
                    progress={loadingProgress}
                    currentStep={loadingStep}
                    onCancel={() => {
                        setIsLoading(false);
                        setError(null);
                    }}
                />
            }
            
            {/* Header / Nav */}
            <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Logo size={32} textClassName="text-lg" />
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Documentation</Button>
                        <Button className="bg-[#0FA3B1] hover:bg-[#0FA3B1]/90 text-white font-semibold">Sign In</Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-12 lg:py-24 flex flex-col items-center">
                {/* Hero Section */}
                <div className="text-center mb-16 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0FA3B1]/10 border border-[#0FA3B1]/20 text-[#0FA3B1] text-xs font-medium mb-6">
                        <Zap className="w-3 h-3" />
                        <span>Powered by GRID Official Esports Data</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight">
                        Master the Meta with <span className="text-[#0FA3B1]">Elite Intelligence</span>
                    </h1>
                    <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed">
                        The automated scouting report generator built for professional VALORANT coaches. 
                        Transform raw GRID data into actionable tactical orders in under 90 seconds.
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="w-full max-w-2xl mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {/* Prompt Bar */}
                <div className="w-full max-w-2xl mb-12">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-[#0FA3B1] to-blue-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                        <div className="relative flex items-center bg-card border border-border rounded-2xl p-2 shadow-2xl">
                            <Search className="w-6 h-6 text-muted-foreground ml-4" />
                            <input 
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                placeholder="Scout Team Liquid on Ascent..."
                                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg placeholder:text-muted-foreground/50 focus:ring-0"
                            />
                            <Button 
                                onClick={handleGenerate}
                                className="bg-[#0FA3B1] hover:bg-[#0FA3B1]/90 text-white rounded-xl px-6 py-6 font-bold flex items-center gap-2"
                            >
                                Generate
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Example Prompts */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {examplePrompts.map((ex, i) => (
                            <button 
                                key={i}
                                onClick={() => {
                                    setPrompt(ex);
                                    // handleGenerate(); // Optional: trigger immediately
                                }}
                                className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors"
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 w-full mt-12">
                    {features.map((feature, i) => (
                        <Card key={i} className="bg-card border-border hover:border-muted-foreground/30 transition-colors">
                            <CardHeader>
                                <div className="mb-4">{feature.icon}</div>
                                <CardTitle className="text-foreground text-lg font-bold">{feature.title}</CardTitle>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Recent Reports / Placeholder */}
                <div className="w-full mt-24 border-t border-border pt-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <History className="w-5 h-5 text-[#0FA3B1]" />
                            Recent Intelligence
                        </h2>
                        <Button variant="link" className="text-muted-foreground hover:text-[#0FA3B1]">View all history</Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:bg-accent transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground group-hover:text-[#0FA3B1]">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">Team {n === 1 ? 'Liquid' : n === 2 ? 'Sentinels' : n === 3 ? 'Cloud9' : 'NRG'}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Generated 2h ago</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="border-t border-border py-12 mt-24 bg-card">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Logo size={24} className="grayscale opacity-50" textClassName="text-sm" />
                    <div className="flex gap-8 text-sm text-muted-foreground font-medium">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-foreground transition-colors">GRID API</a>
                        <a href="#" className="hover:text-foreground transition-colors">Cloud9 Hackathon</a>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        © 2026 Stratigen AI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
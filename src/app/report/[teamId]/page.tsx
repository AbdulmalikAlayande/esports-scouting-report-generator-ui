"use client";

import React, { useState } from 'react';
import { 
    Download, 
    Share2, 
    Filter, 
    Calendar,
    LayoutDashboard,
    Map as MapIcon,
    Users,
    Layers,
    ShieldAlert,
    BarChart,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/icon/logo";
import { ExecutiveSummary } from "./_sections/executive-summary";
import { MapPerformance } from "./_sections/map-performance";
import { PlayerAnalysis } from "./_sections/player-analysis";
import { CompositionGrid } from "./_sections/composition-grid";
import { WeaknessRanking } from "./_sections/weakness-ranking";
import { DetailedStats } from "./_sections/detailed-stats";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";

type TabType = '90s' | '5m' | '60m';

export default function ReportPage({ params }: { params: { teamId: string } }) {
    const [activeTab, setActiveTab] = useState<TabType>('90s');

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Sticky Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Logo size={28} showText={false} />
                        <div className="h-6 w-px bg-border"></div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm font-black uppercase tracking-tighter">Team Liquid</h1>
                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-bold tracking-widest">ID: {params.teamId}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                <span>vs. SENTINELS</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    FEB 02, 2026
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-bold uppercase">
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                        <Button size="sm" className="h-9 gap-2 bg-[#0FA3B1] hover:bg-[#0FA3B1]/90 text-white text-xs font-bold uppercase">
                            <Download className="w-4 h-4" />
                            Export PDF
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Layer Selection Tabs */}
                <div className="flex items-center justify-between mb-8 p-1 bg-muted/50 rounded-xl border border-border w-fit">
                    <button 
                        onClick={() => setActiveTab('90s')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            activeTab === '90s' ? 'bg-card text-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        90s Brief
                    </button>
                    <button 
                        onClick={() => setActiveTab('5m')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            activeTab === '5m' ? 'bg-card text-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Layers className="w-4 h-4" />
                        5m Breakdown
                    </button>
                    <button 
                        onClick={() => setActiveTab('60m')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            activeTab === '60m' ? 'bg-card text-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <BarChart className="w-4 h-4" />
                        60m Appendix
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Primary Report Content */}
                    <div className="lg:col-span-3 space-y-12">
                        {activeTab === '90s' && (
                            <div className="animate-in fade-in duration-500">
                                <ExecutiveSummary />
                            </div>
                        )}
                        {activeTab === '5m' && (
                            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ExecutiveSummary />
                                <WeaknessRanking />
                                <MapPerformance />
                                <PlayerAnalysis />
                                <CompositionGrid />
                            </div>
                        )}
                        {activeTab === '60m' && (
                            <DetailedStats />
                        )}
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-6">
                        <Card className="bg-[#0FA3B1]/5 border-[#0FA3B1]/20">
                            <CardHeader className="p-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-[#0FA3B1]" />
                                    Filter Intel
                                </CardTitle>
                            </CardHeader>
                            <div className="p-4 pt-0 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Time Window</label>
                                    <select className="w-full bg-background border border-border rounded-lg p-2 text-xs font-medium outline-none">
                                        <option>Last 3 Months</option>
                                        <option>Last 6 Months</option>
                                        <option>Last 12 Matches</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Tournament</label>
                                    <select className="w-full bg-background border border-border rounded-lg p-2 text-xs font-medium outline-none">
                                        <option>All Tournaments</option>
                                        <option>VCT Champions</option>
                                        <option>VCT Masters</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2">Key Navigation</h4>
                            <div className="space-y-1">
                                {[
                                    { icon: <ShieldAlert className="w-4 h-4" />, label: "How to Win" },
                                    { icon: <MapIcon className="w-4 h-4" />, label: "Maps" },
                                    { icon: <Users className="w-4 h-4" />, label: "Players" },
                                    { icon: <Zap className="w-4 h-4" />, label: "Compositions" },
                                ].map((item) => (
                                    <button 
                                        key={item.label}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-sm font-bold text-muted-foreground hover:text-foreground"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

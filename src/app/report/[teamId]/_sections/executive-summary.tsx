"use client";

import React from 'react';
import { 
    Zap, 
    Target, 
    Ban, 
    TrendingUp, 
    TrendingDown, 
    Minus,
    AlertTriangle,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { InsightCard } from "../_components/insight-card";

interface InsightData {
    id: string;
    title: string;
    action: string;
    why: string;
    trend: 'rising' | 'declining' | 'stable';
    risk: string;
    confidence: number;
    icon: React.ReactNode;
}

const INSIGHTS: InsightData[] = [
    {
        id: '1',
        title: 'MAP VETO',
        action: 'BAN Icebox',
        why: '30% WR over 12 games (dropped 12% in last month)',
        trend: 'declining',
        risk: 'Forces Ascent (Opponent 75% WR)',
        confidence: 89,
        icon: <Ban className="w-5 h-5 text-red-500" />
    },
    {
        id: '2',
        title: 'PLAYER TARGET',
        action: 'TARGET mada',
        why: '85% team loss rate when he gets first death',
        trend: 'stable',
        risk: 'High trade potential if not isolated',
        confidence: 85,
        icon: <Target className="w-5 h-5 text-[#0FA3B1]" />
    },
    {
        id: '3',
        title: 'TACTICAL PLAN',
        action: 'EXPLOIT Post-Plant',
        why: 'Only 21% spike explosion rate (weak positioning)',
        trend: 'rising',
        risk: 'Aggressive retake needed to punish',
        confidence: 92,
        icon: <Zap className="w-5 h-5 text-amber-500" />
    }
];

export function ExecutiveSummary() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="w-6 h-6 text-amber-500" />
                        90-Second Executive Brief
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        High-priority win conditions and strategic alerts.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SYSTEM CONFIDENCE: 88%
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INSIGHTS.map((insight) => (
                    <InsightCard 
                        key={insight.id}
                        {...insight}
                    />
                ))}
            </div>

            {/* Watch Outs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-red-500/5 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-red-500/10">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider">Watch Out: Round 3 Aggression</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Opponent tends to force-buy Stingers on R3 after losing R2. Maintain distance and play for long-range duels.
                        </p>
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-amber-500/5 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Watch Out: Mid Control Shift</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Team Liquid often pivots to a 3-man mid stack if they lose the first two gun rounds. Expect slow mid pressure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

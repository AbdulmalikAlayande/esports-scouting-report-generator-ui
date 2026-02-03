"use client";

import React from 'react';
import { ShieldAlert, AlertCircle, ChevronRight, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const WEAKNESSES = [
    { 
        id: 'w1', 
        severity: 'Critical', 
        title: 'B-Site Retake Vulnerability', 
        description: 'Team Liquid fails to retake B-site 82% of the time on Icebox when losing the first 2 duels.',
        evidence: 'Last 10 instances: 8 losses, 2 wins. Zero utility remaining in 7 of 10 rounds.',
        impact: 'High'
    },
    { 
        id: 'w2', 
        severity: 'Major', 
        title: 'Mid-Round Economy Collapse', 
        description: 'Frequent over-buying after winning pistol leads to weak bonus rounds and long losing streaks.',
        evidence: 'Loss of R3 bonus leads to a 4-round loss streak in 65% of matches.',
        impact: 'Medium'
    },
    { 
        id: 'w3', 
        severity: 'Moderate', 
        title: 'mada Early Aggression', 
        description: 'Excessive dry-peeking early round R5-R8 on Defense side.',
        evidence: '0.45 K/D in opening duels during these specific rounds.',
        impact: 'Medium'
    }
];

export function WeaknessRanking() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                    Vulnerability Assessment
                </h2>
                <p className="text-muted-foreground text-sm">
                    Ranked exploitable weaknesses based on statistical certainty and impact.
                </p>
            </div>

            <div className="space-y-3">
                {WEAKNESSES.map((weakness) => (
                    <Card key={weakness.id} className="bg-card/50 border-border border-l-4 border-l-red-500 overflow-hidden hover:bg-muted/30 transition-colors cursor-pointer group">
                        <div className="p-4 flex gap-4">
                            <div className={`mt-1 p-1.5 rounded-lg ${
                                weakness.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                                <AlertCircle className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-foreground group-hover:text-red-500 transition-colors">{weakness.title}</h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{weakness.severity}</span>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {weakness.description}
                                </p>
                                <div className="pt-2 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Target className="w-3 h-3" />
                                        Evidence Verified
                                    </div>
                                    <div className="text-red-500">
                                        Impact: {weakness.impact}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

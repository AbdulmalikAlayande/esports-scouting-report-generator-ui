"use client";

import React from 'react';
import { 
    TrendingUp, 
    TrendingDown, 
    Minus,
    AlertTriangle,
    ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface InsightCardProps {
    title: string;
    action: string;
    why: string;
    trend: 'rising' | 'declining' | 'stable';
    risk: string;
    confidence: number;
    icon: React.ReactNode;
    onClick?: () => void;
}

export function InsightCard({
    title,
    action,
    why,
    trend,
    risk,
    confidence,
    icon,
    onClick
}: InsightCardProps) {
    return (
        <Card 
            onClick={onClick}
            className="relative overflow-hidden group hover:border-[#0FA3B1]/50 transition-all cursor-pointer bg-card/50 backdrop-blur-sm"
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {icon}
                        {title}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <CardTitle className="text-xl font-black text-foreground uppercase italic tracking-tight">
                    {action}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <div className="mt-1">
                            {trend === 'rising' ? (
                                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                            ) : trend === 'declining' ? (
                                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                                <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                        </div>
                        <p className="text-sm text-foreground/90 font-medium leading-snug">
                            {why}
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase">
                        <AlertTriangle className="w-3 h-3" />
                        Risk: {risk}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                        <span>CONFIDENCE</span>
                        <span>{confidence}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#0FA3B1] rounded-full transition-all duration-500"
                            style={{ width: `${confidence}%` }}
                        ></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

"use client";

import React from 'react';
import { Map as MapIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MAP_STATS = [
    { name: 'Ascent', wins: 10, losses: 2, winRate: 83, attackWR: 75, defenseWR: 91, trend: 'rising' },
    { name: 'Bind', wins: 6, losses: 4, winRate: 60, attackWR: 58, defenseWR: 62, trend: 'stable' },
    { name: 'Haven', wins: 5, losses: 5, winRate: 50, attackWR: 48, defenseWR: 52, trend: 'stable' },
    { name: 'Sunset', wins: 4, losses: 6, winRate: 40, attackWR: 42, defenseWR: 38, trend: 'declining' },
    { name: 'Icebox', wins: 3, losses: 7, winRate: 30, attackWR: 20, defenseWR: 40, trend: 'declining' },
];

export function MapPerformance() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MapIcon className="w-6 h-6 text-[#0FA3B1]" />
                    Map Performance Analysis
                </h2>
                <p className="text-muted-foreground text-sm">
                    Detailed win rates and side-bias for all competitive maps.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {MAP_STATS.map((map) => (
                    <Card key={map.name} className="bg-card/50 border-border overflow-hidden group">
                        <div className="flex flex-col md:flex-row md:items-center">
                            {/* Map Name & WR */}
                            <div className="p-4 md:w-1/4 border-b md:border-b-0 md:border-r border-border bg-muted/30">
                                <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
                                    <h3 className="text-lg font-bold tracking-tight">{map.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-black ${map.winRate >= 70 ? 'text-green-500' : map.winRate <= 40 ? 'text-red-500' : 'text-foreground'}`}>
                                            {map.winRate}%
                                        </span>
                                        {map.trend === 'rising' ? (
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                        ) : map.trend === 'declining' ? (
                                            <TrendingDown className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <Minus className="w-4 h-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                        {map.wins}W - {map.losses}L
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bars */}
                            <div className="p-4 flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                        <span className="text-muted-foreground">Attack Conversion</span>
                                        <span className="text-foreground">{map.attackWR}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-amber-500/80 rounded-full"
                                            style={{ width: `${map.attackWR}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                        <span className="text-muted-foreground">Defense Conversion</span>
                                        <span className="text-foreground">{map.defenseWR}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#0FA3B1]/80 rounded-full"
                                            style={{ width: `${map.defenseWR}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Stats */}
                            <div className="p-4 md:w-1/4 border-t md:border-t-0 md:border-l border-border bg-muted/10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Pistol WR</p>
                                        <p className="text-sm font-mono font-bold">58%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Eco Conv.</p>
                                        <p className="text-sm font-mono font-bold text-green-500">22%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Retake %</p>
                                        <p className="text-sm font-mono font-bold">42%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Clutch %</p>
                                        <p className="text-sm font-mono font-bold">18%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

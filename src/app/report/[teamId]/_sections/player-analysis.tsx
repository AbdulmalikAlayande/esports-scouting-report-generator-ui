"use client";

import React from 'react';
import { Users, TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PLAYERS = [
    { name: 'mada', role: 'Duelist', kd: 0.89, trend: 'declining', impact: 'High', agents: ['Jett', 'Raze', 'Neon'], status: 'Target' },
    { name: 'skuba', role: 'Controller', kd: 1.05, trend: 'stable', impact: 'Medium', agents: ['Omen', 'Viper', 'Clove'], status: 'Watch' },
    { name: 'Player312', role: 'Initiator', kd: 1.17, trend: 'rising', impact: 'Extreme', agents: ['Sova', 'Fade', 'Skye'], status: 'Danger' },
    { name: 'v1c', role: 'Sentinel', kd: 1.02, trend: 'stable', impact: 'Medium', agents: ['Killjoy', 'Cypher'], status: 'Stable' },
];

export function PlayerAnalysis() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#0FA3B1]" />
                    Player Intelligence
                </h2>
                <p className="text-muted-foreground text-sm">
                    Individual performance metrics and behavioral patterns.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLAYERS.map((player) => (
                    <Card key={player.name} className="bg-card/50 border-border group overflow-hidden">
                        <CardHeader className="p-4 flex flex-row items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-border group-hover:border-[#0FA3B1]/50 transition-colors">
                                <AvatarFallback className="bg-muted text-xs font-bold">{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold">{player.name}</CardTitle>
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                        player.status === 'Target' ? 'bg-red-500/10 text-red-500' :
                                        player.status === 'Danger' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-muted text-muted-foreground'
                                    }`}>
                                        {player.status}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium">{player.role}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">K/D Ratio</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-mono font-bold">{player.kd}</span>
                                        {player.trend === 'rising' ? (
                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                        ) : player.trend === 'declining' ? (
                                            <TrendingDown className="w-3 h-3 text-red-500" />
                                        ) : (
                                            <Minus className="w-3 h-3 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Impact</p>
                                    <span className={`text-sm font-bold ${player.impact === 'Extreme' ? 'text-[#0FA3B1]' : 'text-foreground'}`}>
                                        {player.impact}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Clutch %</p>
                                    <span className="text-sm font-mono font-bold">18%</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Most Played Agents</p>
                                <div className="flex gap-1">
                                    {player.agents.map((agent) => (
                                        <span key={agent} className="px-2 py-1 rounded-md bg-muted text-[10px] font-bold">
                                            {agent}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

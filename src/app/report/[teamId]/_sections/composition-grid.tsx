"use client";

import React from 'react';
import { Layers, ShieldCheck, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const COMPOSITIONS = [
    { 
        name: 'Signature Aggression', 
        agents: ['Jett', 'Sova', 'KAY/O', 'Omen', 'Viper'], 
        winRate: 68, 
        matches: 12, 
        maps: ['Ascent', 'Bind', 'Sunset'] 
    },
    { 
        name: 'Anti-Dive Meta', 
        agents: ['Raze', 'Fade', 'Breach', 'Clove', 'Cypher'], 
        winRate: 54, 
        matches: 8, 
        maps: ['Lotus', 'Split'] 
    },
];

export function CompositionGrid() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Layers className="w-6 h-6 text-indigo-500" />
                    Composition Intelligence
                </h2>
                <p className="text-muted-foreground text-sm">
                    Agent lineup performance and meta-context analysis.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMPOSITIONS.map((comp) => (
                    <Card key={comp.name} className="bg-card/50 border-border group overflow-hidden">
                        <CardHeader className="p-4 bg-muted/30">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-bold">{comp.name}</CardTitle>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    {comp.winRate}% WR
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {comp.agents.map((agent) => (
                                    <div key={agent} className="flex flex-col items-center gap-1">
                                        <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center font-black text-[10px] uppercase text-muted-foreground group-hover:border-[#0FA3B1]/50 transition-colors">
                                            {agent.substring(0, 2)}
                                        </div>
                                        <span className="text-[9px] font-bold text-muted-foreground">{agent}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <span>{comp.matches} Matches Played</span>
                                <div className="flex gap-2">
                                    {comp.maps.map(m => <span key={m}>{m}</span>)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

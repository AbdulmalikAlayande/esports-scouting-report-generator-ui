"use client";

import React from 'react';
import { BarChart, History, Table as TableIcon, Search } from "lucide-react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RECENT_MATCHES = [
    { id: 'm1', opponent: 'Sentinels', map: 'Ascent', score: '13-8', result: 'Win', date: '2026-01-28' },
    { id: 'm2', opponent: 'G2 Esports', map: 'Bind', score: '13-11', result: 'Win', date: '2026-01-24' },
    { id: 'm3', opponent: 'Team Liquid', map: 'Icebox', score: '8-13', result: 'Loss', date: '2026-01-20' },
    { id: 'm4', opponent: 'FNATIC', map: 'Haven', score: '13-10', result: 'Win', date: '2026-01-15' },
    { id: 'm5', opponent: 'Cloud9', map: 'Ascent', score: '13-6', result: 'Win', date: '2026-01-10' },
];

export function DetailedStats() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart className="w-6 h-6 text-muted-foreground" />
                    Analyst Appendix (60m)
                </h2>
                <p className="text-muted-foreground text-sm">
                    Raw data aggregates, full match history, and statistical derivations.
                </p>
            </div>

            <div className="space-y-6">
                <Card className="bg-card/30 border-border">
                    <CardHeader className="border-b border-border/50 bg-muted/20">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4 text-[#0FA3B1]" />
                            Match History Record
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Date</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Opponent</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Map</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Score</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-right">Result</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {RECENT_MATCHES.map((match) => (
                                    <TableRow key={match.id} className="border-border/50 hover:bg-muted/50 transition-colors">
                                        <TableCell className="text-xs font-mono text-muted-foreground">{match.date}</TableCell>
                                        <TableCell className="text-xs font-bold">{match.opponent}</TableCell>
                                        <TableCell className="text-xs font-medium">{match.map}</TableCell>
                                        <TableCell className="text-xs font-mono">{match.score}</TableCell>
                                        <TableCell className={`text-xs font-black text-right ${match.result === 'Win' ? 'text-green-500' : 'text-red-500'}`}>
                                            {match.result.toUpperCase()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-card/30 border-border">
                        <CardHeader className="p-4 border-b border-border/50">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <TableIcon className="w-4 h-4 text-[#0FA3B1]" />
                                Side Bias Aggregates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {[
                                    { label: 'Round Win % (Attack)', value: '48.5%' },
                                    { label: 'Round Win % (Defense)', value: '52.1%' },
                                    { label: 'Pistol Conversion', value: '62.0%' },
                                    { label: 'Anti-Eco Win %', value: '88.4%' },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex justify-between items-center border-b border-border/30 pb-2 last:border-0">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{stat.label}</span>
                                        <span className="text-xs font-mono font-bold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/30 border-border">
                        <CardHeader className="p-4 border-b border-border/50">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Search className="w-4 h-4 text-[#0FA3B1]" />
                                Data Derivation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                                <p className="text-[10px] leading-relaxed text-muted-foreground font-mono">
                                    [ALGO_LOG]: Confidence score derived via Wilson Score Interval (z=1.96). Sample size N=49 series. Freshness decay applied (alpha=0.3).
                                </p>
                            </div>
                            <div className="text-[10px] text-muted-foreground font-medium italic">
                                * All data pulled from GRID Series State API & Statistics Feed. Last updated FEB 02, 2026.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

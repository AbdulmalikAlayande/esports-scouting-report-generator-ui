"use client";

import React, { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Authentication logic will go here
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-zinc-950 dark:bg-zinc-50 rounded-xl flex items-center justify-center mb-4">
                        <ShieldCheck className="text-zinc-50 dark:text-zinc-950 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Scouting Portal</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Sign in to access your reports</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-50 transition-all text-zinc-900 dark:text-zinc-50"
                                placeholder="coach@cloud9.gg"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-50 transition-all text-zinc-900 dark:text-zinc-50"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-zinc-950 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Authorized personnel only. Access is monitored.
                    </p>
                </div>
            </div>
        </div>
    );
}
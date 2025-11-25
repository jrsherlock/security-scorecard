import React from 'react';
import { Shield } from 'lucide-react';

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Security Posture Scorecard
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-slate-500 hidden sm:block">
                            v2.0.0 • Enterprise Edition
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

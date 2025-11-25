import React from 'react';
import { Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

export const Layout = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-950 dark:bg-slate-950 bg-white text-slate-100 dark:text-slate-100 text-slate-900 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-800 dark:border-slate-800 border-slate-200 bg-slate-950/80 dark:bg-slate-950/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 dark:supports-[backdrop-filter]:bg-slate-950/60 supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <Shield className="w-6 h-6 text-blue-400 dark:text-blue-400 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 dark:from-white dark:to-slate-400 from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                Security Posture Scorecard
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-slate-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-slate-600" />
                            )}
                        </Button>
                        <div className="text-xs text-slate-500 dark:text-slate-500 text-slate-600 hidden sm:block">
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

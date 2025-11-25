import React from 'react';
import { Settings, Sliders, Scale } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Select } from '../ui/Select';
import { INDUSTRY_BENCHMARKS } from '../../data/constants';

export const Controls = ({
    show,
    domainScores,
    updateSubdomainScore,
    updateDomainWeight,
    activeVisualization,
    setActiveVisualization,
    chartStyle,
    setChartStyle
}) => {
    if (!show) return null;

    const visualizations = [
        { id: 'overview', label: 'Overview' },
        { id: 'radar', label: 'Radar Analysis' },
        { id: 'gauges', label: 'Domain Gauges' },
        { id: 'bars', label: 'Benchmarks' },
        { id: 'gaps', label: 'Gap Analysis' },
        { id: 'peers', label: 'Peer Comparison' }
    ];

    const totalWeight = Object.values(domainScores).reduce((sum, domain) => sum + domain.weight, 0);

    return (
        <div className="w-80 flex-shrink-0 space-y-6">
            <Card className="sticky top-24 border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/80 shadow-xl dark:shadow-none">
                <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Weight Rubric */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Scale className="w-4 h-4 text-slate-700 dark:text-slate-400" />
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-400">Weight Rubric</label>
                            <span className={`ml-auto text-xs font-bold ${totalWeight === 100
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                {totalWeight}%
                            </span>
                        </div>
                        <div className="space-y-3">
                            {Object.entries(domainScores).map(([key, domain]) => (
                                <div key={key} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-800 dark:text-slate-300 font-medium">
                                            {domain.name.split('&')[0].trim()}
                                        </span>
                                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                                            {domain.weight}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={domain.weight}
                                        onChange={(e) => updateDomainWeight(key, parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                                    />
                                </div>
                            ))}
                        </div>
                        {totalWeight !== 100 && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                Weights must sum to 100%
                            </p>
                        )}
                    </div>

                    {/* Visualization Selector */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-400 mb-2">View Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                            {visualizations.map((vis) => (
                                <button
                                    key={vis.id}
                                    onClick={() => setActiveVisualization(vis.id)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${activeVisualization === vis.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {vis.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Domain Score Adjusters */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sliders className="w-4 h-4 text-slate-700 dark:text-slate-400" />
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-400">Simulation Controls</label>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(domainScores).map(([key, domain]) => (
                                <div key={key} className="space-y-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-300">{domain.name.split('&')[0]}</span>
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{domain.score}%</span>
                                    </div>
                                    <div className="space-y-3">
                                        {Object.entries(domain.subdomains).map(([subKey, value]) => (
                                            <div key={subKey} className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-500">
                                                    <span>{subKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <span>{value}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={value}
                                                    onChange={(e) => updateSubdomainScore(key, subKey, e.target.value)}
                                                    className="w-full h-1 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

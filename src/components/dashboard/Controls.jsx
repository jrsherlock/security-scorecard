import React from 'react';
import { Settings, Sliders } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Select } from '../ui/Select';
import { INDUSTRY_BENCHMARKS } from '../../data/constants';

export const Controls = ({
    show,
    selectedIndustry,
    setSelectedIndustry,
    companySize,
    setCompanySize,
    domainScores,
    updateSubdomainScore,
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

    return (
        <div className="w-80 flex-shrink-0 space-y-6">
            <Card className="sticky top-24 border-slate-700/50 bg-slate-900/80">
                <CardHeader className="border-b border-slate-800">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Settings className="w-4 h-4 text-blue-400" />
                        Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Industry Selection */}
                    <Select
                        label="Industry Vertical"
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        options={Object.entries(INDUSTRY_BENCHMARKS).map(([key, val]) => ({
                            value: key,
                            label: val.name
                        }))}
                    />

                    {/* Company Size */}
                    <Select
                        label="Company Size"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        options={[
                            { value: 'small', label: 'Small (1-100)' },
                            { value: 'mid-market', label: 'Mid-Market (100-1000)' },
                            { value: 'enterprise', label: 'Enterprise (1000+)' }
                        ]}
                    />

                    {/* Visualization Selector */}
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-2">View Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                            {visualizations.map((vis) => (
                                <button
                                    key={vis.id}
                                    onClick={() => setActiveVisualization(vis.id)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${activeVisualization === vis.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
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
                            <Sliders className="w-4 h-4 text-slate-400" />
                            <label className="text-xs font-medium text-slate-400">Simulation Controls</label>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {Object.entries(domainScores).map(([key, domain]) => (
                                <div key={key} className="space-y-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-slate-300">{domain.name.split('&')[0]}</span>
                                        <span className="text-xs font-bold text-blue-400">{domain.score}%</span>
                                    </div>
                                    <div className="space-y-3">
                                        {Object.entries(domain.subdomains).map(([subKey, value]) => (
                                            <div key={subKey} className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-500">
                                                    <span>{subKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <span>{value}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={value}
                                                    onChange={(e) => updateSubdomainScore(key, subKey, e.target.value)}
                                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
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

import React, { useRef } from 'react';
import { Download, Shield, Info, Maximize2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EditableText } from '../ui/EditableText';
import { Tooltip } from '../ui/Tooltip';
import { Modal } from '../ui/Modal';
import { getMaturityLevel, getScoreColor } from '../../utils/helpers';

const GaugeChart = ({ value, size = 200 }) => {
    const radius = size * 0.4;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    const color = getScoreColor(value);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                />
                {/* Progress Circle */}
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{Math.round(value)}</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-1">Score</span>
            </div>
        </div>
    );
};

export const OverallScore = ({ score, maturityLevel, industryBenchmark, domainScores, title, onTitleChange }) => {
    const cardRef = useRef(null);
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleExport = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, {
                    backgroundColor: '#0f172a',
                    filter: (node) => !node.classList?.contains('export-exclude')
                });
                const link = document.createElement('a');
                link.download = 'overall-score.png';
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Export failed:', err);
            }
        }
    };

    const content = (
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div id="overall-gauge" className="flex-shrink-0">
                <GaugeChart value={score} size={240} />
            </div>

            <div className="flex-1 w-full space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            <EditableText value={title} onChange={onTitleChange} />
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                Level {maturityLevel.level}: {maturityLevel.name}
                            </span>
                            <span className={`text-sm font-medium ${score >= industryBenchmark.avg ? 'text-emerald-400' : 'text-red-400'}`}>
                                {score >= industryBenchmark.avg ? '+' : ''}{score - industryBenchmark.avg} vs Industry
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(domainScores).map(([key, domain]) => (
                        <div key={key} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs text-slate-700 dark:text-slate-400 truncate" title={domain.name}>{domain.name.split('&')[0]}</div>
                                <Tooltip
                                    content={
                                        <div className="space-y-1">
                                            <div className="font-semibold">{domain.name}</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">{domain.description}</div>
                                            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2">Weight: {domain.weight}%</div>
                                        </div>
                                    }
                                >
                                    <Info className="w-3 h-3 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                                </Tooltip>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-bold text-slate-900 dark:text-white">{domain.score}</span>
                                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-1.5">
                                    <div
                                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${domain.score}%`, backgroundColor: getScoreColor(domain.score) }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700" ref={cardRef}>
                <CardContent className="p-8">
                    <div className="flex justify-end gap-2 mb-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(true)} title="Expand" className="export-exclude">
                            <Maximize2 className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleExport} title="Export as PNG" className="export-exclude">
                            <Download className="w-4 h-4 text-slate-400" />
                        </Button>
                    </div>
                    {content}
                </CardContent>
            </Card>
            <Modal isOpen={isExpanded} onClose={() => setIsExpanded(false)} title={title} size="xlarge">
                {content}
            </Modal>
        </>
    );
};

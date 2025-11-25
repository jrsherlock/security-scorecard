import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EditableText } from '../ui/EditableText';
import { getScoreColor, getMaturityLevel } from '../../utils/helpers';
import { COLORS, MATURITY_LEVELS } from '../../data/constants';

const Gauge = ({ value, size = 180, label }) => {
    const percentage = (value / 100) * 100;
    const angle = (percentage / 100) * 180 - 90;
    const maturity = getMaturityLevel(value);

    const polarToCartesian = (cx, cy, r, angle) => {
        const rad = (angle - 90) * Math.PI / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const getArcPath = (startAngle, endAngle, radius) => {
        const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
        const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
                {/* Background segments */}
                {MATURITY_LEVELS.map((m, i) => {
                    const startAngle = -90 + (m.range[0] / 100) * 180;
                    const endAngle = -90 + (m.range[1] / 100) * 180;
                    return (
                        <path
                            key={i}
                            d={getArcPath(startAngle, endAngle, size * 0.4)}
                            fill="none"
                            stroke={m.color}
                            strokeWidth={size * 0.08}
                            opacity={0.2}
                        />
                    );
                })}

                {/* Active Value Arc */}
                <path
                    d={getArcPath(-90, -90 + (percentage / 100) * 180, size * 0.4)}
                    fill="none"
                    stroke={maturity.color}
                    strokeWidth={size * 0.08}
                    strokeLinecap="round"
                />

                {/* Needle */}
                <g transform={`rotate(${angle}, ${size / 2}, ${size / 2})`}>
                    <line
                        x1={size / 2}
                        y1={size / 2}
                        x2={size / 2}
                        y2={size * 0.15}
                        stroke="#e2e8f0"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    <circle cx={size / 2} cy={size / 2} r={4} fill="#e2e8f0" />
                </g>

                <text x={size / 2} y={size * 0.5} textAnchor="middle" className="text-2xl font-bold" fill={maturity.color}>
                    {Math.round(value)}
                </text>
                <text x={size / 2} y={size * 0.6} textAnchor="middle" className="text-xs fill-slate-500">
                    {maturity.name}
                </text>
            </svg>
            <div className="text-sm font-medium text-slate-300 mt-1">{label}</div>
        </div>
    );
};

export const DomainGauges = ({ domainScores, title, onTitleChange }) => {
    const containerRef = useRef(null);

    const handleExport = async () => {
        if (containerRef.current) {
            try {
                const dataUrl = await toPng(containerRef.current, {
                    backgroundColor: '#0f172a',
                    filter: (node) => !node.classList?.contains('export-exclude')
                });
                const link = document.createElement('a');
                link.download = 'domain-gauges.png';
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Export failed:', err);
            }
        }
    };

    return (
        <div ref={containerRef} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-lg font-semibold text-slate-100">
                    <EditableText value={title} onChange={onTitleChange} />
                </h3>
                <Button variant="ghost" size="icon" onClick={handleExport} title="Export as PNG" className="export-exclude">
                    <Download className="w-4 h-4 text-slate-400" />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(domainScores).map(([key, domain]) => (
                    <Card key={key} className="bg-slate-900/40">
                        <CardContent className="p-6 flex flex-col items-center">
                            <Gauge value={domain.score} label={domain.name} />
                            <div className="w-full mt-6 space-y-3">
                                {Object.entries(domain.subdomains).map(([subKey, value]) => (
                                    <div key={subKey} className="flex items-center gap-3">
                                        <span className="text-xs text-slate-400 w-32 truncate">
                                            {subKey.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${value}%`,
                                                    backgroundColor: getScoreColor(value)
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-slate-300 w-8 text-right">{value}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

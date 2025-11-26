import React, { useRef, useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { EditableText } from '../ui/EditableText';
import { Modal } from '../ui/Modal';

const GaugeSegment = ({ startAngle, endAngle, color }) => {
    const radius = 80;
    const center = 100;
    const strokeWidth = 12;

    // Convert degrees to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate coordinates
    // Note: SVG coordinates - 0 degrees is usually 3 o'clock. We want 180 to 360 (or -180 to 0) for top half.
    // Let's map 0-180 input to -180 to 0 (or 180 to 360).
    // Let's say 0 input is at 180 deg (9 o'clock) and 180 input is at 360/0 deg (3 o'clock).

    const mapAngle = (a) => a + 180;

    const x1 = center + radius * Math.cos(startRad + Math.PI); // + PI to rotate 180
    const y1 = center + radius * Math.sin(startRad + Math.PI);
    const x2 = center + radius * Math.cos(endRad + Math.PI);
    const y2 = center + radius * Math.sin(endRad + Math.PI);

    return (
        <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
        />
    );
};

const Needle = ({ value }) => {
    const center = 100;
    const radius = 70;
    // Map 0-100 value to 0-180 degrees
    const angle = (value / 100) * 180;
    const angleRad = (angle * Math.PI) / 180;

    const x = center + radius * Math.cos(angleRad + Math.PI);
    const y = center + radius * Math.sin(angleRad + Math.PI);

    return (
        <g>
            <circle cx={center} cy={center} r="4" fill="#64748b" />
            <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#64748b"
                strokeWidth="2"
            />
        </g>
    );
};

export const CustomerEngagement = ({ score, title, onTitleChange }) => {
    const cardRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExport = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, {
                    backgroundColor: '#0f172a', // Dark mode bg default, will be overridden by actual style if transparent
                    filter: (node) => !node.classList?.contains('export-exclude')
                });
                const link = document.createElement('a');
                link.download = 'customer-engagement.png';
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Export failed:', err);
            }
        }
    };

    const getEngagementText = (s) => {
        if (s <= 25) return { text: 'Low Engagement', color: 'text-red-500' };
        if (s <= 50) return { text: 'Developing Engagement', color: 'text-yellow-500' };
        if (s <= 75) return { text: 'Strong Engagement', color: 'text-blue-500' };
        return { text: 'Excellent Engagement', color: 'text-emerald-500' };
    };

    const status = getEngagementText(score);

    const content = (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-64 h-32 mb-4">
                <svg viewBox="0 0 200 110" className="w-full h-full">
                    {/* Segments */}
                    <GaugeSegment startAngle={0} endAngle={45} color="#ef4444" /> {/* Red */}
                    <GaugeSegment startAngle={45} endAngle={90} color="#eab308" /> {/* Yellow */}
                    <GaugeSegment startAngle={90} endAngle={135} color="#3b82f6" /> {/* Blue */}
                    <GaugeSegment startAngle={135} endAngle={180} color="#10b981" /> {/* Green */}

                    {/* Ticks/Labels could go here but keeping it simple as per image */}

                    {/* Needle */}
                    <Needle value={score} />

                    {/* Score Text */}
                    <text x="100" y="80" textAnchor="middle" className="text-3xl font-bold fill-slate-900 dark:fill-white" style={{ fontSize: '24px' }}>
                        {score}
                    </text>
                </svg>
            </div>
            <div className={`text-lg font-bold ${status.color}`}>
                {status.text}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center max-w-md">
                The Customer Engagement Score measures the Client's responsiveness with the SOC.
            </div>
        </div>
    );

    return (
        <>
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" ref={cardRef}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium text-slate-900 dark:text-white">
                        <EditableText value={title} onChange={onTitleChange} />
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(true)} title="Expand" className="export-exclude">
                            <Maximize2 className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleExport} title="Export as PNG" className="export-exclude">
                            <Download className="w-4 h-4 text-slate-400" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {content}
                </CardContent>
            </Card>

            <Modal isOpen={isExpanded} onClose={() => setIsExpanded(false)} title={title} size="large">
                <div className="flex items-center justify-center bg-white dark:bg-slate-900 p-8 rounded-lg">
                    {content}
                </div>
            </Modal>
        </>
    );
};

import React, { useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { toPng } from 'html-to-image';
import { Download, Maximize2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EditableText } from '../ui/EditableText';
import { Modal } from '../ui/Modal';
import { COLORS } from '../../data/constants';

export const BenchmarkComparison = ({ barData, title, onTitleChange }) => {
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
                link.download = 'benchmark-comparison.png';
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Export failed:', err);
            }
        }
    };

    const chartContent = (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    width={100}
                />
                <Tooltip
                    cursor={{ fill: '#1e293b', opacity: 0.5 }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="score" name="Your Score" radius={[0, 4, 4, 0]} barSize={20}>
                    {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.primary} />
                    ))}
                </Bar>
                <Bar dataKey="industryAvg" name="Industry Avg" fill={COLORS.warning} radius={[0, 4, 4, 0]} barSize={20} opacity={0.6} />
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <Card className="h-full" ref={cardRef}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
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
                    <div className="h-[400px] w-full">
                        {chartContent}
                    </div>
                </CardContent>
            </Card>
            <Modal isOpen={isExpanded} onClose={() => setIsExpanded(false)} title={title} size="xlarge">
                <div style={{ height: '70vh' }}>
                    {chartContent}
                </div>
            </Modal>
        </>
    );
};

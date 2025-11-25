import React, { useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EditableText } from '../ui/EditableText';

export const PeerComparison = ({ peerData, industryName, title, onTitleChange }) => {
    const cardRef = useRef(null);

    const handleExport = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, {
                    backgroundColor: '#0f172a',
                    filter: (node) => !node.classList?.contains('export-exclude')
                });
                const link = document.createElement('a');
                link.download = 'peer-comparison.png';
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Export failed:', err);
            }
        }
    };

    return (
        <Card className="h-full" ref={cardRef}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    <EditableText value={title} onChange={onTitleChange} />
                    <span className="ml-2 text-sm font-normal text-slate-400">- {industryName}</span>
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleExport} title="Export as PNG" className="export-exclude">
                    <Download className="w-4 h-4 text-slate-400" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={peerData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={{ stroke: '#334155' }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                tick={{ fill: '#94a3b8' }}
                                axisLine={{ stroke: '#334155' }}
                            />
                            <Tooltip
                                cursor={{ fill: '#1e293b', opacity: 0.5 }}
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                            />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={60}>
                                {peerData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

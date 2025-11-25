import React, { useRef } from 'react';
import { AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EditableText } from '../ui/EditableText';

export const GapAnalysis = ({ gapData, title, onTitleChange }) => {
    const criticalGaps = gapData.filter(g => g.priority === 'Critical');
    const cardRef = useRef(null);

    const handleExport = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, {
                    backgroundColor: '#0f172a',
                    filter: (node) => !node.classList?.contains('export-exclude')
                });
                const link = document.createElement('a');
                link.download = 'gap-analysis.png';
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
                <div className="flex items-center gap-4">
                    <CardTitle>
                        <EditableText value={title} onChange={onTitleChange} />
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full border border-red-500/20">
                            {criticalGaps.length} Critical
                        </span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleExport} title="Export as PNG" className="export-exclude">
                    <Download className="w-4 h-4 text-slate-400" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                    {gapData.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors group">
                            <div className={`p-2 rounded-lg ${item.priority === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                item.priority === 'High' ? 'bg-orange-500/10 text-orange-400' :
                                    'bg-yellow-500/10 text-yellow-400'
                                }`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-medium text-slate-200 truncate">{item.capability}</h4>
                                    <span className={`text-xs font-bold ${item.priority === 'Critical' ? 'text-red-400' :
                                        item.priority === 'High' ? 'text-orange-400' : 'text-yellow-400'
                                        }`}>
                                        -{item.gap}% Gap
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{item.domain}</span>
                                    <div className="flex items-center gap-2">
                                        <span>Current: {item.current}%</span>
                                        <span>Target: {item.target}%</span>
                                    </div>
                                </div>
                                <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-slate-600 rounded-full"
                                        style={{ width: `${item.current}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {gapData.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                            <CheckCircle className="w-12 h-12 mb-3 text-emerald-500/50" />
                            <p>No critical gaps identified.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

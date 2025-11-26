import React, { useRef } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { toPng } from 'html-to-image';
import { Download, Maximize2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EditableText } from '../ui/EditableText';
import { Modal } from '../ui/Modal';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../data/constants';

export const RadarAnalysis = ({ radarData, title, onTitleChange }) => {
    const cardRef = useRef(null);
    const { theme } = useTheme();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [hiddenSeries, setHiddenSeries] = React.useState([]);

    const handleExport = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, {
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    filter: (node) => !node.classList?.contains('export-exclude')
                });
                const link = document.createElement('a');
                link.download = 'radar-analysis.png';
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Export failed:', err);
            }
        }
    };

    const toggleSeries = (id) => {
        setHiddenSeries(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id]
        );
    };

    const visibleKeys = ['score', 'benchmark', 'topPerformer'].filter(key => !hiddenSeries.includes(key));

    const chartTheme = {
        axis: {
            ticks: {
                text: {
                    fill: theme === 'dark' ? '#94a3b8' : '#64748b',
                    fontSize: 11
                }
            },
            legend: {
                text: {
                    fill: theme === 'dark' ? '#cbd5e1' : '#475569',
                    fontSize: 12,
                    fontWeight: 600
                }
            }
        },
        grid: {
            line: {
                stroke: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                strokeWidth: 1
            }
        },
        legends: {
            text: {
                fill: theme === 'dark' ? '#94a3b8' : '#64748b',
                fontSize: 11
            }
        },
        tooltip: {
            container: {
                background: theme === 'dark' ? '#0f172a' : '#ffffff',
                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                fontSize: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0'
            }
        }
    };

    // Custom legend with toggle functionality
    const CustomLegend = ({ legends }) => (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            {[
                { id: 'score', label: 'score', color: COLORS.primary },
                { id: 'benchmark', label: 'benchmark', color: COLORS.warning },
                { id: 'topPerformer', label: 'topPerformer', color: COLORS.success }
            ].map(item => {
                const isHidden = hiddenSeries.includes(item.id);
                return (
                    <div
                        key={item.id}
                        onClick={() => toggleSeries(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            opacity: isHidden ? 0.4 : 1,
                            textDecoration: isHidden ? 'line-through' : 'none',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: item.color
                        }} />
                        <span style={{
                            fontSize: '11px',
                            color: theme === 'dark' ? '#94a3b8' : '#64748b'
                        }}>
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );

    const radarChart = (
        <div style={{ position: 'relative', height: '100%' }}>
            <CustomLegend />
            <ResponsiveRadar
                data={radarData}
                keys={visibleKeys}
                indexBy="fullName"
                valueFormat=">-.2f"
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                borderColor={{ from: 'color' }}
                gridLabelOffset={36}
                gridLevels={5}
                gridShape="circular"
                gridLabel={(props) => (
                    <text
                        {...props}
                        style={{
                            fill: theme === 'dark' ? '#94a3b8' : '#64748b',
                            fontSize: 11
                        }}
                    >
                        {props.id}
                    </text>
                )}
                dotSize={10}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                colors={[COLORS.primary, COLORS.warning, COLORS.success]}
                fillOpacity={0.4}
                blendMode="multiply"
                motionConfig="wobbly"
                theme={chartTheme}
            />
        </div>
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
                        {radarChart}
                    </div>
                </CardContent>
            </Card>
            <Modal isOpen={isExpanded} onClose={() => setIsExpanded(false)} title={title} size="xlarge">
                <div
                    className="rounded-lg p-4"
                    style={{
                        height: '70vh',
                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff'
                    }}
                >
                    {radarChart}
                </div>
            </Modal>
        </>
    );
};

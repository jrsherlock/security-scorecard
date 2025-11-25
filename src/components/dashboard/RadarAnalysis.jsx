import React, { useRef } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { EditableText } from '../ui/EditableText';
import { COLORS } from '../../data/constants';

export const RadarAnalysis = ({ radarData, title, onTitleChange }) => {
    const cardRef = useRef(null);

    const handleExport = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, {
                    backgroundColor: '#0f172a',
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

    // Transform data for Nivo if necessary, but the current format should work with indexBy="fullName"
    // Keys: score, benchmark, topPerformer

    const theme = {
        textColor: '#94a3b8',
        fontSize: 12,
        axis: {
            domain: {
                line: {
                    stroke: '#334155',
                    strokeWidth: 1
                }
            },
            ticks: {
                line: {
                    stroke: '#334155',
                    strokeWidth: 1
                },
                text: {
                    fill: '#94a3b8'
                }
            }
        },
        grid: {
            line: {
                stroke: '#334155',
                strokeWidth: 1
            }
        },
        tooltip: {
            container: {
                background: '#0f172a',
                color: '#f1f5f9',
                fontSize: '12px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #1e293b'
            }
        }
    };

    return (
        <Card className="h-full" ref={cardRef}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    <EditableText value={title} onChange={onTitleChange} />
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleExport} title="Export as PNG" className="export-exclude">
                    <Download className="w-4 h-4 text-slate-400" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                    <ResponsiveRadar
                        data={radarData}
                        keys={['score', 'benchmark', 'topPerformer']}
                        indexBy="fullName"
                        valueFormat=">-.2f"
                        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                        borderColor={{ from: 'color' }}
                        gridLabelOffset={36}
                        dotSize={10}
                        dotColor={{ theme: 'background' }}
                        dotBorderWidth={2}
                        colors={[COLORS.primary, COLORS.warning, COLORS.success]}
                        blendMode="multiply"
                        motionConfig="wobbly"
                        legends={[
                            {
                                anchor: 'top-left',
                                direction: 'column',
                                translateX: -50,
                                translateY: -40,
                                itemWidth: 80,
                                itemHeight: 20,
                                itemTextColor: '#94a3b8',
                                symbolSize: 12,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#f1f5f9'
                                        }
                                    }
                                ]
                            }
                        ]}
                        theme={theme}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

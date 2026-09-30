import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FONT_SANS } from '../../../utils/fonts';

const IssueChart = ({ open, closed, openCount, stats }) => {
    // Resolve props accurately
    const finalOpen = typeof open === 'number' ? open : (typeof openCount === 'number' ? openCount : (stats?.open ?? null));
    const finalClosed = typeof closed === 'number' ? closed : (stats?.closed ?? null);

    if (finalOpen === null && finalClosed === null) {
        return (
            <div className="h-44 flex flex-col items-center justify-center text-zinc-500 font-sans text-xs gap-1 border border-dashed border-white/10 rounded-lg p-4">
                <span className="text-zinc-400 font-medium">Issue Metrics Unavailable</span>
                <span className="text-zinc-600 text-[11px]">Connect a PAT to inspect open and closed issue totals</span>
            </div>
        );
    }

    const displayOpen = Math.max(0, finalOpen ?? 0);
    const displayClosed = Math.max(0, finalClosed ?? 0);
    const total = displayOpen + displayClosed;

    const data = {
        labels: ['Open Issues', 'Closed Issues'],
        datasets: [
            {
                data: [displayOpen, displayClosed],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.75)', // Red-500 (Open)
                    'rgba(59, 130, 246, 0.8)', // Blue-500 (Closed Accent)
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(59, 130, 246, 1)',
                ],
                borderWidth: 1.5,
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#94a3b8',
                    font: {
                        family: FONT_SANS,
                        size: 11,
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(148, 163, 184, 0.2)',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = displayOpen + displayClosed;
                        const percentage = Math.round((value / total) * 100) + '%';
                        return `${label}: ${value} (${percentage})`;
                    }
                }
            },
        },
        cutout: '70%',
    };

    return (
        <div className="h-44 w-full relative">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-24">
                <div className="text-center">
                    <div className="text-xl font-bold font-mono text-white">{displayOpen + displayClosed}</div>
                    <div className="text-[10px] font-mono text-zinc-400">Total</div>
                </div>
            </div>
        </div>
    );
};

export default IssueChart;

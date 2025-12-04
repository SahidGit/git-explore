import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const IssueChart = ({ open, closed }) => {
    const data = {
        labels: ['Open Issues', 'Closed Issues'],
        datasets: [
            {
                data: [open, closed],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)', // Red-500 (Open)
                    'rgba(34, 197, 94, 0.7)', // Green-500 (Closed)
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(34, 197, 94, 1)',
                ],
                borderWidth: 1,
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
                    color: '#94a3b8', // Slate-400
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)', // Slate-900
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(148, 163, 184, 0.1)',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.chart._metasets[context.datasetIndex].total;
                        const percentage = Math.round((value / total) * 100) + '%';
                        return `${label}: ${value} (${percentage})`;
                    }
                }
            },
        },
        cutout: '70%',
    };

    if (open === 0 && closed === 0) {
        return (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No issue data available
            </div>
        );
    }

    return (
        <div className="h-48 w-full relative">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{open + closed}</div>
                    <div className="text-xs text-slate-400">Total</div>
                </div>
            </div>
        </div>
    );
};

export default IssueChart;

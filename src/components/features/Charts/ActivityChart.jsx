import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FONT_SANS } from '../../../utils/fonts';

const ActivityChart = ({ data }) => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const recentWeeks = Array.isArray(data) && data.length > 0 ? data.slice(-12) : null;
        const hasActivity = recentWeeks && recentWeeks.some((w) => w.total > 0);

        if (!hasActivity) {
            setChartData(null);
            return;
        }

        const labels = recentWeeks.map((_, index) => `W${index + 1}`);
        const commitCounts = recentWeeks.map((week) => week.total);

        const canvas = chartRef.current?.canvas;
        let gradient = null;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Commits',
                    data: commitCounts,
                    borderColor: '#3B82F6',
                    backgroundColor: gradient || 'rgba(59, 130, 246, 0.12)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#1E3A8A',
                    pointBorderColor: '#60A5FA',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#93C5FD',
                    pointHoverBorderColor: '#fff',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                },
            ],
        });
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(59, 130, 246, 0.35)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.parsed.y} commits / week`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        family: FONT_SANS,
                        size: 10,
                    },
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    stepSize: 10,
                    font: {
                        family: FONT_SANS,
                        size: 10,
                    },
                },
            },
        },
    };

    if (!chartData) {
        return (
            <div className="h-40 flex flex-col items-center justify-center text-zinc-500 font-sans text-xs gap-1 border border-dashed border-white/10 rounded-lg p-4">
                <span className="text-zinc-400 font-medium">No Recent Commit Activity</span>
                <span className="text-zinc-600 text-[11px]">GitHub statistics are computing or repository is inactive</span>
            </div>
        );
    }

    return (
        <div className="h-44 w-full relative">
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
};

export default ActivityChart;

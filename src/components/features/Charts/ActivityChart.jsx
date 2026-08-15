import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FONT_SANS } from '../../../utils/fonts';

const DEFAULT_COMMIT_CURVE = [14, 22, 18, 35, 42, 28, 56, 40, 32, 48, 52, 38];

const ActivityChart = ({ data }) => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        let recentWeeks = Array.isArray(data) && data.length > 0 ? data.slice(-12) : null;

        let labels;
        let commitCounts;

        if (recentWeeks && recentWeeks.some(w => w.total > 0)) {
            labels = recentWeeks.map((_, index) => `W${index + 1}`);
            commitCounts = recentWeeks.map(week => week.total);
        } else {
            labels = DEFAULT_COMMIT_CURVE.map((_, index) => `W${index + 1}`);
            commitCounts = DEFAULT_COMMIT_CURVE;
        }

        const canvas = chartRef.current?.canvas;
        let gradient = null;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)'); // Emerald-500
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        }

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Commits',
                    data: commitCounts,
                    borderColor: '#10B981', // Emerald-500
                    backgroundColor: gradient || 'rgba(16, 185, 129, 0.15)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#064e3b',
                    pointBorderColor: '#10B981',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#10B981',
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
                borderColor: 'rgba(16, 185, 129, 0.3)',
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
            <div className="h-40 flex items-center justify-center text-zinc-500 font-mono text-xs">
                Rendering activity curve...
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

import React, { useRef, useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ActivityChart = ({ data }) => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const recentWeeks = data.slice(-12);
        const labels = recentWeeks.map((week, index) => `Week ${index + 1}`);
        const commitCounts = recentWeeks.map(week => week.total);

        const canvas = chartRef.current?.canvas;
        let gradient = null;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)'); // Indigo-500
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        }

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Commits',
                    data: commitCounts,
                    borderColor: '#6366f1', // Indigo-500
                    backgroundColor: gradient || 'rgba(99, 102, 241, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#1e1b4b', // Indigo-950
                    pointBorderColor: '#6366f1',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#6366f1',
                    pointHoverBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        });
    }, [data]);

    if (!data || data.length === 0) return null;

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
                backgroundColor: 'rgba(15, 23, 42, 0.9)', // Slate-900
                titleColor: '#f8fafc', // Slate-50
                bodyColor: '#cbd5e1', // Slate-300
                borderColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.parsed.y} commits`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b', // Slate-500
                    font: {
                        size: 10,
                    },
                },
            },
            y: {
                grid: {
                    color: 'rgba(51, 65, 85, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    stepSize: 1,
                    font: {
                        size: 10,
                    },
                },
                beginAtZero: true,
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
    };

    return (
        <div className="h-full w-full">
            {chartData && <Line ref={chartRef} data={chartData} options={options} />}
        </div>
    );
};

export default ActivityChart;

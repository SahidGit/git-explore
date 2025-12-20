import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const LanguageChart = ({ languages }) => {
    if (!languages || Object.keys(languages).length === 0) return null;

    // Get top 5 languages
    const sortedLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const labels = sortedLanguages.map(([lang]) => lang);
    const dataValues = sortedLanguages.map(([, count]) => count);

    const data = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: [
                    '#3b82f6', // Blue
                    '#10b981', // Emerald
                    '#f59e0b', // Amber
                    '#8b5cf6', // Violet
                    '#ec4899', // Pink
                ],
                borderColor: '#1e293b', // Match background
                borderWidth: 2,
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
                    color: '#cbd5e1',
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(51, 65, 85, 0.5)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100) + '%';
                        return `${label}: ${percentage}`;
                    }
                }
            },
        },
        cutout: '70%',
    };

    return (
        <div className="h-64 w-full flex items-center justify-center">
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default LanguageChart;

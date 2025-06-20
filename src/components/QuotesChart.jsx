import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const QuotesChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Quotes Created',
        data: [2, 4, 3, 6, 5, 1, 7], // 👈 Replace with dynamic data later
        borderColor: '#723030',
        backgroundColor: 'rgba(114, 48, 48, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Quotes Created - This Week',
        color: '#333',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          color: '#333',
        },
        grid: {
          color: '#eee',
        },
      },
      x: {
        ticks: {
          color: '#333',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-3">
      <Line data={data} options={options} />
    </div>
  );
};

export default QuotesChart;

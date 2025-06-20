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

const QuotesChart = ({ data }) => {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Quotes Created',
        data: data?.datasets?.[0]?.data || [],
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
      <Line data={chartData} options={options} />
    </div>
  );
};

export default QuotesChart;

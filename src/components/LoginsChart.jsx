import { Line } from 'react-chartjs-2';

const LoginsChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Pavan',
        data: [3, 4, 2, 5, 6, 3, 4],
        borderColor: '#520d0d',
        backgroundColor: 'rgba(82, 13, 13, 0.1)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Pranay',
        data: [1, 3, 2, 4, 2, 5, 6],
        borderColor: '#c92c2c',
        backgroundColor: 'rgba(201, 44, 44, 0.1)',
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Akhil',
        data: [2, 2, 3, 1, 3, 4, 5],
        borderColor: '#a21caf',
        backgroundColor: 'rgba(162, 28, 175, 0.1)',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Weekly Logins per User',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-sm rounded p-3">
      <Line data={data} options={options} />
    </div>
  );
};

export default LoginsChart;

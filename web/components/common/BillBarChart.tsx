import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

import { Bar } from 'react-chartjs-2';

export const BillBarChart = () => {
  const data = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Brutto',
        borderRadius: 10,
        data: [0.1, 0.4, 0.2, 0.3, 0.7, 0.4, 0.6, 0.3, 0.4],
        backgroundColor: 'rgba(32, 214, 155, 0.5)',
        borderColor: 'rgba(32, 214, 155, 1)',
        borderWidth: 0.1,
        barThickness: 10,
      },
      {
        label: 'Netto',
        borderRadius: 10,
        borderColor: 'rgba(32, 214, 155, 1)',
        borderWidth: 0.1,
        data: [0.07, 0.3, 0.15, 0.2, 0.5, 0.3, 0.8, 0.2, 0.4],
        backgroundColor: 'rgba(1, 98, 255, 0.5)',
        barThickness: 10,
      },
    ],
  };

  const options: any = {
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 7,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        max: 1,
      },
    },
    elements: {
      bar: {
        barPercentage: 0.3,
        categoryPercentage: 1,
      },
    },
  };

  return (
    <div className="flex flex-col px-20 pt-4 pb-6 card rounded-box border border-base-300">
      <div className="flex flex-col items-center justify-center pb-1">
        <span className="text-xl font-bold text-center">Bills per Month</span>
        <span className="text-sm text-center mt-1">View the bills you have paid per month</span>
      </div>
      <Bar data={data} width={60} height={60} options={options} />
    </div>
  );
};

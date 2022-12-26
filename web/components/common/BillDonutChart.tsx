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
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, ArcElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

import { Doughnut } from 'react-chartjs-2';

export const BillDonutChart = () => {
  const data = {
    backgroundColor: ['rgb(2, 88, 255)', 'rgb(249, 151, 0)', 'rgb(255, 199, 0)', 'rgb(32, 199, 0)', 'rgb(19, 23, 151)'],
    labels: ['Categoría 1', 'Categoría 2', 'Categoría 3', 'Categoría 4', 'Categoría 5'],
    datasets: [
      {
        label: 'Set',
        data: [300, 50, 100, 300, 200],
        backgroundColor: [
          'rgb(2, 88, 255)',
          'rgb(249, 151, 0)',
          'rgb(255, 199, 0)',
          'rgb(32, 199, 0)',
          'rgb(19, 23, 151)',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    elements: {
      arc: {
        weight: 0.5,
        borderWidth: 0.5,
      },
    },
    cutout: '80%',
  };

  return (
    <div className="flex flex-col px-20 pt-4 pb-6 card rounded-box border border-base-300">
      <div className="flex flex-col items-center justify-center pb-1">
        <span className="text-xl font-bold text-center">Bills per Category</span>
        <span className="text-sm text-center mt-1">View the bills you have paid per category</span>
      </div>
      <Doughnut data={data} width={100} height={100} options={options} />
    </div>
  );
};

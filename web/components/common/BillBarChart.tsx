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
  ChartOptions,
  BarOptions,
  ChartType,
  BarControllerChartOptions,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { useEffect, useState } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

import { Bar } from 'react-chartjs-2';
import { HistoricBillsByMonth } from '../../models/historic/historic-bills-by-month';

interface BillBarChartProps {
  historicBillsByMonth?: HistoricBillsByMonth;
}
export const BillBarChart: React.FC<BillBarChartProps> = ({ historicBillsByMonth }) => {
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
        borderRadius: 10,
        data: [0.1, 0.4, 0.2, 0.3, 0.7, 0.4, 0.6, 0.3, 0.4],
        backgroundColor: 'rgba(32, 214, 155, 0.5)',
        borderColor: 'rgba(32, 214, 155, 1)',
        borderWidth: 0.1,
        barThickness: 20,
      },
    ],
  };
  const [chartData, setChartData] = useState<any>(data);

  useEffect(() => {
    setChartData((current: any) => {
      return {
        ...current,
        labels: current.labels,
        datasets: [
          {
            ...current.datasets[0],
            data: historicBillsByMonth?.billsByMonth.map((month) => month.total) || [],
          },
        ],
      };
    });
  }, [historicBillsByMonth]);

  const options:
    | _DeepPartialObject<
        CoreChartOptions<'bar'> &
          ElementChartOptions<'bar'> &
          PluginChartOptions<'bar'> &
          ScaleChartOptions<'bar'> &
          DatasetChartOptions<'bar'> &
          BarControllerChartOptions
      >
    | undefined = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {},
  };

  return (
    <div className="flex flex-col px-20 pt-4 pb-6 card rounded-box border border-base-300">
      <div className="flex flex-col items-center justify-center pb-1">
        <span className="text-xl font-bold text-center">Bills per Month</span>
        <span className="text-sm text-center mt-1">View the bills you have paid per month</span>
      </div>
      <Bar data={chartData} width={60} height={60} options={options} />
    </div>
  );
};

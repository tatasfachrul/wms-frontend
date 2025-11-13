import { DashboardChart } from "@/lib/types/dashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const labelsWeek = ["Week 1", "week 2", "Week 3", "week 4"];

export const ChartDashboard = ({
  period,
  data,
}: {
  period: "daily" | "weekly" | "monthly";
  data: DashboardChart;
}) => {

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${period[0].toUpperCase() + period.slice(1)} Transactions`,
      },
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Inbound Stock",
        data: data.inboundStock,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Outbound Stock",
        data: data.outboundStock,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Bar options={chartOptions} data={chartData} />;
};

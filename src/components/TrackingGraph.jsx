import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const TrackingGraph = ({ trackingData }) => {
  const chartRef = useRef(null);

  const data = {
    labels: trackingData.map((_, index) => `#${index + 1}`),
    datasets: [
      {
        label: "X Position (px)",
        data: trackingData.map((point) => point.x),
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Y Position (px)",
        data: trackingData.map((point) => point.y),
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Detection Index",
          color: "#fff",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        title: {
          display: true,
          text: "Position (px)",
          color: "#fff",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold text-white mb-2">
        Real-Time Object Tracking Graph
      </h3>
      <div className="w-full h-[300px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default TrackingGraph;

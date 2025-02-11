"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
  
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Fetch report data from API
    fetch(`https://easyinventorys.vercel.app/sales?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .catch((err) => console.error("Error fetching sales data:", err));
  }, [user?.email]);

  // Prepare Data for Charts
  const salesByCategory = reportData.reduce((acc, sale) => {
    acc[sale.itemName] = (acc[sale.itemName] || 0) + sale.soldPrice;
    return acc;
  }, {});

  const salesByDate = reportData.reduce((acc, sale) => {
    const date = new Date(sale.soldAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + sale.soldPrice;
    return acc;
  }, {});

  // Bar Chart (Sales by Product)
  const barChartData = {
    labels: Object.keys(salesByCategory),
    datasets: [
      {
        label: "Total Sales ($)",
        data: Object.values(salesByCategory),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Line Chart (Sales over Time)
  const lineChartData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: "Sales Trend",
        data: Object.values(salesByDate),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Pie Chart (Sales Distribution by Product)
  const pieChartData = {
    labels: Object.keys(salesByCategory),
    datasets: [
      {
        data: Object.values(salesByCategory),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9800",
          "#9C27B0",
        ],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Sales Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Sales by Product</h2>
          <Bar data={barChartData} />
        </div>

        <div className="dashboard-card">
          <h2>Sales Over Time</h2>
          <Line data={lineChartData} />
        </div>

        <div className="dashboard-card">
          <h2>Sales Distribution</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

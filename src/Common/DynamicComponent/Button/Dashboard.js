import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { User } from "lucide-react";
// import UsersList from "./UsersList";


import { FaHome, FaUser, FaCog, FaChartLine, FaBell, FaEnvelope } from 'react-icons/fa';
import "./Dashboard.css";

// Registering chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // Sample data for the pie chart
  const data = {
    labels: ["Products", "Sales Today", "Revenue Collected"],
    datasets: [
      {
        data: [30, 45, 25], // Example values: number of products, sales today, and revenue collected
        backgroundColor: ["#ff6347", "#3e95cd", "#32cd32"], // Different colors for each segment
        hoverBackgroundColor: ["#ff4500", "#1e90ff", "#228b22"],
      },
    ],
  };
  
  const buttons = [
    { label: "Home", icon: <FaHome size={20} />, className: "btn-home" },
    { label: "User", icon: <FaUser size={20} />, className: "btn-user" },
    { label: "Settings", icon: <FaCog size={20} />, className: "btn-settings" },
    { label: "Analytics", icon: <FaChartLine size={20} />, className: "btn-analytics" },
    { label: "Notifications", icon: <FaBell size={20} />, className: "btn-notifications" },
    { label: "Messages", icon: <FaEnvelope size={20} />, className: "btn-messages" },
  ];
    // Create arrays for main buttons (6) and extra buttons (3)
    const mainButtons = Array(6).fill(0);
   
  


  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Dashboard</h2>
      
      <div className="pie-chart-container">
        <h3>Sales Overview</h3>
        {/* Container with fixed width for a medium sized chart */}
        <div style={{ width: "250px", margin: "auto" }}>
        <Pie data={data} width={250} height={250} options={{ maintainAspectRatio: false }} />

        </div>
      </div>
      <div className="dashboard-buttons">
        {buttons.map((btn, index) => (
          <button key={index} className={`dashboard-btn ${btn.className}`}>
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
      </div>

   
  );

}
export default Dashboard;

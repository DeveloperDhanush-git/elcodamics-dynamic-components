import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Card from "./Common/DynamicComponent/ScrollCard/ScrollCard"; 
import { FiUsers, FiDollarSign, FiSettings, FiSmile, FiStar, FiBell } from "react-icons/fi";
import "./App.css"
import "./Common/DynamicComponent/ScrollCard/ScrollCard.css"
import Nav from "./Common/DynamicComponent/ScrollCard/Nav"

const cards = [
  { icon: <FiUsers />, title: "Total Users", value: "1,200", valueColor: "blue", path: "/Nav" },
  { icon: <FiDollarSign />, title: "Total Revenue", value: "₹50,000", valueColor: "green", path: "/Nav" },
  { icon: <FiSettings />, title: "System Health", value: "Good", valueColor: "orange", path: "/Nav" },
  { icon: <FiSmile />, title: "User Satisfaction", value: "90%", valueColor: "purple", path: "/Nav" },
  { icon: <FiStar />, title: "Total Stars", value: "4.8", valueColor: "yellow", path: "/Nav" },
  { icon: <FiBell />, title: "Notifications", value: "10", valueColor: "red", path: "/Nav" },
];

const App = () => {
  return (
    <Router>
      <Routes>
      
        <Route
          path="/"
          element={
            <div className="app-container">
              <div className="scroll-container">
                {cards.map((card, index) => (
                  <Card
                    key={index}
                    icon={card.icon}
                    title={card.title}
                    value={card.value}
                    valueColor={card.valueColor}
                    path={card.path} 
                  />
                ))}
              </div>
            </div>
          }
        />

        <Route path="/Nav" element={<Nav />} />
      </Routes>
    </Router>
  );
};

export default App;

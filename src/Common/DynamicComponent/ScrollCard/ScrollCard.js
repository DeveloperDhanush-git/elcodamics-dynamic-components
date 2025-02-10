import React from "react";
import { Link } from "react-router-dom";
import "./ScrollCard.css";

const Card = ({ icon, title, value, valueColor, path }) => {
  return (
    <Link to={path} className="card"> {}
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className={`card-value ${valueColor}`}>{value}</p>
      </div>
    </Link>
  );
};

export default Card;

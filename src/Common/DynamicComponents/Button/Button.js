import React from "react";

const Button = ({ text, onClick, color = "blue" }) => {
  // Define color classes explicitly for Tailwind to recognize
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg text-white transition ${colors[color] || colors.blue}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

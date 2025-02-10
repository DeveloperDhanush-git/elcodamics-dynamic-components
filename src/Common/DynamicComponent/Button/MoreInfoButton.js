import React from "react";

const Button = ({ 
  text, 
  onClick, 
  bgColor = "blue", 
  textColor = "white", 
  borderColor = "transparent", 
  borderRadius = "lg" 
}) => {
  
  const bgColors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    gray: "bg-gray-500 hover:bg-gray-600",
    white:"bg-whhite-500 :hover:bg-white-600",
    purple:"bg-purple-500 :hover:bg-purple-600",

  };

  const textColors = {
    white: "text-white",
    black: "text-black",
    gray: "text-gray-700",
  };

  const borderColors = {
    transparent: "border-transparent",
    blue: "border-blue-500",
    red: "border-red-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    gray: "border-gray-500",
  };

  const borderRadiusOptions = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <button
      className={`px-6 py-3 text-lg font-semibold transition-all border-2 
      ${bgColors[bgColor] || bgColors.blue} 
      ${textColors[textColor] || textColors.white} 
      ${borderColors[borderColor] || borderColors.transparent} 
      ${borderRadiusOptions[borderRadius] || borderRadiusOptions.lg}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

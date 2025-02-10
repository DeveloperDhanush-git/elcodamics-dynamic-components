import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react";

const Card = ({ 
  title = "Daily Visits", 
  visits, 
  changePercent, 
  bgColor = "bg-white", 
  borderColor = "border-gray-300", 
  borderRadius = "rounded-2xl",
  textColor = "text-black",
  barColor = "#4F46E5"
}) => {
  
  const baseData = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 25 },
    { day: "Wed", value: 50 },
    { day: "Thu", value: 30 },
    { day: "Fri", value: 60 },
    { day: "Sat", value: 45 },
    { day: "Sun", value: 50 },
  ];

  
  const [chartData, setChartData] = useState(baseData);

  useEffect(() => {
    const factor = 1 + changePercent / 100; 
    const updatedData = baseData.map(item => ({
      ...item,
      value: Math.max(10, Math.round(item.value * factor))
    }));
    setChartData(updatedData);
  }, [changePercent]);

  return (
    <div className={`p-5 w-72 shadow-lg border ${borderColor} ${borderRadius} ${bgColor}`}>
      
      <div className="flex justify-between items-center">
        <span className={`text-sm ${textColor} font-medium`}>{title}</span>
        <MoreHorizontal className="text-gray-400 w-4 h-4" />
      </div>

    
      <div className={`flex items-center text-sm font-semibold mt-2 ${changePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
        {changePercent >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
        <span className="ml-1">{changePercent}%</span>
      </div>

   
      <h2 className={`text-3xl font-bold mt-1 ${textColor}`}>{visits.toLocaleString()}</h2>


      <div className="mt-3">
        <ResponsiveContainer width="100%" height={40}>
          <BarChart data={chartData}>
            <XAxis dataKey="day" hide />
            <Tooltip />
            <Bar dataKey="value" fill={barColor} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Card;

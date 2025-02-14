import { PieChart, Pie } from "recharts";
import { ChevronRight } from "lucide-react";

const ProtectionCard = () => {
  const percentage = 80;
  const colors = ["#6941FC", "#E5E5E5"];
  const angle = 90 + 360 * (percentage / 100);

  return (
    <div className="m-54 p-6 bg-white rounded-2xl shadow-md text-center w-50">
      <p className="text-gray-900  font-['Montserrat'] font-semibold">Protection Status</p>
      <div className="relative flex justify-center items-center my-4">
        <PieChart width={130} height={130}>
          {/* Background Circle */}
          <Pie
            data={[{ value: 100 }]}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={50}
            startAngle={0}
            endAngle={360}
            fill={colors[1]}
            dataKey="value"
            stroke="none"
          />
          {/* Progress Arc with Smooth Curves */}
          <Pie
            data={[{ value: percentage }]}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={50}
            startAngle={90}
            endAngle={angle}
            fill={colors[0]}
            dataKey="value"
            stroke="none"
            cornerRadius={50}
          />
        </PieChart>
        <span className="absolute text-2xl font-semibold text-blue-700">
          {percentage}%
        </span>
      </div>
      <h3 className="text-lg text-gray-900 font-['Montserrat']">Average Protection</h3>
      <p className="text-xs text-gray-500 font-['Montserrat']">
        Check what you can do to be fully protected
      </p>
      {/* Button with Arrow */}
      <button className="mt-4 px-4 py-2 w-full text-sm font-medium text-gray-500 bg-blue-50 rounded-lg flex items-center justify-between font-['Montserrat']">
        <span>Overview</span>
        <ChevronRight  size={16} />
      </button>
    </div>
  );
};

export default ProtectionCard;

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const data = [
  { month: "Jan", value: 2500, color: "#4682B4" },
  { month: "Feb", value: 2000, color: "#33A57A" },
  { month: "Mar", value: 4000, color: "#FF5733" },
  { month: "Apr", value: 3000, color: "#5733FF" },
  { month: "May", value: 5000, color: "#FF33A8" },
  { month: "Jun", value: 7000, color: "#FFD700" },
  { month: "Jul", value: 2000, color: "#FF8C00" },
  { month: "Aug", value: 1500, color: "#00CED1" },
  { month: "Sep", value: 9000, color: "#8A2BE2" },
  { month: "Oct", value: 4000, color: "#76FF03" },
  { month: "Nov", value: 8500, color: "#512DA8" },
  { month: "Dec", value: 3000, color: "#DC143C" },
];

const darkenColor = (hex, percent) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.max(0, r - (r * percent) / 100);
  g = Math.max(0, g - (g * percent) / 100);
  b = Math.max(0, b - (b * percent) / 100);

  return `rgb(${r}, ${g}, ${b})`;
};

const FileScanBarChart = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <Box sx={{
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "12px",
      maxWidth: "800px",
      margin: "auto",
      position: "relative",
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily: "Montserrat", paddingLeft: "35px" }}>9.5k</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontFamily: "Montserrat", paddingLeft: "35px" }}>Total Files</Typography>
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", fontFamily: "Montserrat", paddingLeft: "10px" }}>8k</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontFamily: "Montserrat", paddingLeft: "10px" }}>Scanned Files</Typography>
        </Box>
        <Box position="relative">
          <Button
            variant="contained"
            startIcon={<CalendarMonthIcon />}
            sx={{ borderRadius: "12px", fontFamily: "Montserrat" }}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            Select Month
          </Button>
          {showCalendar && (
            <Box sx={{
              position: "absolute",
              top: "50px",
              right: 0,
              zIndex: 10,
              backgroundColor: "white",
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "12px",
              padding: "10px",
              width: "220px",
            }}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                dateFormat="MMM, yyyy"
                showMonthYearPicker
                inline
              />
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ height: "50px" }} />

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "Montserrat" }} />
          <YAxis domain={[0, 10000]} tick={{ fontSize: 12, fontFamily: "Montserrat" }} />
          <Bar
            dataKey="value"
            barSize={35}
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              const isHighlighted = payload.month === selectedDate.toLocaleString("default", { month: "short" });

              return (
                <svg>
                  <rect
                    x={x}
                    y={10}
                    width={width}
                    height={y + height - 10}
                    fill="rgba(200, 200, 200, 0.3)"
                    rx={10}
                  />
                  <path
                    d={`M${x},${y + height} 
                      L${x},${y + 10} 
                      Q${x},${y} ${x + 10},${y} 
                      L${x + width - 10},${y} 
                      Q${x + width},${y} ${x + width},${y + 10} 
                      L${x + width},${y + height} Z`}
                    fill={payload.color}
                    opacity={isHighlighted ? 1 : 0.6}
                    stroke={isHighlighted ? darkenColor(payload.color, 40) : "none"}
                    strokeWidth={isHighlighted ? 2 : 0}
                  />
                </svg>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default FileScanBarChart;
import React from "react";
import {
  Line,
  ResponsiveContainer,
  LineChart,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const data = [
  { name: "Mon", Visits: 2200, Orders: 3400 },
  { name: "Tue", Visits: 1280, Orders: 2398 },
  { name: "Wed", Visits: 7000, Orders: 4300 },
  { name: "Thu", Visits: 2300, Orders: 2908 },
  { name: "Fri", Visits: 5890, Orders: 4800 },
  { name: "Sat", Visits: 4390, Orders: 3800 },
  { name: "Sun", Visits: 4490, Orders: 4300 }
];

function SimpleLineChart() {
  return (
    // 99% per https://github.com/recharts/recharts/issues/172
    <ResponsiveContainer width="99%" height={320}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="linear" dataKey="Visits" stroke="#82ca9d" />
        <Line
          type="linear"
          dataKey="Orders"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default SimpleLineChart;

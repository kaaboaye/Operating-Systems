import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip,
  Legend,
  Line
} from "recharts";

export interface ChartProps {
  data: object[];
}

export class Chart extends React.Component<ChartProps> {
  render() {
    return (
      <ResponsiveContainer width="99%" height={320}>
        <LineChart data={this.props.data}>
          <YAxis />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="linear"
            name="Position"
            dataKey="position"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

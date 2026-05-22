"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Header } from "../Header";

const data = [
  {
    day: "Sun",
    students: 120,
    questions: 420,
  },
  {
    day: "Mon",
    students: 135,
    questions: 220,
  },
  {
    day: "Tue",
    students: 150,
    questions: 450,
  },
  {
    day: "Wed",
    students: 165,
    questions: 200,
  },
  {
    day: "Thu",
    students: 180,
    questions: 500,
  },
  {
    day: "Fri",
    students: 80,
    questions: 250,
  },
  {
    day: "Sat",
    students: 250,
    questions: 300,
  },
];

export default function WeeklyActivityChart() {
  return (
    <div className="w-full bg-white border border-[#E4E7EC] rounded-3xl p-8">

      {/* Header */}
      <div className="mb-8">
        <Header text="Weekly Activity" />
      </div>

      {/* Chart */}
      <div className="w-full h-[25rem]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: -10,
              bottom: 20,
            }}
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#D0D5DD"
            />

            {/* X Axis */}
            <XAxis
              dataKey="day"
              tick={{
                fill: "#525252",
                fontSize: 16,
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tick={{
                fill: "#525252",
                fontSize: 16,
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip />

            {/* Legend */}
            <Legend
              wrapperStyle={{
                paddingTop: "30px",
                fontSize: "16px",
              }}
            />

            {/* Blue Line */}
            <Area
              type="monotone"
              dataKey="students"
              name="Active Students"
              stroke="#065BFF"
              fill="#065BFF"
              fillOpacity={0.15}
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#065BFF",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
              }}
            />

            {/* Green Line */}
            <Area
              type="monotone"
              dataKey="questions"
              name="Questions Answered"
              stroke="#38C793"
              fill="#38C793"
              fillOpacity={0.15}
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#38C793",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
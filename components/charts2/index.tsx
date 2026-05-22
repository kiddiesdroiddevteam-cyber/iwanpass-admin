"use client";

import {
  BarChart,
  Bar,
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
    day: "Mon",
    jamb: 120,
    waec: 100,
    neco: 60,
    gce: 40,
  },
  {
    day: "Tue",
    jamb: 180,
    waec: 140,
    neco: 90,
    gce: 70,
  },
  {
    day: "Wed",
    jamb: 220,
    waec: 190,
    neco: 130,
    gce: 110,
  },
  {
    day: "Thu",
    jamb: 260,
    waec: 230,
    neco: 170,
    gce: 150,
  },
  {
    day: "Fri",
    jamb: 300,
    waec: 270,
    neco: 210,
    gce: 190,
  },
  {
    day: "Sat",
    jamb: 350,
    waec: 320,
    neco: 260,
    gce: 230,
  },
  {
    day: "Sun",
    jamb: 400,
    waec: 380,
    neco: 310,
    gce: 280,
  },
];

export default function Charts2() {
  return (
    <div className="w-full bg-white border border-[#E4E7EC] rounded-3xl p-8">

      {/* Title */}
      <div className="mb-8">
        <Header text="Questions by Exam" />
      </div>

      {/* Chart */}
      <div className="w-full h-[25rem]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            barGap={8}
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

            {/* Bottom labels */}
            <XAxis
              dataKey="day"
              tick={{
                fill: "#525252",
                fontSize: 16,
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* Side numbers */}
            <YAxis
              tick={{
                fill: "#525252",
                fontSize: 16,
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* Hover popup */}
            <Tooltip />

            {/* Bottom legend */}
            <Legend
              wrapperStyle={{
                paddingTop: "30px",
                fontSize: "16px",
              }}
            />

            {/* JAMB */}
            <Bar
              dataKey="jamb"
              fill="#065BFF"
              radius={[10, 10, 0, 0]}
            />

            {/* WAEC */}
            <Bar
              dataKey="waec"
              fill="#D16AE8"
              radius={[10, 10, 0, 0]}
            />

            {/* NECO */}
            <Bar
              dataKey="neco"
              fill="#38C793"
              radius={[10, 10, 0, 0]}
            />

            {/* GCE */}
            <Bar
              dataKey="gce"
              fill="#F17B2C"
              radius={[10, 10, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}
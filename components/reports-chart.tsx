"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ChartData {
  category: string;
  amount: number;
}

export function ReportsChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        No data available for charts
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
            opacity={0.4}
          />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12, fill: "var(--foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(val) => `$${val}`}
            tick={{ fontSize: 12, fill: "var(--foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={
              ((value: any) => {
                const numVal =
                  typeof value === "number"
                    ? value
                    : parseFloat((value as string) || "0");
                return [`$${numVal.toFixed(2)}`, "Amount"];
              }) as any
            }
            labelFormatter={(label) => `Category: ${label}`}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
            }}
          />
          <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

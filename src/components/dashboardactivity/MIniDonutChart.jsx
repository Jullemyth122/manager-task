import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Completed', value: 3000 },
  { name: 'Pending', value: 1500 },
  { name: 'In Progress', value: 1623 },
];

const COLORS = ['#1c77ff', '#5599ff', '#9bc3ff'];

const MiniDonutChart = () => (
  <ResponsiveContainer width={150} height={150}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        innerRadius={60}
        outerRadius={70}
        startAngle={90}
        endAngle={-270}
        label={false}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
);

export default MiniDonutChart;

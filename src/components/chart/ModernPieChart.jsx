import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const pieData = [
  { name: 'Accounts', value: 400 },
  { name: 'Sales', value: 300 },
  { name: 'Reports', value: 300 },
];

const COLORS = ['#79afff', "#2079ff",'#1170ff'];

const ModernPieChart = () => {
    return (
        <div className="modern-pie-chart">
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                label
                stroke="none"
            >
                {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip 
                wrapperStyle={{ border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                contentStyle={{ borderRadius: '8px' }} 
            />
            <Legend verticalAlign="bottom" height={36} />
            </PieChart>
        </ResponsiveContainer>
        </div>
    );
};

export default ModernPieChart;

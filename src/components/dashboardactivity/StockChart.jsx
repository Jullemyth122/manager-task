// src/dashboardactivity/StockChart.jsx
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StockChart = ({ data, period, title, color = "#3e95cd" }) => {
  // Convert raw data into a chart-friendly format.
  const chartData = data.map(item => ({
    day: new Date(item.createdAt).toLocaleDateString(),
    price: item.value,
  }));

  // Optionally add an initial data point (price 0) for smoother appearance.
  if (chartData.length > 0) {
    chartData.unshift({ day: chartData[0].day, price: 0 });
  }

  // Ensure a valid gradient id even if title is not provided.
  const gradientId = `#c2daff98`;

  return (
    <div style={{ width: '100%', height: '150px', background: '#ffffff7e', borderRadius:'10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: '#888' }}
            axisLine={{ stroke: '#ccc' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 'auto']}
            tick={{ fontSize: 10, fill: '#888' }}
            axisLine={{ stroke: '#ccc' }}
            tickLine={false}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
          <Tooltip contentStyle={{ fontSize: '12px' }} labelStyle={{ color: '#333' }} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;

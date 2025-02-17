import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data for the chart
const data = [
  { name: 'Jan', Accounts: 300, Sales: 200, Reports: 100 },
  { name: 'Feb', Accounts: 400, Sales: 250, Reports: 150 },
  { name: 'Mar', Accounts: 350, Sales: 300, Reports: 200 },
  { name: 'Apr', Accounts: 500, Sales: 350, Reports: 250 },
  { name: 'May', Accounts: 450, Sales: 400, Reports: 300 },
];

const SimpleBarChart = () => {
  return (
    <div className="simple-bar-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#333" />
          <YAxis stroke="#333" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Accounts" fill="#60a0ff" />
          <Bar dataKey="Sales" fill="#1170ff" />
          <Bar dataKey="Reports" fill="#FFF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;

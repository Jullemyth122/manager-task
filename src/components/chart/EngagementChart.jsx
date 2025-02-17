import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Sample data representing engagement per time interval over 24 hours
const engagementData = [
    { time: '00:00', engagement: 12 },
    { time: '02:00', engagement: 18 },
    { time: '04:00', engagement: 25 },
    { time: '06:00', engagement: 35 },
    { time: '08:00', engagement: 50 },
    { time: '10:00', engagement: 65 },
    { time: '12:00', engagement: 60 },
    { time: '14:00', engagement: 75 },
    { time: '16:00', engagement: 70 },
    { time: '18:00', engagement: 68 },
    { time: '20:00', engagement: 55 },
    { time: '22:00', engagement: 40 },
    { time: '24:00', engagement: 30 }
];

const EngagementChart = () => {
    return (
        <div className="engagement-chart">
            <h1> Engagement Past 24hrs </h1>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                data={engagementData}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#333" />
                <YAxis stroke="#333" />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#60a0ff"
                    fill="#1170ff"
                />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EngagementChart;

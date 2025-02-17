import React from 'react';
import '../scss/dashboard.scss';
import '../scss/sidebar.scss';
import '../scss/mainboard.scss';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/useAuth';
import { useActivity } from '../context/useActivity';
import StockChart from './dashboardactivity/StockChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts';

const MainDash = () => {
    const { accs } = useAuth();
    const { userBoards } = useActivity();

    const truncateText = (text, maxLength) => {
        return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    // Sort accounts by creation date (newest first)
    const sortedAccs = accs.slice().sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
    });

    // Categorize tasks based on board visibility
    const categorizedTasks = {
        Public: userBoards.filter(board => board.boardVisibility === 'Public'),
        Privacy: userBoards.filter(board => board.boardVisibility === 'Private'),
        Workspace: userBoards.filter(board => board.boardVisibility === 'Workspace')
    };

    // Chart data for shared task data
    const chartData = [
        { name: 'Public', value: categorizedTasks.Public.length },
        { name: 'Privacy', value: categorizedTasks.Privacy.length },
        { name: 'Workspace', value: categorizedTasks.Workspace.length }
    ];

    // Sample Premium Rate data (replace with real data if available)
    const premiumData = [
        { name: 'Premium', value: 65 },
        { name: 'Standard', value: 35 }
    ];

    return (
        <div className="mainboard">
            <div className="sdash-1">
                <h1 className="text-xl">Dashboard</h1>
                <div className="sdash-1 flex items-start justify-start gap-5">
                    <div className="acc-creation">
                        <h1>Account User Data</h1>
                        <div className="nested-list">
                            <div className="chart-container">
                                <StockChart accounts={accs} />
                            </div>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Date Creation</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div className="tbody-container">
                                    <table>
                                        <tbody>
                                            {sortedAccs.map(acc => (
                                                <tr key={acc.id}>
                                                    <td>{truncateText(acc.username || '-', 20)}</td>
                                                    <td>{truncateText(acc.email || '-', 20)}</td>
                                                    <td>{new Date(acc.createdAt).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shared-task-data">
                        <h1>Shared Task Data</h1>
                        <div className="chart-container" style={{ height: '150px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#79afff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="task-categories">
                            {Object.entries(categorizedTasks).map(([category, tasks]) => (
                                <div key={category} className="task-category">
                                    <h4>{category}</h4>
                                    <ul>
                                        {tasks.length > 0 ? (
                                            tasks.map(task => (
                                                <li key={task.id}> {truncateText(task.email + " || " + task.boardTitle, 40)}</li>
                                            ))
                                        ) : (
                                            <li>No tasks available</li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="premium-rate-data">
                        <h1>Premium Rate Data</h1>
                        <div className="chart-container" style={{ height: '150px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={premiumData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#FF5722" label />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="premium-stats">
                            <p>Total Users: <strong>1000</strong></p>
                            <p>Premium Users: <strong>650</strong></p>
                            <p>Premium Rate: <strong>65%</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    return (
        <div className="dashboard-comp">
            <Sidebar />
            <MainDash />
        </div>
    );
};

export default Dashboard;

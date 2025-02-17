import React, { useEffect, useState } from 'react';
import '../scss/dashboard.scss';
import '../scss/sidebar.scss';
import '../scss/mainboard.scss';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/useAuth';
import { useActivity } from '../context/useActivity';

// Example function to compute gain/loss for a given period// Sample data for testing gain/loss calculation
// Create sample data relative to the current date
const now = new Date();

const sampleAccs = [
  { createdAt: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000), value: 80 },
  { createdAt: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000), value: 90 },
  { createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), value: 100 },
  { createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), value: 120 },
];

const sampleShared = [
  { createdAt: new Date(now.getTime() - 300 * 24 * 60 * 60 * 1000), value: 50 },
  { createdAt: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000), value: 55 },
  { createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), value: 60 },
  { createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), value: 65 },
];

const samplePremium = [
  { createdAt: new Date(now.getTime() - 500 * 24 * 60 * 60 * 1000), value: 200 },
  { createdAt: new Date(now.getTime() - 250 * 24 * 60 * 60 * 1000), value: 195 },
  { createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), value: 210 },
  { createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), value: 220 },
];

// Function to compute gain/loss for a given period
const computeGainLoss = (data, period) => {
    const now = new Date();
    let startDate;

    switch (period) {
        case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
        case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
        case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
        case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        break;
        default:
        startDate = new Date(0);
    }

    const filteredData = data.filter(item => {
        const itemDate = item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
        return itemDate >= startDate && itemDate <= now;
    });

    if (filteredData.length === 0) return { gain: 0, loss: 0 };

    filteredData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateA - dateB;
    });

    const earliestValue = filteredData[0].value || 1;
    const latestValue = filteredData[filteredData.length - 1].value || 1;
    const percentChange = ((latestValue - earliestValue) / earliestValue) * 100;

    return {
        gain: percentChange > 0 ? percentChange.toFixed(2) : 0,
        loss: percentChange < 0 ? Math.abs(percentChange).toFixed(2) : 0,
    };
};


const MainDash = () => {
    // You can use accs from context, or fallback to sampleAccs for testing
    const { accs } = useAuth();
    const { userBoards } = useActivity();

    const accData = (accs && accs.length > 0) ? accs : sampleAccs;
    // For shared and premium, we use sample data
    const sharedData = sampleShared;
    const premiumData = samplePremium;
  
    // Separate state for each section's period and computed gain/loss
    const [accPeriod, setAccPeriod] = useState('year');
    const [accGainLoss, setAccGainLoss] = useState({ gain: 0, loss: 0 });
  
    const [sharedPeriod, setSharedPeriod] = useState('year');
    const [sharedGainLoss, setSharedGainLoss] = useState({ gain: 0, loss: 0 });
  
    const [premiumPeriod, setPremiumPeriod] = useState('year');
    const [premiumGainLoss, setPremiumGainLoss] = useState({ gain: 0, loss: 0 });
  
    useEffect(() => {
      setAccGainLoss(computeGainLoss(accData, accPeriod));
    }, [accData, accPeriod]);
  
    useEffect(() => {
      setSharedGainLoss(computeGainLoss(sharedData, sharedPeriod));
    }, [sharedData, sharedPeriod]);
  
    useEffect(() => {
      setPremiumGainLoss(computeGainLoss(premiumData, premiumPeriod));
    }, [premiumData, premiumPeriod]);
  
    // Dynamic backgrounds for each section
    const getBackground = (gainLoss) =>
      Number(gainLoss.gain) > 0
        ? 'rgb(144,245,144)'
        : Number(gainLoss.loss) > 0
        ? 'rgb(245,144,144)'
        : 'transparent';


    return (
        <div className="mainboard">
            <div className="sdash-1">
                <h1 className="text-xl">Dashboard</h1>
                <div className="sdash-1 flex items-start justify-start gap-5">
                    <div className="acc-data">
                        <div className="slt-1">
                            <svg className='intr' width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            </svg>
                            <h1>Account User Data</h1>
                        </div>

                        <div className="recent-dates flex items-center justify-between gap-2">
                            <div className="list-opt grid">
                                {/* Using select element to simulate dropdown */}
                                <select value={accPeriod} onChange={(e) => setAccPeriod(e.target.value)}>
                                    <option className='opt' value="year">Last Year</option>
                                    <option className='opt' value="month">Last Month</option>
                                    <option className='opt' value="week">Last Week</option>
                                    <option className='opt' value="day">Last Day</option>
                                </select>
                            </div>
                            <div className="gl" style={{ background: getBackground(accGainLoss) }}>
                                <h1>+{accGainLoss.gain}%</h1>
                                <h1>-{accGainLoss.loss}%</h1>
                            </div>
                        </div>

                        <svg className='outr' width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        </svg>
                    </div>
                    <div className="shared-data">
                        <div className="slt-1">
                            <svg className='intr' width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            </svg>
                            <h1>Shared Task Data</h1>
                        </div>

                        <div className="recent-dates flex items-center justify-between gap-2">
                            <div className="list-opt grid">
                                <h5> Last Year </h5>
                                <h5> Last Month </h5>
                                <h5> Last Week </h5>
                                <h5> Last Day </h5>
                            </div>
                            <div className="gl">
                                <h1> +(Gain)% </h1>
                                <h1> -(Losses)% </h1>
                            </div>
                        </div>

                        <svg className='outr' width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        </svg>
                    </div>
                    <div className="premium-data">
                        <div className="slt-1">
                            <svg className='intr' width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            </svg>
                            <h1>Premium Rate Data</h1>
                        </div>

                        <div className="recent-dates flex items-center justify-between gap-2">
                            <div className="list-opt grid">
                                <h5> Last Year </h5>
                                <h5> Last Month </h5>
                                <h5> Last Week </h5>
                                <h5> Last Day </h5>
                            </div>

                            <div className="gl">
                                <h1> +(Gain)% </h1>
                                <h1> -(Losses)% </h1>
                            </div>

                        </div>
                        <svg className='outr' width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        </svg>
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

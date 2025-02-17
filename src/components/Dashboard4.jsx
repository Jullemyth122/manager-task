import React, { useEffect, useRef, useState } from 'react';
import '../scss/dashboard.scss';
import '../scss/sidebar.scss';
import '../scss/mainboard.scss';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/useAuth';
import { useActivity } from '../context/useActivity';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';


const now = new Date();

// Generate sample data for the past 365 days.
const generateCryptoData = (days, base, volatility, pumpChance = 0.1) => {
  const data = [];
  let currentValue = base;
  for (let i = days; i >= 0; i--) {
    // Calculate the date i days ago.
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

    // Normal random walk: add a small change.
    let change = (Math.random() - 0.5) * volatility;

    // Occasionally trigger a pump or dump event.
    // Pump: add a large positive spike.
    if (Math.random() < pumpChance) {
      const pumpMagnitude = volatility * (Math.random() * 10 + 5 * Math.random() * (100 - 100));
      change += pumpMagnitude;
    }
    // Dump: add a large negative spike.
    else if (Math.random() < pumpChance / 2) {
      const dumpMagnitude = volatility * (Math.random() * 10 + 5);
      change -= dumpMagnitude;
    }

    currentValue += change;
    // Ensure the value doesn't drop below 0.
    if (currentValue < 0) currentValue = 0;
    // Round the value to two decimal places.
    currentValue = Math.round(currentValue * 100) / 100;
    data.push({ createdAt: date, value: currentValue });
  }
  return data;
};

// Generate sample data for 365 days (approximately 12 months)
const sampleAccs = generateCryptoData(365, 85, 0.5, 0.05);    // A mild upward trend
const sampleShared = generateCryptoData(365, 100, 5, 0.00005);     // More volatility with pump/dump events
const samplePremium = generateCryptoData(365, 200, 1, 0.05);    // Stronger upward trend with lower volatility


// Helper: filter data based on the selected period.
const filterDataByPeriod = (data, period) => {
  const now = new Date();
  switch (period) {
    case 'thisYear':
      return data.filter(item => new Date(item.createdAt).getFullYear() === now.getFullYear());
    case 'thisMonth':
      return data.filter(item => {
        const d = new Date(item.createdAt);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      });
    case 'thisWeek': {
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      return data.filter(item => new Date(item.createdAt) >= startOfWeek);
    }
    case 'thisDay':
      return data.filter(item => new Date(item.createdAt).toDateString() === now.toDateString());
    default:
      return data;
  }
};

// StockChart component renders a line chart based on filtered data.
// The chart will update (with animation) when a different period is selected.
const StockChart = ({ data, period, color = 'blue' }) => {
    const filteredData = filterDataByPeriod(data, period);
    const sortedData = [...filteredData].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  
    const chartData = sortedData.map(item => ({
      date: new Date(item.createdAt).toLocaleDateString(),
      value: item.value,
    }));
  
    if (chartData.length > 0) {
      chartData.unshift({ date: chartData[0].date, value: 0 });
    }
  
    return (
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="value" domain={[0, 'auto']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  

// CustomDropdown component for custom-styled dropdown.
const CustomDropdown = ({ options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = option => {
    onSelect(option);
    setOpen(false);
  };

  const selectedOption = options.find(o => o.value === selected);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="custom-dropdown-selected" onClick={() => setOpen(!open)}>
        {selectedOption ? selectedOption.label : 'Select'}
      </div>
      {open && (
        <ul className="custom-dropdown-options">
          {options.map(option => (
            <li
              key={option.value}
              className="custom-dropdown-option"
              onClick={e => {
                e.stopPropagation();
                handleSelect(option.value);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const dropdownOptions = [
  { value: 'thisYear', label: 'This Year' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisDay', label: 'This Day' },
];

/**
 * computeGainLoss filters the data and calculates the percent change.
 */
/**
 * computeGainLoss calculates the maximum percentage gain ("pump") and maximum percentage loss ("dump")
 * from any local minimum/maximum in the filtered data, rather than simply comparing the first and last values.
 */const computeGainLoss = (data, period) => {
    const now = new Date();
    let filteredData;

    switch (period) {
        case 'thisYear':
            filteredData = data.filter((item) => new Date(item.createdAt).getFullYear() === now.getFullYear());
            break;
        case 'thisMonth':
            filteredData = data.filter((item) => {
                const d = new Date(item.createdAt);
                return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
            });
            break;
        case 'thisWeek': {
            const dayOfWeek = now.getDay();
            const startOfWeek = new Date(now);
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(now.getDate() - dayOfWeek);
            filteredData = data.filter((item) => new Date(item.createdAt) >= startOfWeek);
            break;
        }
        case 'thisDay':
            filteredData = data.filter((item) => new Date(item.createdAt).toDateString() === now.toDateString());
            break;
        default:
            filteredData = data;
    }

    if (filteredData.length < 2) return { gain: 0, loss: 0 };

    filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const earliestValue = filteredData[0].value;
    const latestValue = filteredData[filteredData.length - 1].value;
    const change = latestValue - earliestValue;
    const absoluteEarliest = Math.abs(earliestValue);
    let percentChange = 0;

    if (absoluteEarliest !== 0) {
        percentChange = (change / absoluteEarliest) * 100;
    }

    return {
        gain: change > 0 ? Math.abs(percentChange).toFixed(2) : 0,
        loss: change < 0 ? Math.abs(percentChange).toFixed(2) : 0,
    };
};


// Helper to display gain or loss.
const displayPercent = gainLoss => {
  if (Number(gainLoss.gain) > 0) return `+${gainLoss.gain}%`;
  if (Number(gainLoss.loss) > 0) return `-${gainLoss.loss}%`;
  return '0%';
};

const MainDash = () => {
    // For demonstration, force use of sample data.
    const accData = sampleAccs;
    const sharedData = sampleShared;
    const premiumData = samplePremium;

    // State for each section's period and computed gain/loss.
    const [accPeriod, setAccPeriod] = useState('thisYear');
    const [accGainLoss, setAccGainLoss] = useState({ gain: 0, loss: 0 });

    const [sharedPeriod, setSharedPeriod] = useState('thisYear');
    const [sharedGainLoss, setSharedGainLoss] = useState({ gain: 0, loss: 0 });

    const [premiumPeriod, setPremiumPeriod] = useState('thisYear');
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

    const getBackground = (gainLoss) =>
        Number(gainLoss.gain) > 0
        ? 'rgb(182, 255, 182)'
        : Number(gainLoss.loss) > 0
        ? 'rgb(245,144,144)'
        : '#0000006e';

    const getColor = (gainLoss) =>
        Number(gainLoss.gain) > 0
        ? 'rgb(25, 161, 25)'
        : Number(gainLoss.loss) > 0
        ? 'rgb(199, 20, 20)'
        : '#000';



    return (
        <div className="mainboard">
            <div className="sdash-1">
                <h1 className="text-xl">Dashboard</h1>
                <div className="sdash-1 flex items-start justify-start gap-5">
                    <div className="acc-data">
                        <div className="slt-1">
                            <svg className='intr' width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 0.25C13.8397 0.25 12.7269 0.710936 11.9064 1.53141C11.0859 2.35188 10.625 3.46468 10.625 4.625C10.625 5.78532 11.0859 6.89812 11.9064 7.71859C12.7269 8.53906 13.8397 9 15 9C16.1603 9 17.2731 8.53906 18.0936 7.71859C18.9141 6.89812 19.375 5.78532 19.375 4.625C19.375 3.46468 18.9141 2.35188 18.0936 1.53141C17.2731 0.710936 16.1603 0.25 15 0.25ZM15 2.75C15.4973 2.75 15.9742 2.94754 16.3258 3.29917C16.6775 3.65081 16.875 4.12772 16.875 4.625C16.875 5.12228 16.6775 5.59919 16.3258 5.95083C15.9742 6.30246 15.4973 6.5 15 6.5C14.5027 6.5 14.0258 6.30246 13.6742 5.95083C13.3225 5.59919 13.125 5.12228 13.125 4.625C13.125 4.12772 13.3225 3.65081 13.6742 3.29917C14.0258 2.94754 14.5027 2.75 15 2.75ZM6.875 4C6.0462 4 5.25134 4.32924 4.66529 4.91529C4.07924 5.50134 3.75 6.2962 3.75 7.125C3.75 8.3 4.4125 9.3125 5.3625 9.85C5.8125 10.1 6.325 10.25 6.875 10.25C7.425 10.25 7.9375 10.1 8.3875 9.85C8.85 9.5875 9.2375 9.2125 9.525 8.7625C8.61435 7.57571 8.12209 6.1209 8.125 4.625V4.275C7.75 4.1 7.325 4 6.875 4ZM23.125 4C22.675 4 22.25 4.1 21.875 4.275V4.625C21.875 6.125 21.3875 7.575 20.475 8.7625C20.625 9 20.7875 9.1875 20.975 9.375C21.5513 9.9341 22.3221 10.2478 23.125 10.25C23.675 10.25 24.1875 10.1 24.6375 9.85C25.5875 9.3125 26.25 8.3 26.25 7.125C26.25 6.2962 25.9208 5.50134 25.3347 4.91529C24.7487 4.32924 23.9538 4 23.125 4ZM15 11.5C12.075 11.5 6.25 12.9625 6.25 15.875V17.75H23.75V15.875C23.75 12.9625 17.925 11.5 15 11.5ZM5.8875 12.1875C3.475 12.475 0 13.7 0 15.875V17.75H3.75V15.3375C3.75 14.075 4.6125 13.025 5.8875 12.1875ZM24.1125 12.1875C25.3875 13.025 26.25 14.075 26.25 15.3375V17.75H30V15.875C30 13.7 26.525 12.475 24.1125 12.1875ZM15 14C16.9125 14 19.05 14.625 20.2875 15.25H9.7125C10.95 14.625 13.0875 14 15 14Z" fill="#094eb4"/>
                            </svg>
                            <h1>Account User Data</h1>
                        </div>

                        <div className="chart-container">
                            <StockChart data={accData} period={accPeriod} color="green" />
                        </div>

                        <div className='auto-x'>
                            <h1 className='text-2xl'>{accData.length}</h1>
                        </div>

                        <div className="recent-dates flex items-center justify-between gap-2">
                            <div className="list-opt grid">
                                <CustomDropdown
                                    options={dropdownOptions}
                                    selected={accPeriod}
                                    onSelect={setAccPeriod}
                                />

                            </div>


                            <div className="gl" style={{ background: getBackground(accGainLoss) }}>
                                <h1 style={{ color: getColor(accGainLoss) }}>{displayPercent(accGainLoss)}</h1>
                            </div>
                        </div>
                        

                        <div className="bg-static">
                            <svg className='outr' width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 0.25C13.8397 0.25 12.7269 0.710936 11.9064 1.53141C11.0859 2.35188 10.625 3.46468 10.625 4.625C10.625 5.78532 11.0859 6.89812 11.9064 7.71859C12.7269 8.53906 13.8397 9 15 9C16.1603 9 17.2731 8.53906 18.0936 7.71859C18.9141 6.89812 19.375 5.78532 19.375 4.625C19.375 3.46468 18.9141 2.35188 18.0936 1.53141C17.2731 0.710936 16.1603 0.25 15 0.25ZM15 2.75C15.4973 2.75 15.9742 2.94754 16.3258 3.29917C16.6775 3.65081 16.875 4.12772 16.875 4.625C16.875 5.12228 16.6775 5.59919 16.3258 5.95083C15.9742 6.30246 15.4973 6.5 15 6.5C14.5027 6.5 14.0258 6.30246 13.6742 5.95083C13.3225 5.59919 13.125 5.12228 13.125 4.625C13.125 4.12772 13.3225 3.65081 13.6742 3.29917C14.0258 2.94754 14.5027 2.75 15 2.75ZM6.875 4C6.0462 4 5.25134 4.32924 4.66529 4.91529C4.07924 5.50134 3.75 6.2962 3.75 7.125C3.75 8.3 4.4125 9.3125 5.3625 9.85C5.8125 10.1 6.325 10.25 6.875 10.25C7.425 10.25 7.9375 10.1 8.3875 9.85C8.85 9.5875 9.2375 9.2125 9.525 8.7625C8.61435 7.57571 8.12209 6.1209 8.125 4.625V4.275C7.75 4.1 7.325 4 6.875 4ZM23.125 4C22.675 4 22.25 4.1 21.875 4.275V4.625C21.875 6.125 21.3875 7.575 20.475 8.7625C20.625 9 20.7875 9.1875 20.975 9.375C21.5513 9.9341 22.3221 10.2478 23.125 10.25C23.675 10.25 24.1875 10.1 24.6375 9.85C25.5875 9.3125 26.25 8.3 26.25 7.125C26.25 6.2962 25.9208 5.50134 25.3347 4.91529C24.7487 4.32924 23.9538 4 23.125 4ZM15 11.5C12.075 11.5 6.25 12.9625 6.25 15.875V17.75H23.75V15.875C23.75 12.9625 17.925 11.5 15 11.5ZM5.8875 12.1875C3.475 12.475 0 13.7 0 15.875V17.75H3.75V15.3375C3.75 14.075 4.6125 13.025 5.8875 12.1875ZM24.1125 12.1875C25.3875 13.025 26.25 14.075 26.25 15.3375V17.75H30V15.875C30 13.7 26.525 12.475 24.1125 12.1875ZM15 14C16.9125 14 19.05 14.625 20.2875 15.25H9.7125C10.95 14.625 13.0875 14 15 14Z" fill="#094eb4"/>
                            </svg>
                        </div>
                    </div>
                    <div className="shared-data">
                        <div className="slt-1">
                            <svg className='intr' width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.75 16.707H21.75V16.0195C21.75 15.082 21.2917 14.3374 20.375 13.7858C19.4583 13.2341 18.25 12.9579 16.75 12.957C15.25 12.9562 14.0417 13.2324 13.125 13.7858C12.2083 14.3391 11.75 15.0837 11.75 16.0195V16.707ZM16.75 11.707C17.4375 11.707 18.0263 11.4624 18.5163 10.9733C19.0063 10.4841 19.2508 9.89536 19.25 9.20703C19.2492 8.5187 19.0046 7.93037 18.5163 7.44203C18.0279 6.9537 17.4392 6.7087 16.75 6.70703C16.0608 6.70536 15.4725 6.95037 14.985 7.44203C14.4975 7.9337 14.2525 8.52203 14.25 9.20703C14.2475 9.89203 14.4925 10.4808 14.985 10.9733C15.4775 11.4658 16.0658 11.7104 16.75 11.707ZM3 20.457C2.3125 20.457 1.72417 20.2124 1.235 19.7233C0.745833 19.2341 0.500833 18.6454 0.5 17.957V2.95703C0.5 2.26953 0.745 1.6812 1.235 1.19203C1.725 0.702864 2.31333 0.457865 3 0.457031H10.5L13 2.95703H23C23.6875 2.95703 24.2763 3.20203 24.7663 3.69203C25.2563 4.18203 25.5008 4.77036 25.5 5.45703V17.957C25.5 18.6445 25.2554 19.2333 24.7663 19.7233C24.2771 20.2133 23.6883 20.4579 23 20.457H3ZM3 17.957H23V5.45703H11.9688L9.46875 2.95703H3V17.957Z" fill="#094eb4"/>
                            </svg>
                            <h1>Shared Task Data</h1>
                        </div>

                        <div className="chart-container">
                            <StockChart data={sharedData} period={sharedPeriod} color="green" />
                        </div>

                        <div className='auto-x'>
                            <h1 className='text-2xl'>{sharedData.length}</h1>
                        </div>

                        <div className="recent-dates flex items-center justify-between gap-2">
                            <div className="list-opt grid">
                                <CustomDropdown
                                    options={dropdownOptions}
                                    selected={sharedPeriod}
                                    onSelect={setSharedPeriod}
                                />
                            </div>



                            <div className="gl" style={{ background: getBackground(sharedGainLoss) }}>
                                <h1 style={{ color: getColor(sharedGainLoss) }}>{displayPercent(sharedGainLoss)}</h1>
                            </div>
                        </div>

                        <div className="bg-static">
                            <svg className='outr' width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.75 16.707H21.75V16.0195C21.75 15.082 21.2917 14.3374 20.375 13.7858C19.4583 13.2341 18.25 12.9579 16.75 12.957C15.25 12.9562 14.0417 13.2324 13.125 13.7858C12.2083 14.3391 11.75 15.0837 11.75 16.0195V16.707ZM16.75 11.707C17.4375 11.707 18.0263 11.4624 18.5163 10.9733C19.0063 10.4841 19.2508 9.89536 19.25 9.20703C19.2492 8.5187 19.0046 7.93037 18.5163 7.44203C18.0279 6.9537 17.4392 6.7087 16.75 6.70703C16.0608 6.70536 15.4725 6.95037 14.985 7.44203C14.4975 7.9337 14.2525 8.52203 14.25 9.20703C14.2475 9.89203 14.4925 10.4808 14.985 10.9733C15.4775 11.4658 16.0658 11.7104 16.75 11.707ZM3 20.457C2.3125 20.457 1.72417 20.2124 1.235 19.7233C0.745833 19.2341 0.500833 18.6454 0.5 17.957V2.95703C0.5 2.26953 0.745 1.6812 1.235 1.19203C1.725 0.702864 2.31333 0.457865 3 0.457031H10.5L13 2.95703H23C23.6875 2.95703 24.2763 3.20203 24.7663 3.69203C25.2563 4.18203 25.5008 4.77036 25.5 5.45703V17.957C25.5 18.6445 25.2554 19.2333 24.7663 19.7233C24.2771 20.2133 23.6883 20.4579 23 20.457H3ZM3 17.957H23V5.45703H11.9688L9.46875 2.95703H3V17.957Z" fill="#094eb4"/>
                            </svg>
                        </div>

                    </div>
                    <div className="premium-data">

                        <div className="slt-1">
                            <svg className='intr' width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.24997 0.957031C5.12036 0.957004 4.99295 0.990568 4.88017 1.05445C4.76739 1.11833 4.6731 1.21035 4.60647 1.32153L0.106475 8.82153C0.0265927 8.95499 -0.00982236 9.10997 0.00227109 9.26504C0.0143645 9.4201 0.0743679 9.56757 0.173974 9.68703L11.415 23.1765C11.4974 23.2792 11.6054 23.3584 11.7281 23.4061C11.8509 23.4538 11.984 23.4683 12.1141 23.4483C12.2443 23.4282 12.3668 23.3742 12.4695 23.2918C12.5722 23.2093 12.6513 23.1013 12.699 22.9785L17.763 9.95703H23.601L23.826 9.68703C23.9256 9.56757 23.9856 9.4201 23.9977 9.26504C24.0098 9.10997 23.9734 8.95499 23.8935 8.82153L19.3935 1.32153C19.3269 1.21035 19.2326 1.11833 19.1198 1.05445C19.007 0.990568 18.8796 0.957004 18.75 0.957031H5.24997ZM16.155 9.95703L12 20.637L7.84647 9.95703H16.155ZM2.07297 8.45703L5.67297 2.45703H8.64148L6.24147 8.45703H2.07297ZM6.23548 9.95703L9.63597 18.7005L2.35197 9.95703H6.23548ZM7.85547 8.45703L10.2555 2.45703H13.74L16.14 8.45703H7.85547ZM17.7555 8.45703L15.3555 2.45703H18.324L21.924 8.45703H17.7555ZM20.2485 17.457C21.0441 17.457 21.8072 17.141 22.3698 16.5784C22.9324 16.0157 23.2485 15.2527 23.2485 14.457C23.2485 13.6614 22.9324 12.8983 22.3698 12.3357C21.8072 11.7731 21.0441 11.457 20.2485 11.457C19.4528 11.457 18.6898 11.7731 18.1272 12.3357C17.5645 12.8983 17.2485 13.6614 17.2485 14.457C17.2485 15.2527 17.5645 16.0157 18.1272 16.5784C18.6898 17.141 19.4528 17.457 20.2485 17.457ZM20.2485 24.957C23.9985 24.957 25.4985 23.0745 25.4985 21.207C25.4985 20.6103 25.2614 20.038 24.8395 19.616C24.4175 19.1941 23.8452 18.957 23.2485 18.957H17.2485C16.6517 18.957 16.0794 19.1941 15.6575 19.616C15.2355 20.038 14.9985 20.6103 14.9985 21.207C14.9985 23.082 16.4985 24.957 20.2485 24.957Z" fill="black"/>
                            </svg>
                            <h1>Premium Rate Data</h1>
                        </div>

                        <div className="chart-container">
                            <StockChart data={premiumData} period={premiumPeriod} color="green" />
                        </div>

                        <div className='auto-x'>
                            <h1 className='text-2xl'>{premiumData.length}</h1>
                        </div>

                        <div className="recent-dates flex items-center justify-between gap-2">
                            
                            <div className="list-opt grid">
                                <CustomDropdown
                                    options={dropdownOptions}
                                    selected={premiumPeriod}
                                    onSelect={setPremiumPeriod}
                                />
                            </div>


                            <div className="gl" style={{ background: getBackground(premiumGainLoss) }}>
                                <h1 style={{ color: getColor(premiumGainLoss) }}>{displayPercent(premiumGainLoss)}</h1>
                            </div>

                        </div>

                        <div className="bg-static">
                            <svg className='outr' width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.24997 0.957031C5.12036 0.957004 4.99295 0.990568 4.88017 1.05445C4.76739 1.11833 4.6731 1.21035 4.60647 1.32153L0.106475 8.82153C0.0265927 8.95499 -0.00982236 9.10997 0.00227109 9.26504C0.0143645 9.4201 0.0743679 9.56757 0.173974 9.68703L11.415 23.1765C11.4974 23.2792 11.6054 23.3584 11.7281 23.4061C11.8509 23.4538 11.984 23.4683 12.1141 23.4483C12.2443 23.4282 12.3668 23.3742 12.4695 23.2918C12.5722 23.2093 12.6513 23.1013 12.699 22.9785L17.763 9.95703H23.601L23.826 9.68703C23.9256 9.56757 23.9856 9.4201 23.9977 9.26504C24.0098 9.10997 23.9734 8.95499 23.8935 8.82153L19.3935 1.32153C19.3269 1.21035 19.2326 1.11833 19.1198 1.05445C19.007 0.990568 18.8796 0.957004 18.75 0.957031H5.24997ZM16.155 9.95703L12 20.637L7.84647 9.95703H16.155ZM2.07297 8.45703L5.67297 2.45703H8.64148L6.24147 8.45703H2.07297ZM6.23548 9.95703L9.63597 18.7005L2.35197 9.95703H6.23548ZM7.85547 8.45703L10.2555 2.45703H13.74L16.14 8.45703H7.85547ZM17.7555 8.45703L15.3555 2.45703H18.324L21.924 8.45703H17.7555ZM20.2485 17.457C21.0441 17.457 21.8072 17.141 22.3698 16.5784C22.9324 16.0157 23.2485 15.2527 23.2485 14.457C23.2485 13.6614 22.9324 12.8983 22.3698 12.3357C21.8072 11.7731 21.0441 11.457 20.2485 11.457C19.4528 11.457 18.6898 11.7731 18.1272 12.3357C17.5645 12.8983 17.2485 13.6614 17.2485 14.457C17.2485 15.2527 17.5645 16.0157 18.1272 16.5784C18.6898 17.141 19.4528 17.457 20.2485 17.457ZM20.2485 24.957C23.9985 24.957 25.4985 23.0745 25.4985 21.207C25.4985 20.6103 25.2614 20.038 24.8395 19.616C24.4175 19.1941 23.8452 18.957 23.2485 18.957H17.2485C16.6517 18.957 16.0794 19.1941 15.6575 19.616C15.2355 20.038 14.9985 20.6103 14.9985 21.207C14.9985 23.082 16.4985 24.957 20.2485 24.957Z" fill="black"/>
                            </svg>
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

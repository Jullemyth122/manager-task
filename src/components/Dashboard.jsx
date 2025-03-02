import React, { useEffect, useRef, useState } from 'react';
import '../scss/dashboard.scss';
import '../scss/sidebar.scss';
import '../scss/mainboard.scss';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/useAuth';
import { useActivity } from '../context/useActivity';
import StockChart from './dashboardactivity/StockChart';
import CalendarWidget from './dashboardactivity/CalendarWidget';
import { useSearchFilter } from '../hooks/useSearchFilters';

// Reference to the current time.
const now = new Date();

// Parabolic pump for Account User Data: rapid surge to a peak then a correction.
const sampleAccs = [
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0), value: 0 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0), value: 130 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0), value: 170 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0), value: 220 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0), value: 180 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0), value: 150 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0), value: 130 },
];

// Staircase pump for Shared Task Data: step-like increases.
const sampleShared = [
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0), value: 0 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 2, 0), value: 50 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0), value: 110 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0), value: 150 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0), value: 130 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0), value: 90 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0), value: 155 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0), value: 173 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0), value: 230 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0), value: 250 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0), value: 200 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 15), value: 163 },
];

// Mountain pump for Premium Rate Data: a series of peaks and valleys.
const samplePremium = [
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0), value: 0 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 2, 0), value: 20 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 3, 0), value: 22 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0), value: 25 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0), value: 25 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0), value: 25 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0), value: 40 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0), value: 80 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0), value: 120 },
  { createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0), value: 180 },
];

const computeGainLoss = (data, period) => {
  const today = new Date().toDateString();
  const filteredData = data.filter(
    (item) => new Date(item.createdAt).toDateString() === today
  );
  if (filteredData.length < 2) return { gain: 0, loss: 0 };
  filteredData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const firstValue = filteredData[0].value;
  const lastValue = filteredData[filteredData.length - 1].value;
  const change = lastValue - firstValue;
  let percentChange = 0;
  if (firstValue === 0) {
    percentChange = lastValue * 1;
  } else {
    percentChange = (change / Math.abs(firstValue)) * 1;
  }
  return {
    gain: percentChange > 0 ? percentChange.toFixed(2) : 0,
    loss: percentChange < 0 ? Math.abs(percentChange).toFixed(2) : 0,
  };
};
  
const displayPercent = (gainLoss) => {
  if (Number(gainLoss.gain) > 0) return `+${gainLoss.gain}%`;
  if (Number(gainLoss.loss) > 0) return `${gainLoss.loss}%`;
  return '0%';
};

const MainDash = () => {

  const { userBoards } = useActivity();
  const { accs } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust how many items you want per page

  const filteredAccs = useSearchFilter(accs, searchTerm, ['username', 'email']);

  const sortedAccs = filteredAccs.slice().sort((a, b) => {
    const dateA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedAccs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAccs.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const accData = sampleAccs;
  const sharedData = sampleShared;
  const premiumData = samplePremium;

  const period = 'thisDay';

  const accGainLoss = computeGainLoss(accData, period);
  const sharedGainLoss = computeGainLoss(sharedData, period);
  const premiumGainLoss = computeGainLoss(premiumData, period);

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

  const countSharedTasksForEmail = (boards, email) =>
    boards.reduce((count, board) => {
      if (
        board.boardVisibility === "Workspace" &&
        board.boardInviteEmail &&
        board.boardInviteEmail.includes(email)
      ) {
        return count + 1;
      }
      return count;
    }, 0);
      

  return (
      <div className="mainboard">
        <div className="sdash-1">
          <h1 className="text-xl">Dashboard</h1>
          <div className="sdasher gap-5 flex-wrap">
            <div className="acc-data">
              <div className="slt-1">
                <svg className="intr" width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0.25C13.8397 0.25 12.7269 0.710936 11.9064 1.53141C11.0859 2.35188 10.625 3.46468 10.625 4.625C10.625 5.78532 11.0859 6.89812 11.9064 7.71859C12.7269 8.53906 13.8397 9 15 9C16.1603 9 17.2731 8.53906 18.0936 7.71859C18.9141 6.89812 19.375 5.78532 19.375 4.625C19.375 3.46468 18.9141 2.35188 18.0936 1.53141C17.2731 0.710936 16.1603 0.25 15 0.25ZM15 2.75C15.4973 2.75 15.9742 2.94754 16.3258 3.29917C16.6775 3.65081 16.875 4.12772 16.875 4.625C16.875 5.12228 16.6775 5.59919 16.3258 5.95083C15.9742 6.30246 15.4973 6.5 15 6.5C14.5027 6.5 14.0258 6.30246 13.6742 5.95083C13.3225 5.59919 13.125 5.12228 13.125 4.625C13.125 4.12772 13.3225 3.65081 13.6742 3.29917C14.0258 2.94754 14.5027 2.75 15 2.75ZM6.875 4C6.0462 4 5.25134 4.32924 4.66529 4.91529C4.07924 5.50134 3.75 6.2962 3.75 7.125C3.75 8.3 4.4125 9.3125 5.3625 9.85C5.8125 10.1 6.325 10.25 6.875 10.25C7.425 10.25 7.9375 10.1 8.3875 9.85C8.85 9.5875 9.2375 9.2125 9.525 8.7625C8.61435 7.57571 8.12209 6.1209 8.125 4.625V4.275C7.75 4.1 7.325 4 6.875 4ZM23.125 4C22.675 4 22.25 4.1 21.875 4.275V4.625C21.875 6.125 21.3875 7.575 20.475 8.7625C20.625 9 20.7875 9.1875 20.975 9.375C21.5513 9.9341 22.3221 10.2478 23.125 10.25C23.675 10.25 24.1875 10.1 24.6375 9.85C25.5875 9.3125 26.25 8.3 26.25 7.125C26.25 6.2962 25.9208 5.50134 25.3347 4.91529C24.7487 4.32924 23.9538 4 23.125 4ZM15 11.5C12.075 11.5 6.25 12.9625 6.25 15.875V17.75H23.75V15.875C23.75 12.9625 17.925 11.5 15 11.5ZM5.8875 12.1875C3.475 12.475 0 13.7 0 15.875V17.75H3.75V15.3375C3.75 14.075 4.6125 13.025 5.8875 12.1875ZM24.1125 12.1875C25.3875 13.025 26.25 14.075 26.25 15.3375V17.75H30V15.875C30 13.7 26.525 12.475 24.1125 12.1875ZM15 14C16.9125 14 19.05 14.625 20.2875 15.25H9.7125C10.95 14.625 13.0875 14 15 14Z"/>
                </svg>
                <h1>Account User Data</h1>
              </div>
              <div className="chart-container">
                <StockChart
                  data={accData}
                  period="This Day"
                  title="Account User Data"
                  color="#79afff"
                />
              </div>
              <div className="auto-x">
                <h1 className="text-xl">
                {accData.length > 0 ? accData[accData.length - 1].value : '-'}
                </h1>
              </div>
              <div className="recent-dates flex items-center justify-between gap-2">
                <div className="list-opt grid">
                {/* Replacing dropdown with static text */}
                <div className="static-select">This Day</div>
                </div>
                <div className="gl" style={{ background: getBackground(accGainLoss) }}>
                <h1 style={{ color: getColor(accGainLoss) }}>{displayPercent(accGainLoss)}</h1>
                </div>
              </div>
              <div className="bg-static">
                <svg className="outr" width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0.25C13.8397 0.25 12.7269 0.710936 11.9064 1.53141C11.0859 2.35188 10.625 3.46468 10.625 4.625C10.625 5.78532 11.0859 6.89812 11.9064 7.71859C12.7269 8.53906 13.8397 9 15 9C16.1603 9 17.2731 8.53906 18.0936 7.71859C18.9141 6.89812 19.375 5.78532 19.375 4.625C19.375 3.46468 18.9141 2.35188 18.0936 1.53141C17.2731 0.710936 16.1603 0.25 15 0.25ZM15 2.75C15.4973 2.75 15.9742 2.94754 16.3258 3.29917C16.6775 3.65081 16.875 4.12772 16.875 4.625C16.875 5.12228 16.6775 5.59919 16.3258 5.95083C15.9742 6.30246 15.4973 6.5 15 6.5C14.5027 6.5 14.0258 6.30246 13.6742 5.95083C13.3225 5.59919 13.125 5.12228 13.125 4.625C13.125 4.12772 13.3225 3.65081 13.6742 3.29917C14.0258 2.94754 14.5027 2.75 15 2.75ZM6.875 4C6.0462 4 5.25134 4.32924 4.66529 4.91529C4.07924 5.50134 3.75 6.2962 3.75 7.125C3.75 8.3 4.4125 9.3125 5.3625 9.85C5.8125 10.1 6.325 10.25 6.875 10.25C7.425 10.25 7.9375 10.1 8.3875 9.85C8.85 9.5875 9.2375 9.2125 9.525 8.7625C8.61435 7.57571 8.12209 6.1209 8.125 4.625V4.275C7.75 4.1 7.325 4 6.875 4ZM23.125 4C22.675 4 22.25 4.1 21.875 4.275V4.625C21.875 6.125 21.3875 7.575 20.475 8.7625C20.625 9 20.7875 9.1875 20.975 9.375C21.5513 9.9341 22.3221 10.2478 23.125 10.25C23.675 10.25 24.1875 10.1 24.6375 9.85C25.5875 9.3125 26.25 8.3 26.25 7.125C26.25 6.2962 25.9208 5.50134 25.3347 4.91529C24.7487 4.32924 23.9538 4 23.125 4ZM15 11.5C12.075 11.5 6.25 12.9625 6.25 15.875V17.75H23.75V15.875C23.75 12.9625 17.925 11.5 15 11.5ZM5.8875 12.1875C3.475 12.475 0 13.7 0 15.875V17.75H3.75V15.3375C3.75 14.075 4.6125 13.025 5.8875 12.1875ZM24.1125 12.1875C25.3875 13.025 26.25 14.075 26.25 15.3375V17.75H30V15.875C30 13.7 26.525 12.475 24.1125 12.1875ZM15 14C16.9125 14 19.05 14.625 20.2875 15.25H9.7125C10.95 14.625 13.0875 14 15 14Z"/>
                </svg>
              </div>
            </div>

            <div className="shared-data">
              <div className="slt-1">
                <svg className="intr" width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.75 16.707H21.75V16.0195C21.75 15.082 21.2917 14.3374 20.375 13.7858C19.4583 13.2341 18.25 12.9579 16.75 12.957C15.25 12.9562 14.0417 13.2324 13.125 13.7858C12.2083 14.3391 11.75 15.0837 11.75 16.0195V16.707ZM16.75 11.707C17.4375 11.707 18.0263 11.4624 18.5163 10.9733C19.0063 10.4841 19.2508 9.89536 19.25 9.20703C19.2492 8.5187 19.0046 7.93037 18.5163 7.44203C18.0279 6.9537 17.4392 6.7087 16.75 6.70703C16.0608 6.70536 15.4725 6.95037 14.985 7.44203C14.4975 7.9337 14.2525 8.52203 14.25 9.20703C14.2475 9.89203 14.4925 10.4808 14.985 10.9733C15.4775 11.4658 16.0658 11.7104 16.75 11.707ZM3 20.457C2.3125 20.457 1.72417 20.2124 1.235 19.7233C0.745833 19.2341 0.500833 18.6454 0.5 17.957V2.95703C0.5 2.26953 0.745 1.6812 1.235 1.19203C1.725 0.702864 2.31333 0.457865 3 0.457031H10.5L13 2.95703H23C23.6875 2.95703 24.2763 3.20203 24.7663 3.69203C25.2563 4.18203 25.5008 4.77036 25.5 5.45703V17.957C25.5 18.6445 25.2554 19.2333 24.7663 19.7233C24.2771 20.2133 23.6883 20.4579 23 20.457H3ZM3 17.957H23V5.45703H11.9688L9.46875 2.95703H3V17.957Z"/>                
                </svg>
                <h1>Shared Task Data</h1>
              </div>
              <div className="chart-container">
                <StockChart
                data={sharedData}
                period="This Day"
                title="Shared Task Data"
                color="#79afff"
                />
              </div>
              <div className="auto-x">
                <h1 className="text-xl">
                {sharedData.length > 0 ? sharedData[sharedData.length - 1].value : '-'}
                </h1>
              </div>
              <div className="recent-dates flex items-center justify-between gap-2">
                <div className="list-opt grid">
                  <div className="static-select">This Day</div>
                </div>
                <div className="gl" style={{ background: getBackground(sharedGainLoss) }}>
                  <h1 style={{ color: getColor(sharedGainLoss) }}>{displayPercent(sharedGainLoss)}</h1>
                </div>
              </div>
              <div className="bg-static">
                <svg className="outr" width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.75 16.707H21.75V16.0195C21.75 15.082 21.2917 14.3374 20.375 13.7858C19.4583 13.2341 18.25 12.9579 16.75 12.957C15.25 12.9562 14.0417 13.2324 13.125 13.7858C12.2083 14.3391 11.75 15.0837 11.75 16.0195V16.707ZM16.75 11.707C17.4375 11.707 18.0263 11.4624 18.5163 10.9733C19.0063 10.4841 19.2508 9.89536 19.25 9.20703C19.2492 8.5187 19.0046 7.93037 18.5163 7.44203C18.0279 6.9537 17.4392 6.7087 16.75 6.70703C16.0608 6.70536 15.4725 6.95037 14.985 7.44203C14.4975 7.9337 14.2525 8.52203 14.25 9.20703C14.2475 9.89203 14.4925 10.4808 14.985 10.9733C15.4775 11.4658 16.0658 11.7104 16.75 11.707ZM3 20.457C2.3125 20.457 1.72417 20.2124 1.235 19.7233C0.745833 19.2341 0.500833 18.6454 0.5 17.957V2.95703C0.5 2.26953 0.745 1.6812 1.235 1.19203C1.725 0.702864 2.31333 0.457865 3 0.457031H10.5L13 2.95703H23C23.6875 2.95703 24.2763 3.20203 24.7663 3.69203C25.2563 4.18203 25.5008 4.77036 25.5 5.45703V17.957C25.5 18.6445 25.2554 19.2333 24.7663 19.7233C24.2771 20.2133 23.6883 20.4579 23 20.457H3ZM3 17.957H23V5.45703H11.9688L9.46875 2.95703H3V17.957Z"/>
                </svg>
              </div>
            </div>
            <div className="premium-data">
              <div className="slt-1">
                <svg className="intr" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.24997 0.957031C5.12036 0.957004 4.99295 0.990568 4.88017 1.05445C4.76739 1.11833 4.6731 1.21035 4.60647 1.32153L0.106475 8.82153C0.0265927 8.95499 -0.00982236 9.10997 0.00227109 9.26504C0.0143645 9.4201 0.0743679 9.56757 0.173974 9.68703L11.415 23.1765C11.4974 23.2792 11.6054 23.3584 11.7281 23.4061C11.8509 23.4538 11.984 23.4683 12.1141 23.4483C12.2443 23.4282 12.3668 23.3742 12.4695 23.2918C12.5722 23.2093 12.6513 23.1013 12.699 22.9785L17.763 9.95703H23.601L23.826 9.68703C23.9256 9.56757 23.9856 9.4201 23.9977 9.26504C24.0098 9.10997 23.9734 8.95499 23.8935 8.82153L19.3935 1.32153C19.3269 1.21035 19.2326 1.11833 19.1198 1.05445C19.007 0.990568 18.8796 0.957004 18.75 0.957031H5.24997ZM16.155 9.95703L12 20.637L7.84647 9.95703H16.155ZM2.07297 8.45703L5.67297 2.45703H8.64148L6.24147 8.45703H2.07297ZM6.23548 9.95703L9.63597 18.7005L2.35197 9.95703H6.23548ZM7.85547 8.45703L10.2555 2.45703H13.74L16.14 8.45703H7.85547ZM17.7555 8.45703L15.3555 2.45703H18.324L21.924 8.45703H17.7555ZM20.2485 17.457C21.0441 17.457 21.8072 17.141 22.3698 16.5784C22.9324 16.0157 23.2485 15.2527 23.2485 14.457C23.2485 13.6614 22.9324 12.8983 22.3698 12.3357C21.8072 11.7731 21.0441 11.457 20.2485 11.457C19.4528 11.457 18.6898 11.7731 18.1272 12.3357C17.5645 12.8983 17.2485 13.6614 17.2485 14.457C17.2485 15.2527 17.5645 16.0157 18.1272 16.5784C18.6898 17.141 19.4528 17.457 20.2485 17.457ZM20.2485 24.957C23.9985 24.957 25.4985 23.0745 25.4985 21.207C25.4985 20.6103 25.2614 20.038 24.8395 19.616C24.4175 19.1941 23.8452 18.957 23.2485 18.957H17.2485C16.6517 18.957 16.0794 19.1941 15.6575 19.616C15.2355 20.038 14.9985 20.6103 14.9985 21.207C14.9985 23.082 16.4985 24.957 20.2485 24.957Z"/>
                </svg>
                <h1>Premium Rate Data</h1>
              </div>
              <div className="chart-container">
                <StockChart
                data={premiumData}
                period="This Day"
                title="Premium Rate Data"
                color="#79afff"
                />
              </div>
              <div className="auto-x">
                <h1 className="text-xl">
                {premiumData.length > 0 ? premiumData[premiumData.length - 1].value : '-'}
                </h1>
              </div>
              <div className="recent-dates flex items-center justify-between gap-2">
                <div className="list-opt grid">
                  <div className="static-select">This Day</div>
                </div>
                <div className="gl" style={{ background: getBackground(premiumGainLoss) }}>
                  <h1 style={{ color: getColor(premiumGainLoss) }}>{displayPercent(premiumGainLoss)}</h1>
                </div>
              </div>
              <div className="bg-static">
                <svg className="outr" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.24997 0.957031C5.12036 0.957004 4.99295 0.990568 4.88017 1.05445C4.76739 1.11833 4.6731 1.21035 4.60647 1.32153L0.106475 8.82153C0.0265927 8.95499 -0.00982236 9.10997 0.00227109 9.26504C0.0143645 9.4201 0.0743679 9.56757 0.173974 9.68703L11.415 23.1765C11.4974 23.2792 11.6054 23.3584 11.7281 23.4061C11.8509 23.4538 11.984 23.4683 12.1141 23.4483C12.2443 23.4282 12.3668 23.3742 12.4695 23.2918C12.5722 23.2093 12.6513 23.1013 12.699 22.9785L17.763 9.95703H23.601L23.826 9.68703C23.9256 9.56757 23.9856 9.4201 23.9977 9.26504C24.0098 9.10997 23.9734 8.95499 23.8935 8.82153L19.3935 1.32153C19.3269 1.21035 19.2326 1.11833 19.1198 1.05445C19.007 0.990568 18.8796 0.957004 18.75 0.957031H5.24997ZM16.155 9.95703L12 20.637L7.84647 9.95703H16.155ZM2.07297 8.45703L5.67297 2.45703H8.64148L6.24147 8.45703H2.07297ZM6.23548 9.95703L9.63597 18.7005L2.35197 9.95703H6.23548ZM7.85547 8.45703L10.2555 2.45703H13.74L16.14 8.45703H7.85547ZM17.7555 8.45703L15.3555 2.45703H18.324L21.924 8.45703H17.7555ZM20.2485 17.457C21.0441 17.457 21.8072 17.141 22.3698 16.5784C22.9324 16.0157 23.2485 15.2527 23.2485 14.457C23.2485 13.6614 22.9324 12.8983 22.3698 12.3357C21.8072 11.7731 21.0441 11.457 20.2485 11.457C19.4528 11.457 18.6898 11.7731 18.1272 12.3357C17.5645 12.8983 17.2485 13.6614 17.2485 14.457C17.2485 15.2527 17.5645 16.0157 18.1272 16.5784C18.6898 17.141 19.4528 17.457 20.2485 17.457ZM20.2485 24.957C23.9985 24.957 25.4985 23.0745 25.4985 21.207C25.4985 20.6103 25.2614 20.038 24.8395 19.616C24.4175 19.1941 23.8452 18.957 23.2485 18.957H17.2485C16.6517 18.957 16.0794 19.1941 15.6575 19.616C15.2355 20.038 14.9985 20.6103 14.9985 21.207C14.9985 23.082 16.4985 24.957 20.2485 24.957Z"/>
                </svg>
              </div>
            </div>
            <div className="calendar-data">
              <h5> Schedule Today </h5>
              <CalendarWidget/>
            </div>
          </div>
          <div className="user-act-comp">
            <h1> Users Recent Activities </h1>
            <div className="layer-head">
              <div className="search-bar flex items-center justify-center gap-2.5">
                <input
                  type="text"
                  placeholder="Search Username / Email / Premium / Update"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 9.5918C14 10.9179 13.4732 12.1896 12.5355 13.1273C11.5979 14.065 10.3261 14.5918 9 14.5918C7.67392 14.5918 6.40215 14.065 5.46447 13.1273C4.52678 12.1896 4 10.9179 4 9.5918C4 8.26571 4.52678 6.99394 5.46447 6.05626C6.40215 5.11858 7.67392 4.5918 9 4.5918C10.3261 4.5918 11.5979 5.11858 12.5355 6.05626C13.4732 6.99394 14 8.26571 14 9.5918Z" fill="#fff"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M3.3684e-08 9.59082C0.000155699 8.1532 0.344701 6.73653 1.00479 5.45941C1.66489 4.18228 2.62132 3.08187 3.79402 2.25029C4.96672 1.41871 6.32158 0.88015 7.74516 0.679707C9.16874 0.479264 10.6196 0.622765 11.9764 1.0982C13.3331 1.57363 14.5562 2.36716 15.5433 3.41236C16.5304 4.45755 17.2527 5.724 17.6498 7.10569C18.0469 8.48738 18.1073 9.9441 17.8258 11.3539C17.5443 12.7637 16.9292 14.0856 16.032 15.2088L19.707 18.8838C19.8892 19.0724 19.99 19.325 19.9877 19.5872C19.9854 19.8494 19.8802 20.1002 19.6948 20.2856C19.5094 20.4711 19.2586 20.5762 18.9964 20.5785C18.7342 20.5808 18.4816 20.48 18.293 20.2978L14.618 16.6228C13.2939 17.6808 11.6979 18.3434 10.0138 18.5343C8.32966 18.7252 6.62586 18.4367 5.0985 17.702C3.57113 16.9672 2.28228 15.8161 1.38029 14.3812C0.478308 12.9462 -0.000146577 11.2857 3.3684e-08 9.59082ZM9 2.59082C8.08075 2.59082 7.17049 2.77188 6.32122 3.12367C5.47194 3.47545 4.70026 3.99107 4.05025 4.64108C3.40024 5.29109 2.88463 6.06276 2.53284 6.91204C2.18106 7.76132 2 8.67157 2 9.59082C2 10.5101 2.18106 11.4203 2.53284 12.2696C2.88463 13.1189 3.40024 13.8906 4.05025 14.5406C4.70026 15.1906 5.47194 15.7062 6.32122 16.058C7.17049 16.4098 8.08075 16.5908 9 16.5908C10.8565 16.5908 12.637 15.8533 13.9497 14.5406C15.2625 13.2278 16 11.4473 16 9.59082C16 7.73431 15.2625 5.95383 13.9497 4.64108C12.637 3.32832 10.8565 2.59082 9 2.59082Z" fill="#fff"/>
                </svg>
              </div>
              <div className="pagination-controls flex items-center justify-center gap-2.5">
                <button className='cursor-pointer' onClick={handlePrevPage} disabled={currentPage === 1}>
                  <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.36296 13.6113C8.47884 13.4957 8.57077 13.3583 8.6335 13.2071C8.69623 13.0559 8.72852 12.8938 8.72852 12.7301C8.72852 12.5664 8.69623 12.4042 8.6335 12.253C8.57077 12.1018 8.47884 11.9645 8.36296 11.8488L3.51296 6.99881L8.36296 2.14881C8.59668 1.91509 8.72799 1.5981 8.72799 1.26756C8.72799 0.937031 8.59668 0.620034 8.36296 0.386312C8.12924 0.152589 7.81224 0.0212879 7.48171 0.0212879C7.15118 0.0212879 6.83418 0.152589 6.60046 0.386312L0.86296 6.12381C0.747081 6.23946 0.655146 6.37682 0.59242 6.52803C0.529693 6.67925 0.497406 6.84135 0.497406 7.00506C0.497406 7.16877 0.529693 7.33088 0.59242 7.48209C0.655146 7.63331 0.747081 7.77067 0.86296 7.88631L6.60046 13.6238C7.07546 14.0988 7.87546 14.0988 8.36296 13.6113Z"/>
                  </svg>
                </button>
                <span>{`${currentPage} of ${totalPages}`}</span>
                <button className='cursor-pointer' onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.63704 0.386734C0.52116 0.502376 0.429226 0.639737 0.366499 0.790954C0.303772 0.94217 0.271484 1.10427 0.271484 1.26798C0.271484 1.43169 0.303772 1.5938 0.366499 1.74501C0.429226 1.89623 0.52116 2.03359 0.63704 2.14923L5.48704 6.99923L0.63704 11.8492C0.403318 12.083 0.272014 12.4 0.272014 12.7305C0.272014 13.061 0.403318 13.378 0.63704 13.6117C0.870762 13.8455 1.18776 13.9768 1.51829 13.9768C1.84882 13.9768 2.16582 13.8455 2.39954 13.6117L8.13704 7.87423C8.25292 7.75859 8.34485 7.62123 8.40758 7.47001C8.47031 7.3188 8.50259 7.15669 8.50259 6.99298C8.50259 6.82927 8.47031 6.66717 8.40758 6.51595C8.34485 6.36474 8.25292 6.22738 8.13704 6.11173L2.39954 0.374234C1.92454 -0.100766 1.12454 -0.100766 0.63704 0.386734Z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="layer-list">
              <table>
                <thead>
                  <tr>
                    <th>Email / Username</th>
                    <th>UID</th>
                    <th>Created Date</th>
                    <th>Update Details</th>
                    <th>Updated Date</th>
                    <th>Shared Tasks</th>
                    <th>Premium Badge</th>
                  </tr>
                </thead>
                <tbody className="tbody-container">
                  {currentItems
                    .slice() // Copy array to avoid mutating the original
                    .sort((a, b) => {
                      // Use updatedAt if available, otherwise fallback to createdAt
                      const getDate = (acc) =>
                        acc.updatedAt && acc.updatedAt.toDate
                          ? acc.updatedAt.toDate()
                          : new Date(acc.createdAt);
                      return getDate(a) - getDate(b);
                    })
                    .map((acc) => {
                      const createdDate =
                        acc.createdAt && acc.createdAt.toDate
                          ? acc.createdAt.toDate()
                          : new Date(acc.createdAt);
                      const updatedDate =
                        acc.updatedAt && acc.updatedAt.toDate
                          ? acc.updatedAt.toDate()
                          : new Date(acc.createdAt);
                      return (
                        <tr key={acc.id}>
                          <td>{acc.username || acc.email || '-'}</td>
                          <td>{acc.uid || '-'}</td>
                          <td>{createdDate.toLocaleString()}</td>
                          <td>{acc.updates || '-'}</td>
                          <td>{updatedDate.toLocaleString()}</td>
                          <td>{countSharedTasksForEmail(userBoards, acc.email) || '-'}</td>
                          <td>{acc.isPremiumUser ? "Yes" : "No"}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
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

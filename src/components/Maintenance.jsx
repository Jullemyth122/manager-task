import React, { useEffect, useRef, useState } from 'react'
import '../scss/sidebar.scss'
import '../scss/maintenance.scss'
import MiniDonutChart from './dashboardactivity/MIniDonutChart'
import DailyPremiumChart from './dashboardactivity/DailyPremiumChart'
import AccReqControl from './dashboardactivity/AccRequestControls'
import { Sidebar } from './Sidebar'
import Emoji from './maintenanceactivity/Emoji'
import { useSearchFilter } from '../hooks/useSearchFilters'
import { useAuth } from '../context/useAuth'
import { useActivity } from '../context/useActivity'
import { useTruncateText } from '../hooks/useTruncateText'

const MaintenanceBoard = () => {

    const { accs, currentUser } = useAuth()
    const { 
        handleSendMessage, status, setStatus, message, 
        setMessage, selectedUser, setSelectedUser, error,
        success, setSuccess
 
    } = useActivity()

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [searchDDVisible, setSearchDDVisible] = useState(false);
    const dropdownRef = useRef(null);
  
    const [searchTerm, setSearchTerm] = useState(null);
    const [searchTask, setSearchTask] = useState(null);


    const finalFilteredAccounts = useSearchFilter(accs, searchTerm, [
        'username',
        'email',
    ]);


    const handleStatusClick = () => {
      setDropdownVisible((prev) => !prev);
    };
  
    const handleOptionClick = (selectedStatus, e) => {
        e.stopPropagation();
        setStatus(selectedStatus);
        setDropdownVisible(false);
    };
  
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownVisible(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  

    return (
        <div className="mainboard">
            <div className="sdash-1">
                <h1 className='text-2xl'> Maintenance </h1>
                
                <div className="data-1 flex items-center justify-start gap-2 flex-wrap">
                    
                    <div className="overview-content w-96">
                        <h1> Shared Tasks & Premium Rate  </h1>

                        <div className="ts-f grid">
                            <div className="ts-f-left">
                                <h2>5123 Shared tasks </h2>
                                <div className="ts-f-dt">
                                    <svg
                                    width="26"
                                    height="20"
                                    viewBox="0 0 26 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M11.75 16.25H21.75V15.5625C21.75 14.625 21.2917 13.8804 20.375 13.3288C19.4583 12.7771 18.25 12.5008 16.75 12.5C15.25 12.4992 14.0417 12.7754 13.125 13.3288C12.2083 13.8821 11.75 14.6267 11.75 15.5625V16.25ZM16.75 11.25C17.4375 11.25 18.0263 11.0054 18.5163 10.5163C19.0063 10.0271 19.2508 9.43833 19.25 8.75C19.2492 8.06167 19.0046 7.47333 18.5163 6.985C18.0279 6.49667 17.4392 6.25167 16.75 6.25C16.0608 6.24833 15.4725 6.49333 14.985 6.985C14.4975 7.47667 14.2525 8.065 14.25 8.75C14.2475 9.435 14.4925 10.0238 14.985 10.5163C15.4775 11.0088 16.0658 11.2533 16.75 11.25ZM3 20C2.3125 20 1.72417 19.7554 1.235 19.2663C0.745833 18.7771 0.500833 18.1883 0.5 17.5V2.5C0.5 1.8125 0.745 1.22417 1.235 0.735C1.725 0.245833 2.31333 0.000833333 3 0H10.5L13 2.5H23C23.6875 2.5 24.2763 2.745 24.7663 3.235C25.2563 3.725 25.5008 4.31333 25.5 5V17.5C25.5 18.1875 25.2554 18.7763 24.7663 19.2663C24.2771 19.7563 23.6883 20.0008 23 20H3ZM3 17.5H23V5H11.9688L9.46875 2.5H3V17.5Z" fill="black"/>
                                    </svg>
                                    <h5>Allow Shared</h5>
                                    <input type="checkbox" name="allowShared" id="allowShared" />
                                </div>
                            </div>
                            <div className="ts-f-right">
                                <div className="mini-chart">
                                    <MiniDonutChart />
                                    <p> Shared Task Completion Rate</p>
                                </div>
                            </div>
                        </div>

                        <div className="ts-f grid">
                            <div className="ts-f-left">
                                <h2> 222 Premium users </h2>
                                <div className="ts-f-dt">
                                    <svg 
                                        width="26" 
                                        height="25" 
                                        viewBox="0 0 26 25" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M5.24997 0.5C5.12036 0.499973 4.99295 0.533537 4.88017 0.597418C4.76739 0.6613 4.6731 0.753318 4.60647 0.8645L0.106475 8.3645C0.0265927 8.49796 -0.00982236 8.65294 0.00227109 8.80801C0.0143645 8.96307 0.0743679 9.11054 0.173974 9.23L11.415 22.7195C11.4974 22.8222 11.6054 22.9014 11.7281 22.9491C11.8509 22.9968 11.984 23.0113 12.1141 22.9912C12.2443 22.9712 12.3668 22.9172 12.4695 22.8347C12.5722 22.7523 12.6513 22.6442 12.699 22.5215L17.763 9.5H23.601L23.826 9.23C23.9256 9.11054 23.9856 8.96307 23.9977 8.80801C24.0098 8.65294 23.9734 8.49796 23.8935 8.3645L19.3935 0.8645C19.3269 0.753318 19.2326 0.6613 19.1198 0.597418C19.007 0.533537 18.8796 0.499973 18.75 0.5H5.24997ZM16.155 9.5L12 20.18L7.84648 9.5H16.155ZM2.07297 8L5.67298 2H8.64148L6.24147 8H2.07297ZM6.23548 9.5L9.63598 18.2435L2.35197 9.5H6.23548ZM7.85548 8L10.2555 2H13.74L16.14 8H7.85548ZM17.7555 8L15.3555 2H18.324L21.924 8H17.7555ZM20.2485 17C21.0441 17 21.8072 16.6839 22.3698 16.1213C22.9324 15.5587 23.2485 14.7956 23.2485 14C23.2485 13.2044 22.9324 12.4413 22.3698 11.8787C21.8072 11.3161 21.0441 11 20.2485 11C19.4528 11 18.6898 11.3161 18.1272 11.8787C17.5645 12.4413 17.2485 13.2044 17.2485 14C17.2485 14.7956 17.5645 15.5587 18.1272 16.1213C18.6898 16.6839 19.4528 17 20.2485 17ZM20.2485 24.5C23.9985 24.5 25.4985 22.6175 25.4985 20.75C25.4985 20.1533 25.2614 19.581 24.8395 19.159C24.4175 18.7371 23.8452 18.5 23.2485 18.5H17.2485C16.6517 18.5 16.0794 18.7371 15.6575 19.159C15.2355 19.581 14.9985 20.1533 14.9985 20.75C14.9985 22.625 16.4985 24.5 20.2485 24.5Z" fill="black"/>
                                    </svg>

                                    <h5> Premium User</h5>
                                    <input type="checkbox" name="allowShared" id="allowShared" />
                                </div>
                            </div>
                            <div className="ts-f-right">
                                <div className="mini-chart">
                                    <DailyPremiumChart />
                                    <p> Daily Rate Premium </p>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="dataglobal-content ">
                        <h1>
                            Users Data Request / Control
                        </h1>

                        <div className="act-data-1">
                            <AccReqControl/>
                        </div>
                    </div>

                </div>

                <div className="data-2 gap-5">
                    <div className="sdm">
                        <h1> Send User Message </h1>

                        <form className="sdm-comp" onSubmit={e => handleSendMessage(e, currentUser)}>
                            <div className="search-sdm flex items-center justify-center gap-3">
                                <div className="search-area relative flex items-center justify-center">
                                    <input 
                                        type="text" 
                                        placeholder="Search Email / Username" 
                                        value={searchTerm}
                                        onChange={e => {
                                            setSearchTerm(e.target.value);
                                            setSearchDDVisible(true);
                                        }}
                                        // Optional: if you want to close on blur, you can use onBlur
                                        onBlur={() => setSearchDDVisible(false)}
                                    />
                                    {searchDDVisible && searchTerm?.length > 0 && (
                                        <div className="dropdown-search absolute left-0">
                                            <div className="list-of-search">
                                                {finalFilteredAccounts.map((elem, idx) => (
                                                    <div className="acc-id" key={idx}>
                                                        <p 
                                                        onMouseDown={(e) => {
                                                            e.preventDefault(); // Prevents the input from blurring too soon
                                                            setSelectedUser(elem); // Save the entire user object
                                                            setSearchTerm(elem.email);
                                                            setSearchDDVisible(false);
                                                        }}
                                                        >
                                                        {elem.email}
                                                        </p>
                                                        <p 
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            setSelectedUser(elem);
                                                            setSearchTerm(elem.username);
                                                            setSearchDDVisible(false);
                                                        }}
                                                        >
                                                        {elem.username}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>

                                <div className="svg-icon">
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 9.5918C14 10.9179 13.4732 12.1896 12.5355 13.1273C11.5979 14.065 10.3261 14.5918 9 14.5918C7.67392 14.5918 6.40215 14.065 5.46447 13.1273C4.52678 12.1896 4 10.9179 4 9.5918C4 8.26571 4.52678 6.99394 5.46447 6.05626C6.40215 5.11858 7.67392 4.5918 9 4.5918C10.3261 4.5918 11.5979 5.11858 12.5355 6.05626C13.4732 6.99394 14 8.26571 14 9.5918Z" fill="black"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.3684e-08 9.59082C0.000155699 8.1532 0.344701 6.73653 1.00479 5.45941C1.66489 4.18228 2.62132 3.08187 3.79402 2.25029C4.96672 1.41871 6.32158 0.88015 7.74516 0.679707C9.16874 0.479264 10.6196 0.622765 11.9764 1.0982C13.3331 1.57363 14.5562 2.36716 15.5433 3.41236C16.5304 4.45755 17.2527 5.724 17.6498 7.10569C18.0469 8.48738 18.1073 9.9441 17.8258 11.3539C17.5443 12.7637 16.9292 14.0856 16.032 15.2088L19.707 18.8838C19.8892 19.0724 19.99 19.325 19.9877 19.5872C19.9854 19.8494 19.8802 20.1002 19.6948 20.2856C19.5094 20.4711 19.2586 20.5762 18.9964 20.5785C18.7342 20.5808 18.4816 20.48 18.293 20.2978L14.618 16.6228C13.2939 17.6808 11.6979 18.3434 10.0138 18.5343C8.32966 18.7252 6.62586 18.4367 5.0985 17.702C3.57113 16.9672 2.28228 15.8161 1.38029 14.3812C0.478308 12.9462 -0.000146577 11.2857 3.3684e-08 9.59082ZM9 2.59082C8.08075 2.59082 7.17049 2.77188 6.32122 3.12367C5.47194 3.47545 4.70026 3.99107 4.05025 4.64108C3.40024 5.29109 2.88463 6.06276 2.53284 6.91204C2.18106 7.76132 2 8.67157 2 9.59082C2 10.5101 2.18106 11.4203 2.53284 12.2696C2.88463 13.1189 3.40024 13.8906 4.05025 14.5406C4.70026 15.1906 5.47194 15.7062 6.32122 16.058C7.17049 16.4098 8.08075 16.5908 9 16.5908C10.8565 16.5908 12.637 15.8533 13.9497 14.5406C15.2625 13.2278 16 11.4473 16 9.59082C16 7.73431 15.2625 5.95383 13.9497 4.64108C12.637 3.32832 10.8565 2.59082 9 2.59082Z" fill="black"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="textarea-sdm">
                                <textarea 
                                    name="" 
                                    id=""
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder='Send Message...'
                                />
                                {/* Absolute error message displayed below the textarea */}
                                {error && (
                                    <div 
                                        className="error-message" 
                                        style={{
                                            position: 'absolute',
                                            bottom: '-25px',
                                            left: '0',
                                            right: '0',
                                            color: 'red',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div 
                                        className="success-message" 
                                        style={{
                                            position: 'absolute',
                                            bottom: '-25px',
                                            left: '0',
                                            right: '0',
                                            color: '#00c951',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {success}
                                    </div>
                                )}
                                <div className="emoticon">
                                    <div className="status-message flex items-center justify-center gap-2.5" onClick={handleStatusClick} >
                                        <div className={`circle ${status === 'red'
                                            ? 'bg-red-600'
                                            : status === 'orange'
                                            ? 'bg-orange-400'
                                            : status === 'green'
                                            ? 'bg-green-500'
                                            : 'bg-gray-400'} w-2.5 h-2.5 inline-block`}>    
                                        </div>
                                        <h5 className="inline-block ml-2">
                                            Status Message
                                        </h5>
                                        {dropdownVisible && (
                                            <div ref={dropdownRef} className="status-dropdown absolute bottom-full mb-2 left-0">
                                                <div 
                                                    className="dropdown-option flex items-center gap-2 cursor-pointer"
                                                    onClick={(e) => handleOptionClick('red',e)}>
                                                    <div className="circle bg-red-600 w-2.5 h-2.5"></div>
                                                    <span>Warning</span>
                                                </div>
                                                <div 
                                                    className="dropdown-option flex items-center gap-2 cursor-pointer"
                                                    onClick={(e) => handleOptionClick('orange',e)}>
                                                    <div className="circle bg-orange-400 w-2.5 h-2.5"></div>
                                                    <span> Question </span>
                                                </div>
                                                <div 
                                                    className="dropdown-option flex items-center gap-2 cursor-pointer"
                                                    onClick={(e) => handleOptionClick('green',e)}>
                                                    <div className="circle bg-green-500 w-2.5 h-2.5"></div>
                                                    <span> Good </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Emoji onEmojiSelect={(emoji) => setMessage(prev => prev + emoji)} />
                                </div>
                            </div>
                            <div className="send-sdm flex items-center justify-center">
                                <button className='submit-send flex items-center justify-center gap-1.5' type='submit'>  
                                    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.03906 7.5918C1.03906 8.80246 1.3574 9.8978 1.99406 10.8778C2.6314 11.8578 3.47006 12.5785 4.51006 13.0398C4.64073 13.1091 4.74406 13.2048 4.82006 13.3268C4.89673 13.4481 4.91073 13.5761 4.86206 13.7108C4.8134 13.8495 4.7184 13.9418 4.57706 13.9878C4.43573 14.0338 4.29973 14.0288 4.16906 13.9728C2.74106 13.3315 1.69573 12.4075 1.03306 11.2008C0.370396 9.99346 0.0390625 8.79046 0.0390625 7.5918C0.0390625 6.39713 0.367396 5.19713 1.02406 3.9918C1.68073 2.78646 2.7214 1.86313 4.14606 1.2218C4.27673 1.1658 4.4134 1.16013 4.55606 1.2048C4.69873 1.24946 4.79673 1.3408 4.85006 1.4788C4.90273 1.60946 4.89173 1.7358 4.81706 1.8578C4.74306 1.97913 4.64073 2.07446 4.51006 2.1438C3.47006 2.60513 2.6314 3.32613 1.99406 4.3068C1.35806 5.2868 1.03906 6.3818 1.03906 7.5918ZM13.0401 14.5918C11.0921 14.5918 9.4384 13.9118 8.07906 12.5518C6.71973 11.1918 6.0394 9.53846 6.03806 7.5918C6.03673 5.64513 6.71673 3.9918 8.07806 2.6318C9.4394 1.2718 11.0927 0.591797 13.0381 0.591797C13.8687 0.591797 14.6561 0.722464 15.4001 0.983797C16.1441 1.24513 16.8191 1.62346 17.4251 2.1188C17.5391 2.2088 17.6024 2.3198 17.6151 2.4518C17.6284 2.5838 17.5797 2.7048 17.4691 2.8148C17.3624 2.92146 17.2391 2.97346 17.0991 2.9708C16.9591 2.96813 16.8301 2.92213 16.7121 2.8328C16.1987 2.44013 15.6367 2.13513 15.0261 1.9178C14.4154 1.70046 13.7527 1.5918 13.0381 1.5918C11.3714 1.5918 9.95473 2.17513 8.78806 3.3418C7.6214 4.50846 7.03806 5.92513 7.03806 7.5918C7.03806 9.25846 7.6214 10.6751 8.78806 11.8418C9.95473 13.0085 11.3714 13.5918 13.0381 13.5918C13.7521 13.5918 14.4147 13.4831 15.0261 13.2658C15.6367 13.0485 16.1987 12.7438 16.7121 12.3518C16.8301 12.2618 16.9591 12.2155 17.0991 12.2128C17.2391 12.2101 17.3624 12.2621 17.4691 12.3688C17.5791 12.4788 17.6277 12.6001 17.6151 12.7328C17.6024 12.8655 17.5391 12.9761 17.4251 13.0648C16.8184 13.5601 16.1434 13.9385 15.4001 14.1998C14.6567 14.4611 13.8707 14.5918 13.0401 14.5918ZM20.0461 8.0918H12.6541C12.5121 8.0918 12.3931 8.04413 12.2971 7.9488C12.2017 7.85346 12.1541 7.73446 12.1541 7.5918C12.1541 7.44913 12.2017 7.33013 12.2971 7.2348C12.3924 7.13946 12.5114 7.0918 12.6541 7.0918H20.0461L18.3001 5.3458C18.2067 5.25246 18.1567 5.1378 18.1501 5.0018C18.1434 4.8658 18.1934 4.74446 18.3001 4.6378C18.4067 4.53113 18.5247 4.4778 18.6541 4.4778C18.7834 4.4778 18.9014 4.53113 19.0081 4.6378L21.3961 7.0258C21.5581 7.1878 21.6391 7.37646 21.6391 7.5918C21.6391 7.80713 21.5581 7.9958 21.3961 8.1578L19.0081 10.5458C18.9147 10.6391 18.8001 10.6891 18.6641 10.6958C18.5281 10.7025 18.4067 10.6525 18.3001 10.5458C18.1934 10.4391 18.1401 10.3211 18.1401 10.1918C18.1401 10.0625 18.1934 9.94446 18.3001 9.8378L20.0461 8.0918Z" fill="black"/>
                                    </svg>
                                    <p>
                                        Send
                                    </p>
                                </button>
                            </div>
                        </form>

                    </div>
                    <div className="utm">
                        <h1>
                            Premium Users / Modification
                        </h1>

                        <div className="utm-comp">
                            <div className="search-area relative flex items-center justify-center">
                                <input 
                                    type="text" 
                                    placeholder="Search Email / Username" 
                                    value={searchTask}
                                    onChange={e => {
                                        setSearchTask(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="lists-tsm">
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                            <th> Profile </th>
                                            <th> 
                                                <div className="ust relative">
                                                    <p>
                                                        Username
                                                    </p>
                                                    <div className="line bg-black absolute"></div>
                                                    <p>
                                                        Email 
                                                    </p>
                                                </div>
                                            </th>
                                            <th> Premium Rate </th>
                                            <th> Custom Color Tasks </th>
                                            <th> Limit Tasks </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accs.map(acc => {
                                            const accDate = acc.createdAt && acc.createdAt.toDate
                                                ? acc.createdAt.toDate()
                                                : new Date(acc.createdAt);
                                            return (
                                                <tr key={acc.id}>
                                                    <td>
                                                        <img src="" alt="Profile" />
                                                    </td>
                                                    <td>
                                                        {acc.username || '-'}
                                                        <br />
                                                        {useTruncateText(acc.email || '-', 35)}
                                                    </td>
                                                    <td>
                                                        Basic || X
                                                        <br/> 
                                                        Medium || X
                                                        <br/> 
                                                        Pro || X 
                                                    </td>
                                                    <td>
                                                        *coloreds
                                                    </td>
                                                    <td>
                                                        Limits Tasks
                                                    </td>
                                                </tr>
                                            );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
const Maintenance = () => {
    return (
        <div className='maintenance-comp'>
            <Sidebar/>
            <MaintenanceBoard/>
        </div>
    )
}

export default Maintenance
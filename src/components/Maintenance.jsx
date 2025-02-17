import React from 'react'
import '../scss/sidebar.scss'
import '../scss/maintenance.scss'
import MiniDonutChart from './dashboardactivity/MIniDonutChart'
import DailyPremiumChart from './dashboardactivity/DailyPremiumChart'
import AccReqControl from './dashboardactivity/AccRequestControls'
import { Sidebar } from './Sidebar'

const MaintenanceBoard = () => {
    return (
        <div className="mainboard">
            <div className="sdash-1">
                <h1 className='text-2xl'> Maintenance </h1>
                
                <div className="data-1 flex items-center justify-start gap-5 flex-wrap">
                    
                    <div className="overview-content w-96">
                        <h1> Shared Tasks & Premium Rate  </h1>

                        <div className="ts-f grid">
                            <div className="ts-f-left">
                                <h2>5123 Shared tasks </h2>
                                <div className="ts-f-dt flex items-center justify-evenly">
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
                                <div className="ts-f-dt flex items-center justify-evenly">
                                    <svg 
                                        width="26" 
                                        height="25" 
                                        viewBox="0 0 26 25" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M5.24997 0.5C5.12036 0.499973 4.99295 0.533537 4.88017 0.597418C4.76739 0.6613 4.6731 0.753318 4.60647 0.8645L0.106475 8.3645C0.0265927 8.49796 -0.00982236 8.65294 0.00227109 8.80801C0.0143645 8.96307 0.0743679 9.11054 0.173974 9.23L11.415 22.7195C11.4974 22.8222 11.6054 22.9014 11.7281 22.9491C11.8509 22.9968 11.984 23.0113 12.1141 22.9912C12.2443 22.9712 12.3668 22.9172 12.4695 22.8347C12.5722 22.7523 12.6513 22.6442 12.699 22.5215L17.763 9.5H23.601L23.826 9.23C23.9256 9.11054 23.9856 8.96307 23.9977 8.80801C24.0098 8.65294 23.9734 8.49796 23.8935 8.3645L19.3935 0.8645C19.3269 0.753318 19.2326 0.6613 19.1198 0.597418C19.007 0.533537 18.8796 0.499973 18.75 0.5H5.24997ZM16.155 9.5L12 20.18L7.84648 9.5H16.155ZM2.07297 8L5.67298 2H8.64148L6.24147 8H2.07297ZM6.23548 9.5L9.63598 18.2435L2.35197 9.5H6.23548ZM7.85548 8L10.2555 2H13.74L16.14 8H7.85548ZM17.7555 8L15.3555 2H18.324L21.924 8H17.7555ZM20.2485 17C21.0441 17 21.8072 16.6839 22.3698 16.1213C22.9324 15.5587 23.2485 14.7956 23.2485 14C23.2485 13.2044 22.9324 12.4413 22.3698 11.8787C21.8072 11.3161 21.0441 11 20.2485 11C19.4528 11 18.6898 11.3161 18.1272 11.8787C17.5645 12.4413 17.2485 13.2044 17.2485 14C17.2485 14.7956 17.5645 15.5587 18.1272 16.1213C18.6898 16.6839 19.4528 17 20.2485 17ZM20.2485 24.5C23.9985 24.5 25.4985 22.6175 25.4985 20.75C25.4985 20.1533 25.2614 19.581 24.8395 19.159C24.4175 18.7371 23.8452 18.5 23.2485 18.5H17.2485C16.6517 18.5 16.0794 18.7371 15.6575 19.159C15.2355 19.581 14.9985 20.1533 14.9985 20.75C14.9985 22.625 16.4985 24.5 20.2485 24.5Z" fill="black"/>
                                    </svg>

                                    <h5> Premium Active </h5>
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
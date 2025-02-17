import React, { useState } from 'react';
import '../../scss/calendarwidget.scss'; // import the SCSS (or add these styles to your main SCSS)

const CalendarWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Get the first day of the month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    // Number of days in the current month
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // Create an array for the calendar grid
    const calendarDays = [];

    // Fill in empty cells until the first day
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    // Then fill in the actual days
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Check if the day is today
    const isToday = (day) => {
        const today = new Date();
        return (
        day &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear() &&
        day === today.getDate()
        );
    };

    return (
        <div className="calendar-widget">
            <div className="calendar-header">
                <button onClick={goToPreviousMonth} className="nav-btn">&lt;</button>
                <span className="month-label">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={goToNextMonth} className="nav-btn">&gt;</button>
            </div>
            <div className="calendar-grid">
                {/* Weekday Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd) => (
                <div key={wd} className="calendar-grid-header">
                    {wd}
                </div>
                ))}
                {/* Calendar Cells */}
                {calendarDays.map((day, index) => (
                <div
                    key={index}
                    className={`calendar-cell ${isToday(day) ? "today" : ""}`}
                >
                    {day ? day : ""}
                </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarWidget;

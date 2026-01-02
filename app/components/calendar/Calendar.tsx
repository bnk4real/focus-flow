// app/components/calendar/Calendar.tsx
'use client';

import { useState } from 'react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Calendar() {
    const [date, setDate] = useState<Date>(new Date());

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700" suppressHydrationWarning>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Calendar</h2>
            <ReactCalendar
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onChange={(value, _event) => {
                    const val = value as Date | [Date, Date] | null;
                    if (val instanceof Date) {
                        setDate(val);
                        // For future event integration, handle click here
                        console.log('Selected date:', val);
                    }
                }}
                value={date}
                className="react-calendar"
            />
        </div>
    );
}
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useTimerContext } from '../../contexts/TimerContext';

export default function Time() {
    const [currentTime, setCurrentTime] = useState<string>(() => 
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    const [location, setLocation] = useState<string>('');
    const { timerState } = useTimerContext();

    useEffect(() => {
        const updateTime = () => {
            const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setCurrentTime(timeString);
            document.title = `Focus Flow - ${timeString}`;
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        // Get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
                    const country = data.address?.country || '';
                    setLocation(`${city}, ${country}`);
                } catch (error) {
                    setLocation('Location unavailable');
                }
            }, () => {
                setLocation('Location access denied');
            });
        } else {
            setLocation('Geolocation not supported');
        }

        return () => clearInterval(interval);
    }, []);

    // Calculate end time
    const getEndTime = () => {
        if (timerState.isRunning && timerState.endTime) {
            return timerState.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return '--';
    };

    return (
        <div className="inline-flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Current Time */}
            <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Current Time</h3>
                <p className="text-xl md:text-2xl font-mono font-bold text-gray-900 dark:text-white">
                    {currentTime}
                </p>
                {location && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {location}
                    </p>
                )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-600"></div>

            {/* End Time */}
            <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Session Ends</h3>
                <p className="text-xl md:text-2xl font-mono font-bold text-gray-900 dark:text-white">
                    {getEndTime()}
                </p>
            </div>
        </div>
    );
}
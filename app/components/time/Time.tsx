/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';

export default function Time() {
    const [currentTime, setCurrentTime] = useState<string>('');
    const [location, setLocation] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString());
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

    return (
        <div className="text-center mb-8" suppressHydrationWarning>
            <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Current Time</h2>
                <p className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-200">
                    {currentTime}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Location: {location}
                </p>
            </div>
        </div>
    );
}
// app/components/timer/useTimer.ts
import { useState, useEffect, useRef, useCallback } from 'react';

type Mode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

const defaultDurations: Record<Mode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    custom: 25 * 60,
};

export function useTimer(onComplete?: () => void) {
    const [mode, setMode] = useState<Mode>('focus');
    const [timeLeft, setTimeLeft] = useState(defaultDurations.focus);
    const [isRunning, setIsRunning] = useState(false);
    const [customDuration, setCustomDuration] = useState(25 * 60);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const tick = useCallback(() => {
        setTimeLeft((prevTime) => {
            const newTime = prevTime - 1;
            if (newTime <= 0) {
                setIsRunning(false);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                if (onComplete) {
                    onComplete();
                }
                return 0;
            }
            return newTime;
        });
    }, [onComplete]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const start = () => {
        if (!isRunning && timeLeft > 0) {
            setIsRunning(true);
            intervalRef.current = setInterval(tick, 1000);
        }
    };

    const pause = () => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const reset = () => {
        pause();
        const duration = mode === 'custom' ? customDuration : defaultDurations[mode];
        setTimeLeft(duration);
    };

    const switchMode = (newMode: Mode) => {
        pause();
        setMode(newMode);
        const duration = newMode === 'custom' ? customDuration : defaultDurations[newMode];
        setTimeLeft(duration);
    };

    const setCustomTime = (minutes: number) => {
        const seconds = minutes * 60;
        setCustomDuration(seconds);
        if (mode === 'custom') {
            setTimeLeft(seconds);
        }
    };

    return { timeLeft, isRunning, mode, start, pause, reset, switchMode, setCustomTime, customDuration };
}
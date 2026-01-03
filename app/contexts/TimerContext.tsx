// app/contexts/TimerContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

interface TimerState {
    timeLeft: number;
    isRunning: boolean;
    mode: TimerMode;
    startTime: Date | null;
    endTime: Date | null;
}

interface TimerContextType {
    timerState: TimerState;
    updateTimerState: (state: Partial<TimerState>) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
    const [timerState, setTimerState] = useState<TimerState>({
        timeLeft: 25 * 60,
        isRunning: false,
        mode: 'focus',
        startTime: null,
        endTime: null,
    });

    const updateTimerState = useCallback((newState: Partial<TimerState>) => {
        setTimerState(prev => {
            const updated = { ...prev, ...newState };

            // Calculate end time only when timer starts (isRunning changes from false to true)
            if (newState.isRunning === true && prev.isRunning === false && newState.timeLeft) {
                updated.startTime = new Date();
                updated.endTime = new Date(Date.now() + newState.timeLeft * 1000);
            } else if (newState.isRunning === false) {
                updated.startTime = null;
                updated.endTime = null;
            }

            return updated;
        });
    }, []);

    return (
        <TimerContext.Provider value={{ timerState, updateTimerState }}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimerContext() {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimerContext must be used within a TimerProvider');
    }
    return context;
}
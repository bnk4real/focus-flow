'use client';

import { useState, useEffect } from 'react';
import { useTimer } from './useTimer';
import { motion } from 'framer-motion';
import MusicPlayer from '../music/MusicPlayer';

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getTotalTime = (mode: string, customDuration = 25 * 60) => {
    switch (mode) {
        case 'focus': return 25 * 60;
        case 'shortBreak': return 5 * 60;
        case 'longBreak': return 15 * 60;
        case 'custom': return customDuration;
        default: return 25 * 60;
    }
};

type AnimationStyle = 'circle' | 'coffee' | 'progressbar' | 'water';

export default function Timer() {
    const [showMusicPrompt, setShowMusicPrompt] = useState(false);
    const [showMusicPlayer, setShowMusicPlayer] = useState(false);
    const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
    const [customMinutes, setCustomMinutes] = useState<number>(25);
    const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('circle');

    const { timeLeft, isRunning, mode, start, pause, reset, switchMode, setCustomTime, customDuration } = useTimer(() => {
        // onComplete callback from the hook
        setShowTimeUpDialog(true);
    });

    const totalTime = getTotalTime(mode, customDuration);
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    const playNotificationSound = () => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        try {
            const AudioContextClass = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
            const audioContext = new AudioContextClass();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Could not play notification sound:', error);
        }
    };

    useEffect(() => {
        if (showTimeUpDialog) {
            playNotificationSound();
        }
    }, [showTimeUpDialog]);

    const handleDismissNotification = () => {
        setShowTimeUpDialog(false);
    };

    const handleRestart = () => {
        handleDismissNotification();
        reset();
        start();
    };

    const handleStartBreak = () => {
        handleDismissNotification();
        switchMode('shortBreak');
        start();
    };

    const applyCustomMinutes = () => {
        if (customMinutes > 0) {
            setCustomTime(customMinutes);
            switchMode('custom');
        }
    };

    const handleStartWithMusic = () => {
        setShowMusicPrompt(false);
        setShowMusicPlayer(true);
        start();
    };

    const handleStartWithoutMusic = () => {
        setShowMusicPrompt(false);
        start();
    };

    const handleStartClick = () => {
        if (!isRunning) {
            setShowMusicPrompt(true);
        } else {
            pause();
        }
    };

    const closeMusicPlayer = () => {
        setShowMusicPlayer(false);
    };

    const handleReset = () => {
        reset();
        setShowMusicPlayer(false); // Close music player when resetting
    };

    // Animation Components
    const CircleAnimation = () => (
        <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                    className="dark:stroke-gray-600"
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    className="dark:stroke-blue-400"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 45}` }}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}` }}
                    transition={{ duration: 0.5 }}
                    suppressHydrationWarning
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-mono text-gray-900 dark:text-white" suppressHydrationWarning>{formatTime(timeLeft)}</span>
            </div>
        </div>
    );

    const CoffeeAnimation = () => (
        <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
                {/* Coffee cup outline */}
                <path
                    d="M40 80 Q40 100 60 100 Q80 100 80 80 L80 40 Q80 30 70 30 L50 30 Q40 30 40 40 Z"
                    fill="none"
                    stroke="#8B4513"
                    strokeWidth="3"
                />
                {/* Coffee cup handle */}
                <path
                    d="M80 50 Q90 50 90 60 Q90 70 80 70"
                    fill="none"
                    stroke="#8B4513"
                    strokeWidth="3"
                />
                {/* Coffee fill */}
                <motion.rect
                    x="42"
                    y={80 - (progress / 100) * 40}
                    width="36"
                    height={(progress / 100) * 40}
                    fill="#8B4513"
                    initial={{ height: 0, y: 80 }}
                    animate={{ height: (progress / 100) * 40, y: 80 - (progress / 100) * 40 }}
                    transition={{ duration: 0.5 }}
                />
                {/* Steam */}
                <motion.path
                    d="M55 25 Q55 20 57 22 Q59 18 61 20 Q63 16 65 18"
                    stroke="#CCCCCC"
                    strokeWidth="2"
                    fill="none"
                    opacity={isRunning ? 0.7 : 0.3}
                    animate={isRunning ? {
                        d: [
                            "M55 25 Q55 20 57 22 Q59 18 61 20 Q63 16 65 18",
                            "M55 22 Q55 17 57 19 Q59 15 61 17 Q63 13 65 15",
                            "M55 25 Q55 20 57 22 Q59 18 61 20 Q63 16 65 18"
                        ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </svg>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <span className="text-2xl font-mono text-gray-900 dark:text-white" suppressHydrationWarning>{formatTime(timeLeft)}</span>
            </div>
        </div>
    );

    const ProgressBarAnimation = () => (
        <div className="relative w-64 h-12 mb-4 flex items-center justify-center">
            <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                    initial={{ width: '100%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: 'right' }}
                />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-mono text-gray-900 dark:text-white font-bold" suppressHydrationWarning>{formatTime(timeLeft)}</span>
            </div>
        </div>
    );

    const WaterAnimation = () => (
        <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
            <svg width="100" height="120" viewBox="0 0 100 120" className="drop-shadow-lg">
                {/* Water glass outline */}
                <path
                    d="M25 20 L25 100 Q25 110 35 110 L65 110 Q75 110 75 100 L75 20 Z"
                    fill="none"
                    stroke="#E0F2FE"
                    strokeWidth="3"
                />
                {/* Water fill */}
                <motion.path
                    d={`M27 ${100 - (progress / 100) * 80} Q27 ${110 - (progress / 100) * 10} 35 ${110 - (progress / 100) * 10} L65 ${110 - (progress / 100) * 10} Q73 ${110 - (progress / 100) * 10} 73 ${100 - (progress / 100) * 80} Z`}
                    fill="#3B82F6"
                    opacity="0.8"
                    initial={{ d: "M27 100 Q27 110 35 110 L65 110 Q73 110 73 100 Z" }}
                    animate={{
                        d: `M27 ${100 - (progress / 100) * 80} Q27 ${110 - (progress / 100) * 10} 35 ${110 - (progress / 100) * 10} L65 ${110 - (progress / 100) * 10} Q73 ${110 - (progress / 100) * 10} 73 ${100 - (progress / 100) * 80} Z`
                    }}
                    transition={{ duration: 0.5 }}
                />
                {/* Water surface reflection */}
                <motion.path
                    d={`M35 ${110 - (progress / 100) * 10} Q45 ${108 - (progress / 100) * 10} 55 ${110 - (progress / 100) * 10} Q65 ${112 - (progress / 100) * 10} 65 ${110 - (progress / 100) * 10}`}
                    stroke="#60A5FA"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: progress > 10 ? 0.6 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </svg>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <span className="text-2xl font-mono text-gray-900 dark:text-white" suppressHydrationWarning>{formatTime(timeLeft)}</span>
            </div>
        </div>
    );

    const renderAnimation = () => {
        switch (animationStyle) {
            case 'coffee':
                return <CoffeeAnimation />;
            case 'progressbar':
                return <ProgressBarAnimation />;
            case 'water':
                return <WaterAnimation />;
            default:
                return <CircleAnimation />;
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700" suppressHydrationWarning>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Pomodoro Timer</h2>

            {/* Animation Style Selector */}
            <div className="flex gap-1 mb-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <button
                    onClick={() => setAnimationStyle('circle')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                        animationStyle === 'circle'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    ●
                </button>
                <button
                    onClick={() => setAnimationStyle('coffee')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                        animationStyle === 'coffee'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    ☕
                </button>
                <button
                    onClick={() => setAnimationStyle('progressbar')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                        animationStyle === 'progressbar'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    ▬
                </button>
                <button
                    onClick={() => setAnimationStyle('water')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                        animationStyle === 'water'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    🥤
                </button>
            </div>

            {renderAnimation()}
            
            {/* Timer Controls */}
            <div className="flex gap-2 mb-4 justify-center">
                <button
                    onClick={handleStartClick}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                >
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                    Reset
                </button>
            </div>

            {/* Mode Selection */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
                <button
                    onClick={() => switchMode('focus')}
                    className={`px-4 py-2 rounded transition-colors ${mode === 'focus'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    Focus
                </button>
                <button
                    onClick={() => switchMode('shortBreak')}
                    className={`px-4 py-2 rounded transition-colors ${mode === 'shortBreak'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    Short Break
                </button>
                <button
                    onClick={() => switchMode('longBreak')}
                    className={`px-4 py-2 rounded transition-colors ${mode === 'longBreak'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    Long Break
                </button>
            </div>

            {/* Custom Duration Input */}
            <div className="flex items-center gap-2 mb-4 justify-center">
                <input
                    type="number"
                    min={1}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                    className="w-20 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
                    aria-label="Custom minutes"
                />
                <button
                    onClick={applyCustomMinutes}
                    className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600 text-white text-sm"
                >
                    Set Custom
                </button>
            </div>

            {/* Music Player Toggle */}
            <div className="mb-4">
                <button
                    onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
                >
                    {showMusicPlayer ? 'Hide Music' : 'Show Music'}
                </button>
            </div>

            {/* Time-up Dialog */}
            {showTimeUpDialog && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleDismissNotification}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Time&apos;s up!</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">Your timer has finished.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRestart}
                                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                            >
                                Restart
                            </button>
                            <button
                                onClick={handleStartBreak}
                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                            >
                                Start Short Break
                            </button>
                            <button
                                onClick={handleDismissNotification}
                                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Music Prompt Modal */}
            {showMusicPrompt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
                    onClick={() => setShowMusicPrompt(false)}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Focus Music
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Would you like to play focus music during your timer session?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleStartWithMusic}
                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                            >
                                Yes, play music
                            </button>
                            <button
                                onClick={handleStartWithoutMusic}
                                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                            >
                                No, just timer
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Music Player */}
            <MusicPlayer isVisible={showMusicPlayer} onClose={closeMusicPlayer} />
        </div>
    );
}
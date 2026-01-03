// app/components/music/MusicPlayer.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// YouTube API types
declare global {
    interface Window {
        YT: {
            Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
            PlayerState: {
                PLAYING: number;
                PAUSED: number;
                ENDED: number;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}

interface YTPlayer {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    setVolume(volume: number): void;
    loadVideoById(videoId: string): void;
    destroy(): void;
}

interface YTPlayerOptions {
    height: string;
    width: string;
    videoId: string;
    playerVars: {
        autoplay: number;
        controls: number;
        disablekb: number;
        fs: number;
        iv_load_policy: number;
        modestbranding: number;
        playsinline: number;
        rel: number;
        showinfo: number;
    };
    events: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
    };
}

interface MusicPlayerProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function MusicPlayer({ isVisible, onClose }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const playerRef = useRef<YTPlayer | null>(null);

    // Focus music tracks from YouTube (royalty-free/creative commons)
    const tracks = useMemo(() => [
        { id: 'jgpJVI3tDbY', title: 'Deep Focus Music' },
        { id: '4xDzrJKXOOY', title: 'Ambient Study Music' },
        { id: 'lTRiuFIWV54', title: 'Peaceful Piano' },
        { id: 'DWcJFNfaw9c', title: 'Focus Flow' },
        { id: '21qNxnCS8WU', title: 'Concentration Music' }
    ], []);

    // Load YouTube API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Initialize player when API is ready
        const initPlayer = () => {
            if (window.YT && window.YT.Player && isVisible) {
                playerRef.current = new window.YT.Player('youtube-player', {
                    height: '0',
                    width: '0',
                    videoId: tracks[currentTrack].id,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
                        modestbranding: 1,
                        playsinline: 1,
                        rel: 0,
                        showinfo: 0
                    },
                    events: {
                        onReady: (event: { target: YTPlayer }) => {
                            event.target.setVolume(volume);
                        },
                        onStateChange: (event: { data: number; target: YTPlayer }) => {
                            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                        }
                    }
                });
            }
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [isVisible, currentTrack, tracks, volume]);

    // Update volume when it changes
    useEffect(() => {
        if (playerRef.current && playerRef.current.setVolume) {
            playerRef.current.setVolume(volume);
        }
    }, [volume]);

    const togglePlay = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
        }
    };

    const stopMusic = () => {
        if (playerRef.current) {
            playerRef.current.stopVideo();
            setIsPlaying(false);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        if (playerRef.current && playerRef.current.setVolume) {
            playerRef.current.setVolume(newVolume);
        }
    };

    const nextTrack = () => {
        const nextIndex = (currentTrack + 1) % tracks.length;
        setCurrentTrack(nextIndex);
        if (playerRef.current && playerRef.current.loadVideoById) {
            playerRef.current.loadVideoById(tracks[nextIndex].id);
        }
    };

    const prevTrack = () => {
        const prevIndex = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
        setCurrentTrack(prevIndex);
        if (playerRef.current && playerRef.current.loadVideoById) {
            playerRef.current.loadVideoById(tracks[prevIndex].id);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* YouTube Player (hidden) */}
                    <div id="youtube-player" style={{ display: 'none' }}></div>

                    {/* Full Modal View */}
                    {!isMinimized && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            onClick={onClose}
                        >
                            <motion.div
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
                                onClick={(e) => e.stopPropagation()}
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Focus Music
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={toggleMinimize}
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                                            title="Minimize to background"
                                        >
                                            □
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Track Info */}
                                    <div className="text-center">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            {tracks[currentTrack].title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Track {currentTrack + 1} of {tracks.length}
                                        </p>
                                    </div>

                                    {/* Track Navigation */}
                                    <div className="flex items-center justify-center space-x-4">
                                        <button
                                            onClick={prevTrack}
                                            className="w-10 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                                            title="Previous Track"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={togglePlay}
                                            className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            {isPlaying ? (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"/>
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={stopMusic}
                                            className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 6h12v12H6z"/>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextTrack}
                                            className="w-10 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                                            title="Next Track"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Volume: {volume}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                    </div>

                                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                        {isPlaying ? 'Playing focus music...' : 'Music paused'}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Minimized Floating Bar */}
                    {isMinimized && (
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-40"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={prevTrack}
                                        className="w-8 h-8 bg-gray-500 hover:bg-gray-600 text-white rounded flex items-center justify-center transition-colors text-sm"
                                        title="Previous Track"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={togglePlay}
                                        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center transition-colors text-sm"
                                        title={isPlaying ? 'Pause' : 'Play'}
                                    >
                                        {isPlaying ? (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"/>
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={stopMusic}
                                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors text-sm"
                                        title="Stop"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 6h12v12H6z"/>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextTrack}
                                        className="w-8 h-8 bg-gray-500 hover:bg-gray-600 text-white rounded flex items-center justify-center transition-colors text-sm"
                                        title="Next Track"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 min-w-0">
                                    <div className="font-medium">{tracks[currentTrack].title}</div>
                                    <div className="flex items-center gap-1">
                                        {isPlaying ? (
                                            <>
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                                Playing
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 4h4v16H6V4zM14 4h4v16h-4V4z"/>
                                                </svg>
                                                Paused
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={toggleMinimize}
                                    className="w-8 h-8 bg-gray-500 hover:bg-gray-600 text-white rounded flex items-center justify-center transition-colors text-sm"
                                    title="Maximize"
                                >
                                    ⬆️
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 bg-gray-500 hover:bg-gray-600 text-white rounded flex items-center justify-center transition-colors text-sm"
                                    title="Close"
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
}
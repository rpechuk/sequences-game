import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyStats, GameStatus } from '../lib/types';
import type { SequenceData } from '../lib/generator';
import { getDailySequence } from '../lib/generator';
import { GAME_CONFIG } from '../lib/constants';

interface PuzzleHistory {
    guesses: number[];
    hintsLevel: number;
    status: GameStatus;
}

interface StoreState {
    // Persistent Data
    stats: DailyStats;
    gameStatus: GameStatus;
    guesses: number[];
    hintsLevel: number;
    lastPlayedDate: string | null;
    dailySequence: SequenceData | null;
    completedDates: Record<string, 'won' | 'lost'>; // Track which dates have been completed/failed
    currentPlayingDate: string | null; // Track which date is currently being played
    puzzleHistory: Record<string, PuzzleHistory>; // Store guesses and state for each completed puzzle

    // Actions
    initGame: (date: string) => void;
    loadPuzzleByDate: (date: string) => void;
    submitGuess: (guess: number) => void;
    resetStats: () => void;

    // Settings
    isDarkMode: boolean;
    isHighContrastMode: boolean;
    toggleDarkMode: () => void;
    toggleHighContrastMode: () => void;
}

const initialStats: DailyStats = {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0 },
};

export const useGameStore = create<StoreState>()(
    persist(
        (set, get) => ({
            stats: initialStats,
            gameStatus: 'playing',
            guesses: [],
            hintsLevel: 0,
            lastPlayedDate: null,
            dailySequence: null,
            completedDates: {},
            currentPlayingDate: null,
            puzzleHistory: {},
            isDarkMode: false,
            isHighContrastMode: false,

            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
            toggleHighContrastMode: () => set((state) => ({ isHighContrastMode: !state.isHighContrastMode })),

            initGame: (date) => {
                const { lastPlayedDate, puzzleHistory } = get();
                const [y, m, d] = date.split('-').map(Number);
                const sequence = getDailySequence(new Date(y, m - 1, d));

                // Check if this puzzle has been completed before
                const history = puzzleHistory[date];
                if (history) {
                    // Load completed puzzle in read-only mode
                    set({
                        lastPlayedDate: date,
                        currentPlayingDate: date,
                        gameStatus: history.status,
                        guesses: history.guesses,
                        hintsLevel: history.hintsLevel,
                        dailySequence: sequence,
                    });
                } else if (lastPlayedDate !== date) {
                    // Fresh puzzle
                    set({
                        lastPlayedDate: date,
                        currentPlayingDate: date,
                        gameStatus: 'playing',
                        guesses: [],
                        hintsLevel: 0,
                        dailySequence: sequence,
                    });
                } else {
                    // Same date, just update sequence
                    set({ dailySequence: sequence, currentPlayingDate: date });
                }
            },

            loadPuzzleByDate: (date) => {
                const { puzzleHistory } = get();
                const [y, m, d] = date.split('-').map(Number);
                const sequence = getDailySequence(new Date(y, m - 1, d));

                // Check if this puzzle has been completed before
                const history = puzzleHistory[date];
                if (history) {
                    // Load completed puzzle in read-only mode
                    set({
                        currentPlayingDate: date,
                        gameStatus: history.status,
                        guesses: history.guesses,
                        hintsLevel: history.hintsLevel,
                        dailySequence: sequence,
                    });
                } else {
                    // Fresh puzzle
                    set({
                        currentPlayingDate: date,
                        gameStatus: 'playing',
                        guesses: [],
                        hintsLevel: 0,
                        dailySequence: sequence,
                    });
                }
            },

            submitGuess: (guess) => {
                const { stats, guesses, dailySequence, gameStatus, hintsLevel } = get();
                if (gameStatus !== 'playing' || !dailySequence) return;

                const targetIndex = GAME_CONFIG.INITIAL_VISIBLE_COUNT + hintsLevel;
                if (targetIndex >= dailySequence.numbers.length) return;

                const target = dailySequence.numbers[targetIndex];
                const isCorrect = guess === target;
                const newGuesses = [...guesses, guess];

                if (isCorrect) {
                    const attempts = hintsLevel + 1;
                    const newStats = { ...stats };
                    newStats.played += 1;
                    newStats.won += 1;
                    newStats.currentStreak += 1;
                    newStats.maxStreak = Math.max(newStats.currentStreak, newStats.maxStreak);
                    newStats.guessDistribution[attempts] = (newStats.guessDistribution[attempts] || 0) + 1;

                    const { currentPlayingDate, completedDates, puzzleHistory } = get();
                    const newCompletedDates = { ...completedDates };
                    const newPuzzleHistory = { ...puzzleHistory };
                    if (currentPlayingDate) {
                        newCompletedDates[currentPlayingDate] = 'won';
                        newPuzzleHistory[currentPlayingDate] = {
                            guesses: newGuesses,
                            hintsLevel,
                            status: 'won',
                        };
                    }

                    set({
                        gameStatus: 'won',
                        guesses: newGuesses,
                        stats: newStats,
                        completedDates: newCompletedDates,
                        puzzleHistory: newPuzzleHistory,
                    });
                } else {
                    const nextHintsLevel = hintsLevel + 1;
                    if (nextHintsLevel >= GAME_CONFIG.MAX_HINTS) {
                        const newStats = { ...stats };
                        newStats.played += 1;
                        newStats.currentStreak = 0;

                        const { currentPlayingDate, completedDates, puzzleHistory } = get();
                        const newCompletedDates = { ...completedDates };
                        const newPuzzleHistory = { ...puzzleHistory };
                        if (currentPlayingDate) {
                            newCompletedDates[currentPlayingDate] = 'lost';
                            newPuzzleHistory[currentPlayingDate] = {
                                guesses: newGuesses,
                                hintsLevel: nextHintsLevel,
                                status: 'lost',
                            };
                        }

                        set({
                            gameStatus: 'lost',
                            guesses: newGuesses,
                            stats: newStats,
                            hintsLevel: nextHintsLevel,
                            completedDates: newCompletedDates,
                            puzzleHistory: newPuzzleHistory,
                        });
                    } else {
                        set({
                            guesses: newGuesses,
                            hintsLevel: nextHintsLevel,
                        });
                    }
                }
            },

            resetStats: () => set({ stats: initialStats }),
        }),
        {
            name: 'number-game-storage',
        }
    )
);

export type GameStatus = 'playing' | 'won' | 'lost';

export interface DailyStats {
    played: number;
    won: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: Record<number, number>; // 1-4 (4 is max attempts usually)
}

export interface GameState {
    status: GameStatus;
    guesses: number[]; // The wrong guesses user has made
    hintsLevel: number; // 0 = no hint, 1 = 1 number revealed, etc.
    lastPlayedDate: string; // YYYY-MM-DD
}

export interface PersistedState {
    stats: DailyStats;
    history: Record<string, GameState>; // Date -> State
    settings: {
        darkMode: boolean;
        highContrast: boolean;
    };
}

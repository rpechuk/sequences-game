export const GAME_CONFIG = {
    SEQUENCE_LENGTH: 9,
    HIDDEN_COUNT: 3, // The last row (3 items) is hidden initially
    MAX_HINTS: 3, // 3 guesses corresponding to the 3 hidden items
    INITIAL_VISIBLE_COUNT: 6, // First 2 rows are visible
    TOTAL_LENGTH: 9,
};

export const PATTERN_NAMES = {
    ARITHMETIC: 'Arithmetic',
    GEOMETRIC: 'Geometric',
    FIBONACCI: 'Fibonacci',
    SQUARE: 'Square',
    CUBE: 'Cube',
    PRIME: 'Prime',
    ALTERNATING: 'Alternating',
    SUM_PREVIOUS: 'Sum of Previous',
    INTERLEAVED: 'Interleaved',
};

export const WIN_MESSAGES = [
    "Splendid!",
    "Magnificent!",
    "Outstanding!",
    "Brilliant!",
    "Excellent!",
    "Great job!",
    "Well done!",
    "Fantastic!",
    "Amazing!",
    "Superb!"
];

export const LOSS_MESSAGES = [
    "Nice try!",
    "So close!",
    "Good effort!",
    "Better luck next time!",
    "Keep going!",
    "Don't give up!",
    "Almost had it!",
    "Honorable attempt!",
    "Great effort!",
    "You'll get it!"
];

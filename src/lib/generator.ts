import { GAME_CONFIG, PATTERN_NAMES } from './constants';


export interface SequenceData {
    numbers: number[];
    visibleCount: number;
    patternName: string;
    explanation: string;
}

class SeeededRNG {
    private seed: number;

    constructor(seed: number) {
        let t = seed + 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        this.seed = ((t ^ (t >>> 14)) >>> 0);
    }

    next(): number {
        this.seed += 0x6D2B79F5;
        let t = this.seed;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    range(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    pick<T>(array: T[]): T {
        return array[this.range(0, array.length - 1)];
    }
}

const isValidSequence = (numbers: number[]): boolean => {
    // 1. Max Size Barrier
    if (numbers.some(n => Math.abs(n) > 10000)) return false;

    // 2. Integer Barrier
    if (numbers.some(n => !Number.isInteger(n))) return false;

    // 3. Triviality Barrier
    const unique = new Set(numbers);
    if (unique.size < 2) return false;

    return true;
};

// --- Generators ---

const generateArithmetic = (rng: SeeededRNG, length: number): number[] => {
    const start = rng.range(1, 20);
    const diff = rng.range(2, 12);
    return Array.from({ length }, (_, i) => start + (i * diff));
};

const generateGeometric = (rng: SeeededRNG, length: number): number[] => {
    const start = rng.range(1, 5);
    const ratio = rng.range(2, 4);
    return Array.from({ length }, (_, i) => start * Math.pow(ratio, i));
};

const generateFibonacci = (rng: SeeededRNG, length: number): number[] => {
    const start1 = rng.range(0, 5);
    const start2 = rng.range(1, 5);
    const seq = [start1, start2];
    for (let i = 2; i < length; i++) {
        seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq;
};

const generateSquares = (rng: SeeededRNG, length: number): number[] => {
    const start = rng.range(1, 10);
    return Array.from({ length }, (_, i) => Math.pow(start + i, 2));
};

const generatePrimes = (rng: SeeededRNG, length: number): number[] => {
    const primes = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
        73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151
    ];
    const startIdx = rng.range(0, Math.max(0, primes.length - length));
    return primes.slice(startIdx, startIdx + length);
};

const generateAlternating = (rng: SeeededRNG, length: number): number[] => {
    const start = rng.range(1, 20);
    const op1 = rng.range(2, 5); // Add
    const op2 = rng.range(1, 3); // Subtract

    const seq = [start];
    let current = start;

    for (let i = 1; i < length; i++) {
        if (i % 2 === 1) {
            current += op1;
        } else {
            current -= op2;
        }
        seq.push(current);
    }

    return seq;
};

const generateSumPrevious = (rng: SeeededRNG, length: number): number[] => {
    // Sorted seeds for clarity
    const seeds = [rng.range(1, 3), rng.range(1, 3), rng.range(1, 3)]
        .sort((a, b) => a - b);

    // If they are all 1,1,1 -> 3. Standard.
    // If 1,2,3 -> 6. Standard.
    // Ensure not 0,0,0

    const seq = [...seeds];
    for (let i = 3; i < length; i++) {
        const next = seq[i - 1] + seq[i - 2] + seq[i - 3];
        seq.push(next);
    }
    return seq;
};

const generateInterleaved = (rng: SeeededRNG, length: number): number[] => {
    // Two simple sequences mixed
    // A: 1, 2, 3...
    // B: 10, 20, 30...
    // Result: 1, 10, 2, 20, 3, 30...

    const lenA = Math.ceil(length / 2);
    const lenB = Math.floor(length / 2);

    // Use simpler generators for sub-sequences to keep it solvable
    // Seq A: Arithmetic (mostly)
    const startA = rng.range(1, 10);
    const diffA = rng.range(1, 5);
    const seqA = Array.from({ length: lenA }, (_, i) => startA + (i * diffA));

    // Seq B: Arithmetic or Geometric
    const startB = rng.range(10, 20); // distinct start range
    const diffB = rng.range(2, 5);
    const seqB = Array.from({ length: lenB }, (_, i) => startB + (i * diffB));

    const interleaved: number[] = [];
    for (let i = 0; i < lenA; i++) {
        interleaved.push(seqA[i]);
        if (i < seqB.length) interleaved.push(seqB[i]);
    }
    return interleaved;
};


const PATTERN_GENERATORS = [
    { name: PATTERN_NAMES.ARITHMETIC, gen: generateArithmetic, expl: "Adds a constant number each missing step." },
    { name: PATTERN_NAMES.GEOMETRIC, gen: generateGeometric, expl: "Multiplies by a constant number each step." },
    { name: PATTERN_NAMES.FIBONACCI, gen: generateFibonacci, expl: "Each number is the sum of the two preceding ones." },
    { name: PATTERN_NAMES.SQUARE, gen: generateSquares, expl: "Consecutive square numbers." },
    { name: PATTERN_NAMES.PRIME, gen: generatePrimes, expl: "Consecutive prime numbers." },
    { name: PATTERN_NAMES.ALTERNATING, gen: generateAlternating, expl: "Alternates between adding two different values." },
    { name: PATTERN_NAMES.SUM_PREVIOUS, gen: generateSumPrevious, expl: "Each number is the sum of the previous 3 numbers." },
    { name: PATTERN_NAMES.INTERLEAVED, gen: generateInterleaved, expl: "Two different arithmetic sequences interleaved." },
];

export const getDailySequence = (dateObj: Date): SequenceData => {
    // Seed Generation
    const seed = parseInt(
        `${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, '0')}${String(dateObj.getDate()).padStart(2, '0')}`,
        10
    );
    const rng = new SeeededRNG(seed);

    // Generation with Barriers
    let attempts = 0;
    while (attempts < 20) {
        const pattern = rng.pick(PATTERN_GENERATORS);
        const numbers = pattern.gen(rng, GAME_CONFIG.TOTAL_LENGTH);

        if (isValidSequence(numbers)) {
            return {
                numbers,
                visibleCount: GAME_CONFIG.INITIAL_VISIBLE_COUNT,
                patternName: pattern.name,
                explanation: pattern.expl
            };
        }
        attempts++;
    }

    // Fallback Sequence
    return {
        numbers: [2, 4, 6, 8, 10, 12, 14, 16, 18], // 9 items fallback
        visibleCount: GAME_CONFIG.INITIAL_VISIBLE_COUNT,
        patternName: PATTERN_NAMES.ARITHMETIC,
        explanation: "Fallback arithmetic sequence."
    };
};

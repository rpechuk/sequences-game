# Number Sequence Game - MVP Implementation Plan

## 1. Technology Stack Selection

### Frontend Framework: **React with TypeScript**

**Decision Rationale:**

- **Pros:**
- Component-based architecture perfect for game UI (sequence display, input, hints, feedback)
- Strong TypeScript support for type-safe game logic
- Large ecosystem and community support
- Easy to add backend integration later (fetch API, React Query)
- Works well with static site generators (Next.js static export or Vite)
- Virtual DOM provides smooth animations for game feedback
- **Cons:**
- Slightly more boilerplate than Vue/Svelte
- Requires build step (but necessary for GitHub Pages anyway)

**Alternatives Considered:**

- **Vue.js:** Simpler syntax, but smaller ecosystem
- **Svelte:** Excellent for small apps, but less familiar to most developers
- **Vanilla JS:** Too much manual DOM manipulation for complex game state

### Build Tool: **Vite**

**Decision Rationale:**

- **Pros:**
- Fast development server with HMR
- Optimized production builds
- Easy static export for GitHub Pages
- Excellent TypeScript support
- Can easily add backend proxy later for development
- **Cons:**
- Requires Node.js (but standard for modern web dev)

**Alternative:** Create React App (deprecated) or Next.js (overkill for static site)

### UI Styling: **Tailwind CSS + Custom CSS Variables**

**Decision Rationale:**

- **Pros:**
- Utility-first approach matches NYT's minimalist aesthetic
- Easy to create custom design system matching NYT games
- Small bundle size with purging
- Responsive design utilities built-in
- Can define custom color palette matching NYT games
- **Cons:**
- Requires learning utility classes (but quick to pick up)

**Alternative:** CSS Modules or styled-components (more verbose for simple game)

### State Management: **Zustand** (or React Context for MVP)

**Decision Rationale:**

- **Pros:**
- Minimal boilerplate (perfect for MVP)
- TypeScript-friendly
- Can easily persist to localStorage for "daily puzzle" feel
- Simple to migrate to backend API calls later
- Lightweight (~1KB)
- **Cons:**
- Less feature-rich than Redux (but unnecessary for this game)

**Alternative:** React Context + useReducer (built-in, but more verbose)

### Sequence Generation: **Client-side Algorithm Library**

**Decision Rationale:**

- Generate sequences on client for MVP
- Can move to backend API later without changing frontend code
- Use deterministic seed for "daily puzzle" effect (date-based)

## 2. Project Structure

```javascript
number-sequence-game/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx          # Main game container
│   │   ├── SequenceDisplay.tsx   # Shows the number sequence
│   │   ├── InputField.tsx        # User input for guess
│   │   ├── HintButton.tsx        # Hint request button
│   │   ├── HintDisplay.tsx       # Shows hints progressively
│   │   ├── FeedbackMessage.tsx   # Success/error messages
│   │   ├── GameStats.tsx         # Streak, attempts (localStorage)
│   │   └── ShareButton.tsx       # Share results (like Wordle)
│   ├── lib/
│   │   ├── sequences.ts          # Sequence generation logic
│   │   ├── patterns.ts           # Pattern definitions (Fibonacci, arithmetic, etc.)
│   │   ├── hints.ts              # Hint generation logic
│   │   └── validation.ts         # Answer validation
│   ├── store/
│   │   └── gameStore.ts          # Zustand store for game state
│   ├── styles/
│   │   ├── globals.css           # Tailwind + custom CSS variables
│   │   └── animations.css        # Game animations
│   ├── types/
│   │   └── game.ts               # TypeScript types
│   ├── utils/
│   │   ├── dateUtils.ts          # Date-based seed generation
│   │   └── storage.ts            # localStorage helpers
│   └── App.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```



## 3. Game Mechanics & Logic

### Sequence Patterns to Implement

1. **Arithmetic Progression:** `2, 5, 8, 11, ?` (answer: 14)
2. **Geometric Progression:** `3, 6, 12, 24, ?` (answer: 48)
3. **Fibonacci:** `0, 1, 1, 2, 3, 5, ?` (answer: 8)
4. **Square Numbers:** `1, 4, 9, 16, 25, ?` (answer: 36)
5. **Prime Numbers:** `2, 3, 5, 7, 11, ?` (answer: 13)
6. **Alternating Pattern:** `1, 3, 2, 4, 3, ?` (answer: 5)
7. **Sum of Previous:** `1, 2, 3, 6, 11, ?` (answer: 20, sum of previous 3)
8. **Multiplication Pattern:** `2, 4, 8, 16, 32, ?` (answer: 64)

### Sequence Generation Strategy

- Use date-based seed for deterministic "daily puzzle"
- Rotate through pattern types using "hash function" also based on dates
        - Use combinations of patter types to increase challenge. Should have an easy, medium and hard mode (similar to pips).
- Ensure sequences are solvable (not too easy/hard)
- Generate 6-9 numbers, hide the last three

### Answer Validation

- Accept numeric input only
- Immediate feedback on submit
- Show correct answer if wrong after max attempts

## 4. Hint System Design (NYT Games Style)

### Hint Progression (Similar to Wordle/Connections)

**Hint 1: Reveal Next Number**

- After each incorrect guess (max 3), reveal the next number in sequence
- Display: add a new block with the next number and include the incorrect guess underneath in red.
- Visual: Subtle animation, light background highlight

**Answer Reveal**

- After max attempts, show correct answer
- Explain the pattern: "The answer is [X] because [pattern explanation]" (e.g. 0 + 1 = 1 -> 1 + 1 = 2 -> ...)

### Hint/Guess UI/UX

- **Guess Counter:** Show "Guesses used: 1/3" (similar to Wordle's attempt counter)
- **Visual Feedback:** 
- Hints appear with smooth fade-in animation
- Use NYT-style muted colors (grays, light blues)
- Icons for hint types (lightbulb, eye, etc.)

## 5. UI/UX Design (NYT Games Aesthetic)

### Design System

**Typography:**

- **Headings:** NYT-style serif font (Georgia or similar)
- **Body/Game:** Clean sans-serif (Helvetica, Arial, or system font)
- **Numbers:** Monospace font for sequence display (better alignment)

**Color Palette (NYT-inspired):**

```css
--bg-primary: #ffffff
--bg-secondary: #f7f7f7
--text-primary: #1a1a1a
--text-secondary: #666666
--accent-correct: #6aaa64 (Wordle green)
--accent-wrong: #c9b458 (Wordle yellow/warning)
--accent-error: #787c7e (Wordle gray)
--border: #d3d6da
--hint-bg: #e8f4f8 (light blue)
```

**Layout:**

- Centered card design (max-width: 500px on desktop)
- Generous white space
- Mobile-first responsive design
- Card shadow: subtle, NYT-style

**Components:**

1. **Sequence Display:**

- Large, readable numbers
- Grid layout: `[1] [2] [3] [4] [5] [?]`
- Missing number shown as `?` or empty box
- Smooth animations on reveal

2. **Input Field:**

- Large, centered input keyboard similar to a num pad
- Submit button (or Enter key) and backspace button
- Clear visual feedback states

3. **Feedback:**

- Success: Green checkmark + "Correct!"
- Error: Red X + "Try again"
- Subtle shake animation on wrong answer

4. **Game Stats (Bottom):**

- Streak counter
- Games played
- Share button (generates Wordle-style emoji grid)

### Animations

- **Sequence Reveal:** Numbers fade in or slide up
- **Wrong Answer:** Shake animation (subtle)
- **Correct Answer:** Confetti or checkmark animation
- **Hint Display:** Smooth fade-in, slide down
- **Transitions:** All state changes use 200-300ms transitions

## 6. User Interaction Flow

```javascript
1. Page Load
   ├─ Check localStorage for today's puzzle
   ├─ If new day: Generate new sequence
   ├─ Display sequence with missing numbers
   └─ If already solved for current day: Show solved puzzle including incorrect guesses

2. User Input
   ├─ Type number in input field
   ├─ Press Enter or click Submit
   └─ Validate answer

3. Correct Answer
   ├─ Show success animation
   ├─ Reveal full sequence
   ├─ Update stats (streak++) including amount of numbers needed to correctly guess (like wordle)
   └─ Show share button

4. Incorrect Answer
   ├─ Show error feedback (aka next number hint)
   ├─ Increment attempt counter
   └─ Allow retry up to max attempts
```



## 7. Implementation Details

### State Management (Zustand Store)

```typescript
interface GameState {
  sequence: number[];
  answer: number;
  pattern: PatternType;
  userGuess: number | null;
  attempts: number;
  isCorrect: boolean;
  isComplete: boolean;
  generateSequence: (seed?: string) => void;
  submitGuess: (guess: number) => void;
  requestHint: () => void;
  resetGame: () => void;
}
```



### Sequence Generation

- Use deterministic PRNG with date-based seed
- Pattern rotation: `patterns[dayOfYear % patterns.length]`
- Ensure sequences are 6-9 numbers long
- Validate difficulty (not too obvious, not too obscure)

### LocalStorage Schema

```typescript
{
  currentDate: string,
  currentSequence: number[],
  currentAnswer: number,
  streak: number,
  gamesPlayed: number,
  lastPlayed: string,
  todayCompleted: boolean
}
```



### 8. Deployment (GitHub Pages)

### Build Configuration

**vite.config.ts:**

```typescript
export default {
  base: '/number-sequence-game/', // or '/' for custom domain
  build: {
    outDir: 'dist'
  }
}
```

**Deployment Steps:**

1. Build: `npm run build`
2. Deploy `dist/` folder to GitHub Pages
3. Use GitHub Actions for auto-deployment

### GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
            - run: npm install && npm run build
            - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```



## 9. Development Phases

### Phase 1: Core Game Logic (Week 1)

- [ ] Set up Vite + React + TypeScript project
- [ ] Implement sequence generation algorithms
- [ ] Create basic game state management
- [ ] Build sequence display component
- [ ] Implement answer validation

### Phase 2: UI Components (Week 1-2)

- [ ] Design and implement game board layout
- [ ] Create input field with validation
- [ ] Add feedback animations
- [ ] Implement responsive design
- [ ] Style to match NYT games aesthetic

### Phase 3: Hint System (Week 2)

- [ ] Implement progressive hint logic
- [ ] Create hint display components
- [ ] Add hint button and counter
- [ ] Style hints to match NYT style
- [ ] Test hint progression

### Phase 4: Polish & Deploy (Week 2-3)

- [ ] Add game statistics (localStorage)
- [ ] Implement share functionality
- [ ] Add animations and transitions
- [ ] Test on mobile devices
- [ ] Set up GitHub Pages deployment
- [ ] Performance optimization

## 10. Key Files to Create

1. **`src/lib/sequences.ts`** - Sequence generation and pattern definitions
2. **`src/store/gameStore.ts`** - Zustand store for game state
3. **`src/components/GameBoard.tsx`** - Main game container
4. **`src/components/SequenceDisplay.tsx`** - Visual sequence display
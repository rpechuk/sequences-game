import { useEffect, useState, useRef } from 'react';

interface CounterStats {
  total: number | null;
  today: number | null;
  thisWeek: number | null;
}

export function Footer() {
  const [stats, setStats] = useState<CounterStats>({
    total: null,
    today: null,
    thisWeek: null,
  });
  
  // Prevent double-counting in React StrictMode (development)
  const hasIncremented = useRef(false);

  useEffect(() => {
    // Skip if already incremented (prevents React StrictMode double-calls)
    if (hasIncremented.current) return;
    hasIncremented.current = true;

    const namespace = 'sequences-game';
    
    // Get current date for daily/weekly tracking
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Get week number (simplified - week of year)
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    const weekKey = `${now.getFullYear()}-W${weekNumber}`;

    // Fetch all counters
    const fetchCounters = async () => {
      try {
        // Increment total counter and get all values
        const [totalRes, todayRes, weekRes] = await Promise.all([
          fetch(`https://api.counterapi.dev/v1/${namespace}/total-visits/up`),
          fetch(`https://api.counterapi.dev/v1/${namespace}/daily-${dateKey}/up`),
          fetch(`https://api.counterapi.dev/v1/${namespace}/weekly-${weekKey}/up`),
        ]);

        const [totalData, todayData, weekData] = await Promise.all([
          totalRes.json(),
          todayRes.json(),
          weekRes.json(),
        ]);

        setStats({
          total: totalData?.count ?? null,
          today: todayData?.count ?? null,
          thisWeek: weekData?.count ?? null,
        });
      } catch (error) {
        console.error('Failed to fetch visit counters:', error);
        // Keep nulls on error
      }
    };

    fetchCounters();
  }, []);

  const formatCount = (count: number | null): string => {
    return count !== null ? count.toLocaleString() : '??';
  };

  return (
    <footer className="hidden md:block w-full py-2 text-center border-t border-primary/10">
      <div className="text-xs text-primary/40 flex items-center justify-center gap-4">
        <span>
          <span className="font-medium">{formatCount(stats.total)}</span> total visits
        </span>
        <span className="text-primary/20">•</span>
        <span>
          <span className="font-medium">{formatCount(stats.today)}</span> today
        </span>
        <span className="text-primary/20">•</span>
        <span>
          <span className="font-medium">{formatCount(stats.thisWeek)}</span> this week
        </span>
      </div>
    </footer>
  );
}


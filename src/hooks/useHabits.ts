import { useState, useEffect, useMemo } from 'react';
import { format, subDays, isSameDay, parseISO, differenceInDays } from 'date-fns';
import { Habit, DailyEntry, DEFAULT_HABITS, UserStats } from '../types';

export function useHabits() {
  const [entries, setEntries] = useState<DailyEntry[]>(() => {
    const saved = localStorage.getItem('disappear_challenge_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    return localStorage.getItem('onboarding_complete') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('disappear_challenge_entries', JSON.stringify(entries));
  }, [entries]);

  const completeOnboarding = () => {
    setOnboardingComplete(true);
    localStorage.setItem('onboarding_complete', 'true');
  };

  const getEntryForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existing = entries.find(e => e.date === dateStr);
    
    if (existing) return existing;

    // Create new entry for today
    const newEntry: DailyEntry = {
      date: dateStr,
      habits: DEFAULT_HABITS.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name,
        completed: false
      })),
      score: 0,
      reflection: []
    };
    return newEntry;
  };

  const toggleHabit = (dateStr: string, habitId: string) => {
    setEntries(prev => {
      const entryIndex = prev.findIndex(e => e.date === dateStr);
      let newEntries = [...prev];

      if (entryIndex === -1) {
        // Create new entry if it doesn't exist
        const newEntry = getEntryForDate(parseISO(dateStr));
        const habit = newEntry.habits.find(h => h.id === habitId);
        if (habit) habit.completed = !habit.completed;
        newEntry.score = newEntry.habits.filter(h => h.completed).length;
        newEntries.push(newEntry);
      } else {
        const entry = { ...newEntries[entryIndex] };
        entry.habits = entry.habits.map(h => 
          h.id === habitId ? { ...h, completed: !h.completed } : h
        );
        entry.score = entry.habits.filter(h => h.completed).length;
        newEntries[entryIndex] = entry;
      }

      return newEntries;
    });
  };

  const updateReflection = (dateStr: string, wins: string[]) => {
    setEntries(prev => {
      const entryIndex = prev.findIndex(e => e.date === dateStr);
      let newEntries = [...prev];
      if (entryIndex !== -1) {
        newEntries[entryIndex] = { ...newEntries[entryIndex], reflection: wins };
      }
      return newEntries;
    });
  };

  const stats = useMemo((): UserStats => {
    if (entries.length === 0) return { currentStreak: 0, longestStreak: 0, totalDaysCompleted: 0, disciplineScore: 0 };

    const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    
    // Calculate current streak
    let currentStreak = 0;
    let today = new Date();
    let checkDate = today;

    // If today's entry exists and has at least one habit, start counting
    // If today has no entry, check yesterday
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
    
    const hasToday = entries.find(e => e.date === todayStr && e.score > 0);
    const hasYesterday = entries.find(e => e.date === yesterdayStr && e.score > 0);

    if (!hasToday && !hasYesterday) {
      currentStreak = 0;
    } else {
      let tempDate = hasToday ? today : subDays(today, 1);
      while (true) {
        const dStr = format(tempDate, 'yyyy-MM-dd');
        const entry = entries.find(e => e.date === dStr && e.score > 0);
        if (entry) {
          currentStreak++;
          tempDate = subDays(tempDate, 1);
        } else {
          break;
        }
      }
    }

    // Longest streak
    let longest = 0;
    let tempLongest = 0;
    const allDates = sortedEntries.map(e => e.date).sort();
    
    for (let i = 0; i < allDates.length; i++) {
        const entry = entries.find(e => e.date === allDates[i]);
        if (entry && entry.score > 0) {
            tempLongest++;
            if (tempLongest > longest) longest = tempLongest;
        } else {
            tempLongest = 0;
        }
        
        // Check gap between dates
        if (i < allDates.length - 1) {
            const d1 = parseISO(allDates[i]);
            const d2 = parseISO(allDates[i+1]);
            if (differenceInDays(d2, d1) > 1) {
                tempLongest = 0;
            }
        }
    }

    const totalDays = entries.filter(e => e.score > 0).length;
    const last7Days = entries.filter(e => {
        const d = parseISO(e.date);
        return differenceInDays(new Date(), d) <= 7;
    });
    const avgScore = last7Days.length > 0 
        ? last7Days.reduce((acc, curr) => acc + curr.score, 0) / (last7Days.length * 10)
        : 0;

    return {
      currentStreak,
      longestStreak: longest,
      totalDaysCompleted: totalDays,
      disciplineScore: Math.round(avgScore * 100)
    };
  }, [entries]);

  return {
    entries,
    stats,
    onboardingComplete,
    completeOnboarding,
    getEntryForDate,
    toggleHabit,
    updateReflection
  };
}

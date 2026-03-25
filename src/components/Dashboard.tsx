import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Trophy, Calendar, TrendingUp, Award, Plus, X, Zap } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import HabitCard from './HabitCard';
import { format } from 'date-fns';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { REWARDS } from '../types';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { getEntryForDate, toggleHabit, stats, entries, updateReflection } = useHabits();
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'rewards'>('today');
  const [showReflection, setShowReflection] = useState(false);
  const [newWin, setNewWin] = useState('');

  const today = new Date();
  const entry = getEntryForDate(today);

  const chartData = entries
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map(e => ({
      date: format(new Date(e.date), 'EEE'),
      score: e.score
    }));

  const handleAddWin = () => {
    if (newWin.trim() && entry.reflection.length < 5) {
      updateReflection(entry.date, [...entry.reflection, newWin.trim()]);
      setNewWin('');
    }
  };

  const handleRemoveWin = (index: number) => {
    const newWins = entry.reflection.filter((_, i) => i !== index);
    updateReflection(entry.date, newWins);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans">
      {/* Header */}
      <header className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-20">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">90 DAY DISAPPEAR</h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
            {format(today, 'EEEE, MMM do')}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-2 pr-4 rounded-2xl">
          <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">{stats.currentStreak}</span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Streak</span>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Progress Overview */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col gap-2">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Day</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{stats.totalDaysCompleted + 1}</span>
              <span className="text-zinc-600 font-bold">/ 90</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <motion.div 
                className="bg-white h-full"
                initial={{ width: 0 }}
                animate={{ width: `${((stats.totalDaysCompleted + 1) / 90) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col gap-2">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{entry.score}</span>
              <span className="text-zinc-600 font-bold">/ 10</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">Daily Discipline</span>
          </div>
        </section>

        {activeTab === 'today' && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold tracking-tight">Daily Protocol</h2>
                <button 
                  onClick={() => setShowReflection(true)}
                  className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> LOG WINS
                </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {entry.habits.map((habit) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onToggle={() => toggleHabit(entry.date, habit.id)} 
                />
              ))}
            </div>
          </motion.section>
        )}

        {activeTab === 'stats' && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Weekly Performance</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#71717a', fontSize: 12 }} 
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#fff" 
                        strokeWidth={3} 
                        dot={{ fill: '#fff', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase">Discipline Score</p>
                        <p className="text-xl font-bold">{stats.disciplineScore}%</p>
                    </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase">Longest Streak</p>
                        <p className="text-xl font-bold">{stats.longestStreak} Days</p>
                    </div>
                </div>

                {/* Smart Suggestion */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-6 rounded-3xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Smart Suggestion</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                        {stats.disciplineScore < 50 
                          ? "Discipline is a muscle. Start with the 'Cold Shower' and '3L Water' to build early momentum today."
                          : "You're in the flow. The '1000 Words Writing' is your highest leverage habit. Don't skip it tonight."}
                    </p>
                </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'rewards' && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-4"
          >
            {REWARDS.map((reward) => {
              const isUnlocked = stats.totalDaysCompleted >= reward.day;
              return (
                <div 
                  key={reward.day}
                  className={cn(
                    "p-6 rounded-3xl border flex items-center gap-6 transition-all duration-500",
                    isUnlocked 
                      ? "bg-zinc-900 border-zinc-700" 
                      : "bg-black border-zinc-900 opacity-50 grayscale"
                  )}
                >
                  <div className="text-4xl">{reward.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{reward.title}</h3>
                    <p className="text-zinc-500 text-sm">Day {reward.day} Achievement</p>
                  </div>
                  {isUnlocked ? (
                    <Award className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <div className="text-xs font-bold text-zinc-700">LOCKED</div>
                  )}
                </div>
              );
            })}
          </motion.section>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2 flex justify-around items-center shadow-2xl z-30">
        <button 
          onClick={() => setActiveTab('today')}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-[2rem] transition-all duration-300",
            activeTab === 'today' ? "bg-white text-black px-8" : "text-zinc-500"
          )}
        >
          <Calendar className="w-6 h-6" />
          {activeTab === 'today' && <span className="text-[10px] font-bold uppercase">Today</span>}
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-[2rem] transition-all duration-300",
            activeTab === 'stats' ? "bg-white text-black px-8" : "text-zinc-500"
          )}
        >
          <TrendingUp className="w-6 h-6" />
          {activeTab === 'stats' && <span className="text-[10px] font-bold uppercase">Stats</span>}
        </button>
        <button 
          onClick={() => setActiveTab('rewards')}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-[2rem] transition-all duration-300",
            activeTab === 'rewards' ? "bg-white text-black px-8" : "text-zinc-500"
          )}
        >
          <Trophy className="w-6 h-6" />
          {activeTab === 'rewards' && <span className="text-[10px] font-bold uppercase">Rewards</span>}
        </button>
      </nav>

      {/* Reflection Modal */}
      {showReflection && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="bg-zinc-900 w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 border-t border-white/10"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">5 Daily Wins</h2>
              <button onClick={() => setShowReflection(false)} className="p-2 bg-zinc-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {entry.reflection.map((win, i) => (
                <div key={i} className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-zinc-300">{win}</span>
                  <button onClick={() => handleRemoveWin(i)} className="text-zinc-500 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {entry.reflection.length < 5 && (
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newWin}
                    onChange={(e) => setNewWin(e.target.value)}
                    placeholder="Enter a win..."
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white focus:outline-none focus:border-white transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddWin()}
                  />
                  <button 
                    onClick={handleAddWin}
                    className="bg-white text-black p-4 rounded-2xl font-bold"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-zinc-500 text-xs text-center">
              {5 - entry.reflection.length} slots remaining. Focus on small victories.
            </p>

            <button 
              onClick={() => setShowReflection(false)}
              className="w-full mt-8 py-4 bg-white text-black font-bold rounded-2xl"
            >
              DONE
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

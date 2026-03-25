import React from 'react';
import { motion } from 'motion/react';
import { Check, Circle } from 'lucide-react';
import { Habit } from '../types';
import { cn } from '../lib/utils';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  key?: React.Key;
}

export default function HabitCard({ habit, onToggle }: HabitCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={cn(
        "relative flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden",
        habit.completed 
          ? "bg-white/10 border-white/20" 
          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
      )}
    >
      <div className="flex flex-col gap-1">
        <span className={cn(
          "text-lg font-semibold tracking-tight transition-colors",
          habit.completed ? "text-white" : "text-zinc-400"
        )}>
          {habit.name}
        </span>
        {habit.completed && (
            <motion.span 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-green-500 font-medium uppercase tracking-widest"
            >
                Completed
            </motion.span>
        )}
      </div>

      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
        habit.completed ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-600"
      )}>
        {habit.completed ? (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Check className="w-6 h-6 stroke-[3]" />
          </motion.div>
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </div>

      {habit.completed && (
        <motion.div
          layoutId={`sparkle-${habit.id}`}
          className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
}

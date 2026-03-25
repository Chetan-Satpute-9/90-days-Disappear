import React from 'react';
import { useHabits } from './hooks/useHabits';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

export default function App() {
  const { onboardingComplete, completeOnboarding } = useHabits();

  if (!onboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return <Dashboard />;
}

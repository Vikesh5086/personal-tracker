import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/layout/AppHeader';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { LevelUpModal } from './components/common/LevelUpModal';
import { MilestoneModal } from './components/common/MilestoneModal';

// Views
import { DailyDashboard } from './components/dashboard/DailyDashboard';
import { CombinedOverview } from './components/overview/CombinedOverview';
import { CalendarView } from './components/calendar/CalendarView';
import { ProductivitySuite } from './components/productivity/ProductivitySuite';
import { ExtraTrackers } from './components/extras/ExtraTrackers';
import { BadgesView } from './components/gamification/BadgesView';
import { SettingsModal } from './components/settings/SettingsModal';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <h2 className="text-lg font-bold">Loading 100-Day Tracker...</h2>
        <p className="text-xs text-slate-400 mt-1">Initializing local private IndexedDB</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex aurora-bg text-slate-800 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Desktop Sticky Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <AppHeader />

          {/* Active Tab View */}
          {activeTab === 'dashboard' && <DailyDashboard />}
          {activeTab === 'overview' && <CombinedOverview />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'productivity' && <ProductivitySuite />}
          {activeTab === 'extras' && <ExtraTrackers />}
          {activeTab === 'gamification' && <BadgesView />}
          {activeTab === 'settings' && <SettingsModal />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Modals & Overlays */}
      <OnboardingModal />
      <LevelUpModal />
      <MilestoneModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

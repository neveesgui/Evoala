import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import TopHeader from './components/TopHeader';
import NavigationBar, { type AppTabId } from './components/NavigationBar';
import LessonPlayer from './components/LessonPlayer';
import OnboardingScreen from './components/OnboardingScreen';
import SplashScreen from './components/SplashScreen';
import { SkyBackground } from './components/ui/TactileUI';
import { TrailsTab } from './screens/TrailsTab';
import { GatekeeperTab } from './screens/GatekeeperTab';
import { LeagueTab } from './screens/LeagueTab';
import { EvolutionTab } from './screens/EvolutionTab';
import { ProfileTab } from './screens/ProfileTab';
import type { CurriculumLesson } from './data/curriculum';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTabId>('trail');
  const [activeLesson, setActiveLesson] = useState<CurriculumLesson | null>(null);
  const { hasOnboarded } = useAppStore();
  const mainRef = useRef<HTMLElement | null>(null);

  if (showSplash) {
    return (
      <AnimatePresence mode="wait">
        <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
      </AnimatePresence>
    );
  }

  if (!hasOnboarded) {
    return <OnboardingScreen />;
  }

  const handleSelectUnit = (unitId: string) => {
    setActiveTab('trail');
    setTimeout(() => {
      const target = document.getElementById(`unit-${unitId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'trail':
        return <TrailsTab onSelectLesson={setActiveLesson} />;
      case 'gatekeeper':
        return <GatekeeperTab />;
      case 'league':
        return <LeagueTab />;
      case 'evolution':
        return <EvolutionTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <TrailsTab onSelectLesson={setActiveLesson} />;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full relative flex justify-center overflow-hidden bg-[#07111A]">
      <SkyBackground />

      {/* Apple Liquid Glass Centered Mobile-First Frame */}
      <div className="w-full max-w-[480px] h-[100dvh] flex flex-col relative z-10 bg-transparent sm:border-x sm:border-white/12 sm:shadow-[0_0_60px_rgba(0,0,0,0.65)]">
        <TopHeader onSelectUnit={handleSelectUnit} />

        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="min-h-full"
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>

        <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeLesson && (
          <LessonPlayer lesson={activeLesson} onClose={() => setActiveLesson(null)} />
        )}
      </div>
    </div>
  );
}

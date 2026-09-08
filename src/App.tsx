import { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import TopHeader from './components/TopHeader';
import NavigationBar from './components/NavigationBar';
import LessonPlayer from './components/LessonPlayer';
import LevelingAssessment from './components/LevelingAssessment';
import OnboardingScreen from './components/OnboardingScreen';
import { TrailsTab } from './screens/TrailsTab';
import { LeagueTab } from './screens/LeagueTab';
import { ProfileTab } from './screens/ProfileTab';
import { SimulatorTab } from './screens/SimulatorTab';
import { DuetsTab } from './screens/DuetsTab';
import { AnimatePresence, motion } from 'framer-motion';
import type { Lesson } from './data/lessonsData';

export default function App() {
  const [activeTab, setActiveTab] = useState('trail');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const { isDarkMode, hasOnboarded, hasCompletedLeveling } = useAppStore();

  if (!hasOnboarded) return <OnboardingScreen />;
  if (!hasCompletedLeveling) return <LevelingAssessment />;

  const renderTab = () => {
    switch (activeTab) {
      case 'trail': return <TrailsTab key="trail" onSelectLesson={setActiveLesson} />;
      case 'simulator': return <SimulatorTab key="simulator" />;
      case 'duets': return <DuetsTab key="duets" />;
      case 'league': return <LeagueTab key="league" />;
      case 'profile': return <ProfileTab key="profile" />;
      default: return <TrailsTab key="trail" onSelectLesson={setActiveLesson} />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} bg-slate-950 min-h-[100dvh] flex justify-center selection:bg-sky-500/30 font-sans`}>
      <div className="w-full max-w-md h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden shadow-2xl sm:border-x sm:border-slate-800/60">
        
        <TopHeader />
        
        {/* Adicionado padding inferior (pb-28) para o conteúdo não ficar escondido atrás da barra flutuante */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth w-full pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-full"
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeLesson && <LessonPlayer lesson={activeLesson} onClose={() => setActiveLesson(null)} />}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { soundFX } from '../utils/soundEffects';

export type AppTabId = 'trail' | 'gatekeeper' | 'league' | 'evolution' | 'profile';

interface NavigationBarProps {
  activeTab: AppTabId;
  setActiveTab: (tab: AppTabId) => void;
}

const TABS: { id: AppTabId; label: string }[] = [
  { id: 'trail', label: 'Trilha' },
  { id: 'gatekeeper', label: 'Gatekeeper' },
  { id: 'league', label: 'Ligas' },
  { id: 'evolution', label: 'Evolução' },
  { id: 'profile', label: 'Perfil' },
];

export default function NavigationBar({ activeTab, setActiveTab }: NavigationBarProps) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-[#131F24] border-t-2 border-[#23323A] px-2 pb-safe">
      <div className="h-[68px] flex items-center justify-around gap-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (!isActive) soundFX.playTap();
                setActiveTab(tab.id);
              }}
              aria-label={tab.label}
              title={tab.label}
              className="relative flex items-center justify-center cursor-pointer outline-none select-none"
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`w-12 h-11 flex items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? 'border-2 border-[#1CB0F6] bg-[#1CB0F6]/15'
                    : 'border-2 border-transparent hover:bg-white/5'
                }`}
              >
                <TabIllustratedIcon id={tab.id} />
              </motion.div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Custom Illustrated Flat / Duolingo-Style Filled SVG Icons (32x32).
 */
function TabIllustratedIcon({ id }: { id: AppTabId }) {
  switch (id) {
    /* Aba 1: Casinha amarela (#FFC800) com telhado coral (#FF4B4B) e porta marrom */
    case 'trail':
      return (
        <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
          <path
            d="M8 16 L18 8 L28 16 V28 C28 29.7 26.7 31 25 31 H11 C9.3 31 8 29.7 8 28 V16 Z"
            fill="#FFC800"
          />
          <path
            d="M5 17.5 L18 7 L31 17.5"
            stroke="#FF4B4B"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="20" r="3.6" fill="#A15C20" />
          <rect x="14.5" y="26.2" width="7" height="2.4" rx="1.2" fill="#D99B00" />
        </svg>
      );

    /* Aba 2: Baú de tesouro dourado (#FFB800) e marrom (#A15C20) com fechadura brilhante */
    case 'gatekeeper':
      return (
        <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
          <rect x="6" y="10" width="24" height="19" rx="4" fill="#A15C20" />
          <rect x="6" y="9" width="24" height="8" rx="3" fill="#B86B26" />
          {/* Golden vertical straps */}
          <rect x="6" y="9" width="4" height="20" rx="1.5" fill="#FFB800" />
          <rect x="26" y="9" width="4" height="20" rx="1.5" fill="#FFB800" />
          {/* Center gold band */}
          <rect x="6" y="16" width="24" height="3.2" fill="#FFB800" />
          {/* Gleaming keyhole */}
          <rect x="14.5" y="14" width="7" height="8" rx="2" fill="#FFD54F" />
          <circle cx="18" cy="17.2" r="1.4" fill="#7A4212" />
          <rect x="17.2" y="17.8" width="1.6" height="2.6" rx="0.8" fill="#7A4212" />
        </svg>
      );

    /* Aba 3: Troféu dourado/laranja vibrante (#FF9600) com relevo */
    case 'league':
      return (
        <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
          {/* Handles */}
          <path
            d="M10 11 H6.5 C6.5 16 8.5 19 12 19"
            stroke="#FF9600"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M26 11 H29.5 C29.5 16 27.5 19 24 19"
            stroke="#FF9600"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Cup body */}
          <path
            d="M10 8 H26 V16 C26 20.5 22.5 24 18 24 C13.5 24 10 20.5 10 16 V8 Z"
            fill="#FF9600"
          />
          {/* Embossed gold highlight */}
          <path
            d="M13 10.5 H16 V17.5 C16 18.8 14.5 19.5 13 18.5 V10.5 Z"
            fill="#FFC800"
            opacity="0.7"
          />
          {/* Stem & base */}
          <rect x="15.8" y="23" width="4.4" height="5" fill="#E07B00" />
          <rect x="11.5" y="27.5" width="13" height="3.5" rx="1.75" fill="#FF9600" />
        </svg>
      );

    /* Aba 4: Balão de diálogo rosa-chiclete (#FF66B2) com coração branco (#FFFFFF) */
    case 'evolution':
      return (
        <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
          <rect x="5" y="7" width="26" height="20" rx="6" fill="#FF66B2" />
          <path d="M14 26 L18 31.5 L22 26 Z" fill="#FF66B2" />
          <path
            d="M18 23 C18 23 11.5 18.8 11.5 14.6 C11.5 12.6 13.1 11.2 15 11.2 C16.3 11.2 17.4 11.9 18 13 C18.6 11.9 19.7 11.2 21 11.2 C22.9 11.2 24.5 12.6 24.5 14.6 C24.5 18.8 18 23 18 23 Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    /* Aba 5: Círculo roxo/lilás vibrante (#CE82FF) com três pontos brancos (•••) */
    case 'profile':
      return (
        <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="12.5" fill="#CE82FF" />
          <circle cx="12.5" cy="18" r="2" fill="#FFFFFF" />
          <circle cx="18" cy="18" r="2" fill="#FFFFFF" />
          <circle cx="23.5" cy="18" r="2" fill="#FFFFFF" />
        </svg>
      );
  }
}

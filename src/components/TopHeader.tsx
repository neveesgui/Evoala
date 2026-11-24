import { useState } from 'react';
import { Flame, Sparkles, Heart, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { CURRICULUM_UNITS } from '../data/curriculum';
import { soundFX } from '../utils/soundEffects';

interface TopHeaderProps {
  onSelectUnit?: (unitId: string) => void;
}

export default function TopHeader({ onSelectUnit }: TopHeaderProps) {
  const { streak, xp, energy, maxEnergy, selectedUnitId, setSelectedUnit, refillEnergy } =
    useAppStore();
  const [unitMenuOpen, setUnitMenuOpen] = useState(false);
  const [showEnergyToast, setShowEnergyToast] = useState(false);

  const currentUnit =
    CURRICULUM_UNITS.find((u) => u.id === selectedUnitId) || CURRICULUM_UNITS[0];

  const handleChooseUnit = (unitId: string) => {
    soundFX.playTap();
    setSelectedUnit(unitId);
    setUnitMenuOpen(false);
    onSelectUnit?.(unitId);
  };

  const handleEnergyClick = () => {
    soundFX.playTap();
    if (energy < maxEnergy) {
      refillEnergy();
      soundFX.playCorrect();
    }
    setShowEnergyToast(true);
    setTimeout(() => setShowEnergyToast(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 pt-safe apple-glass border-b border-slate-200/80 px-4 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Minimal Unit Selector */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundFX.playTap();
              setUnitMenuOpen((v) => !v);
            }}
            className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/70 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: currentUnit.accentColor }}
            />
            <span className="font-display font-extrabold text-xs text-slate-700 max-w-[100px] truncate">
              Unid. {currentUnit.number}
            </span>
            <ChevronDown
              size={14}
              strokeWidth={2.6}
              className={`text-slate-500 transition-transform ${unitMenuOpen ? 'rotate-180' : ''}`}
            />
          </motion.button>

          <AnimatePresence>
            {unitMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                className="absolute left-0 mt-2 w-64 tactile-card p-2 z-50"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                  Escolher Trilha
                </p>
                {CURRICULUM_UNITS.map((unit) => {
                  const active = unit.id === currentUnit.id;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => handleChooseUnit(unit.id)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        active ? 'bg-[#F0F9FF]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-slate-400">
                          {unit.badgeText}
                        </span>
                        <span className="block font-display text-xs font-extrabold text-slate-800 truncate">
                          {unit.title}
                        </span>
                      </div>
                      {active && <Check size={15} strokeWidth={2.8} className="text-[#58CC02] shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clean Duolingo-style HUD Counters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Flame size={18} fill="#FF9600" className="text-[#FF9600]" strokeWidth={2} />
            <span className="font-display font-extrabold text-sm text-[#FF9600]">{streak}</span>
          </div>

          <div className="flex items-center gap-1">
            <Sparkles size={17} fill="#FFC800" className="text-[#E5A400]" strokeWidth={2} />
            <span className="font-display font-extrabold text-sm text-[#D99B00]">{xp}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleEnergyClick}
            title={energy < maxEnergy ? 'Toque para recarregar energia' : 'Energia cheia'}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Heart size={18} fill="#FF4B4B" className="text-[#FF4B4B]" strokeWidth={2} />
            <span className="font-display font-extrabold text-sm text-[#FF4B4B]">{energy}</span>
            {energy < maxEnergy && <RefreshCw size={10} className="text-slate-400" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showEnergyToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-4 top-13 bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-lg z-50"
          >
            ❤️ Energia completa ({maxEnergy}/{maxEnergy})
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

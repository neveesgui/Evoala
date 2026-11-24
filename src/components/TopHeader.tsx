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
    <header className="sticky top-0 z-30 pt-safe bg-[#29B6F6]/90 backdrop-blur-md border-b-[2.5px] border-[#1A1D20] px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Unit selector pill */}
        <div className="relative">
          <motion.button
            whileTap={{ y: 2 }}
            onClick={() => {
              soundFX.playTap();
              setUnitMenuOpen((v) => !v);
            }}
            className="flex items-center gap-1.5 bg-white border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] active:shadow-[0px_1px_0px_#1A1D20] px-2.5 py-1.5 rounded-xl cursor-pointer"
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-[#1A1D20] shrink-0"
              style={{ backgroundColor: currentUnit.accentColor }}
            />
            <span className="font-display font-bold text-xs text-[#1A1D20] max-w-[105px] truncate">
              Unid. {currentUnit.number}
            </span>
            <ChevronDown
              size={14}
              strokeWidth={3}
              className={`text-[#1A1D20] transition-transform ${unitMenuOpen ? 'rotate-180' : ''}`}
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
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                  Escolher Trilha
                </p>
                {CURRICULUM_UNITS.map((unit) => {
                  const active = unit.id === currentUnit.id;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => handleChooseUnit(unit.id)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        active ? 'bg-[#E1F5FE]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-[10px] font-extrabold text-slate-400">
                          {unit.badgeText}
                        </span>
                        <span className="block font-display text-xs font-bold text-[#1A1D20] truncate">
                          {unit.title}
                        </span>
                      </div>
                      {active && <Check size={15} strokeWidth={3} className="text-[#43B02A] shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HUD Stats: Streak, XP, Energy */}
        <div className="flex items-center gap-1.5">
          {/* Streak */}
          <div className="flex items-center gap-1 bg-white border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] px-2.5 py-1 rounded-xl">
            <Flame size={15} fill="#FF6D00" className="text-[#FF6D00]" strokeWidth={2.5} />
            <span className="font-display font-bold text-xs text-[#1A1D20]">{streak}</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1 bg-white border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] px-2.5 py-1 rounded-xl">
            <Sparkles size={15} fill="#FFC107" className="text-[#D39E00]" strokeWidth={2.5} />
            <span className="font-display font-bold text-xs text-[#1A1D20]">{xp}</span>
          </div>

          {/* Energy / Hearts */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleEnergyClick}
            title={energy < maxEnergy ? 'Toque para recarregar energia' : 'Energia cheia'}
            className="flex items-center gap-1 bg-white border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] px-2.5 py-1 rounded-xl cursor-pointer"
          >
            <Heart size={15} fill="#FF5252" className="text-[#FF5252]" strokeWidth={2.5} />
            <span className="font-display font-bold text-xs text-[#1A1D20]">{energy}</span>
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
            className="absolute right-3 top-14 bg-[#1A1D20] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg z-50"
          >
            ❤️ Energia completa ({maxEnergy}/{maxEnergy})!
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

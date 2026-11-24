import { useState } from 'react';
import { Flame, Sparkles, Zap, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getPersonalizedUnits, getAreaMeta } from '../data/curriculum';
import { soundFX } from '../utils/soundEffects';

interface TopHeaderProps {
  onSelectUnit?: (unitId: string) => void;
}

export default function TopHeader({ onSelectUnit }: TopHeaderProps) {
  const { streak, xp, energy, maxEnergy, selectedUnitId, userArea, setSelectedUnit, refillEnergy } =
    useAppStore();
  const [unitMenuOpen, setUnitMenuOpen] = useState(false);
  const [showEnergyToast, setShowEnergyToast] = useState(false);

  const units = getPersonalizedUnits(userArea);
  const currentUnit = units.find((u) => u.id === selectedUnitId) || units[0];
  const areaMeta = getAreaMeta(userArea);

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
    <header className="sticky top-0 z-30 pt-safe apple-glass border-b border-[#24333B] px-3 sm:px-4 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Area + Unit Selector */}
        <div className="relative min-w-0">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundFX.playTap();
              setUnitMenuOpen((v) => !v);
            }}
            className="flex items-center gap-1.5 bg-[#1B2B34] hover:bg-[#223540] border border-[#2E3F49] px-2.5 sm:px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
          >
            <span className="text-sm leading-none">{areaMeta.emoji}</span>
            <span className="font-display font-extrabold text-xs text-slate-100 max-w-[76px] sm:max-w-[100px] truncate">
              {areaMeta.shortLabel}
            </span>
            <ChevronDown
              size={14}
              strokeWidth={2.6}
              className={`text-slate-400 transition-transform ${unitMenuOpen ? 'rotate-180' : ''}`}
            />
          </motion.button>

          <AnimatePresence>
            {unitMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                className="absolute left-0 mt-2 w-68 max-w-[calc(100vw-1.5rem)] tactile-card p-2 z-50"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 py-1">
                  Trilhas • {areaMeta.label}
                </p>
                {units.map((unit) => {
                  const active = unit.id === currentUnit.id;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => handleChooseUnit(unit.id)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                        active ? 'bg-[#1CB0F6]/15' : 'hover:bg-[#223540]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span
                          className="block text-[10px] font-extrabold uppercase"
                          style={{ color: unit.accentColor }}
                        >
                          {unit.sectionLabel}
                        </span>
                        <span className="block font-display text-xs font-extrabold text-white truncate">
                          {unit.title}
                        </span>
                      </div>
                      {active && <Check size={15} strokeWidth={2.8} className="text-[#00CD9C] shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Duolingo Dark HUD Counters (XP, Streak, Pink Energy) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="flex items-center gap-1">
            <Sparkles size={17} fill="#FFC800" className="text-[#FFC800]" strokeWidth={2} />
            <span className="font-display font-extrabold text-sm text-[#FFC800]">{xp}</span>
          </div>

          <div className="flex items-center gap-1">
            <Flame size={18} fill="#FF9600" className="text-[#FF9600]" strokeWidth={2} />
            <span className="font-display font-extrabold text-sm text-[#FF9600]">{streak}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleEnergyClick}
            title={energy < maxEnergy ? 'Toque para recarregar energia' : 'Energia cheia'}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-6 h-4 rounded-[5px] bg-[#FF5E9C] text-white">
              <Zap size={11} fill="#FFFFFF" strokeWidth={2.5} />
            </span>
            <span className="font-display font-extrabold text-sm text-[#FF5E9C]">{energy}</span>
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
            className="absolute right-4 top-13 bg-[#1B2B34] border border-[#37464F] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg z-50"
          >
            ⚡ Energia recarregada ({maxEnergy}/{maxEnergy})
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

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
    <header className="sticky top-0 z-30 pt-safe bg-[#131F24] border-b-2 border-[#23323A] px-3 sm:px-4 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Liquid Glass Area Pill */}
        <div className="relative min-w-0">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundFX.playTap();
              setUnitMenuOpen((v) => !v);
            }}
            className="liquid-glass flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all hover:bg-white/15"
          >
            <span className="text-sm leading-none">{areaMeta.emoji}</span>
            <span className="font-display font-extrabold text-xs text-white max-w-[74px] sm:max-w-[96px] truncate">
              {areaMeta.shortLabel}
            </span>
            <ChevronDown
              size={13}
              strokeWidth={2.6}
              className={`text-white/70 transition-transform ${unitMenuOpen ? 'rotate-180' : ''}`}
            />
          </motion.button>

          <AnimatePresence>
            {unitMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                className="absolute left-0 mt-2 w-68 max-w-[calc(100vw-1.5rem)] liquid-glass rounded-3xl p-2 z-50"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-300 px-3 py-1">
                  Trilhas • {areaMeta.label}
                </p>
                {units.map((unit) => {
                  const active = unit.id === currentUnit.id;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => handleChooseUnit(unit.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl text-left transition-colors cursor-pointer ${
                        active ? 'bg-sky-400/20 border border-sky-300/30' : 'hover:bg-white/10'
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
                      {active && <Check size={15} strokeWidth={2.8} className="text-[#10E8A2] shrink-0" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Individual Liquid Glass HUD Pills (XP, Streak, Energy) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="liquid-glass rounded-full px-2.5 py-1 flex items-center gap-1">
            <Sparkles size={14} fill="#FFD54F" className="text-[#FFD54F]" strokeWidth={2} />
            <span className="font-display font-extrabold text-xs text-[#FFD54F]">{xp}</span>
          </div>

          <div className="liquid-glass rounded-full px-2.5 py-1 flex items-center gap-1">
            <Flame size={15} fill="#FF9600" className="text-[#FF9600]" strokeWidth={2} />
            <span className="font-display font-extrabold text-xs text-[#FF9600]">{streak}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleEnergyClick}
            title={energy < maxEnergy ? 'Toque para recarregar energia' : 'Energia cheia'}
            className="liquid-glass rounded-full px-2.5 py-1 flex items-center gap-1 cursor-pointer"
          >
            <Zap size={14} fill="#FF5E9C" className="text-[#FF5E9C]" strokeWidth={2.2} />
            <span className="font-display font-extrabold text-xs text-[#FF5E9C]">{energy}</span>
            {energy < maxEnergy && <RefreshCw size={10} className="text-white/60" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showEnergyToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-4 top-14 liquid-glass text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-lg z-50"
          >
            ⚡ Energia recarregada ({maxEnergy}/{maxEnergy})
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

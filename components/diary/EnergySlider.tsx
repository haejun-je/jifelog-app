import React from 'react';
import LevelSlider from './LevelSlider';

const LABELS: Record<number, string> = {
  1: '매우 낮음',
  2: '낮음',
  3: '보통',
  4: '높음',
  5: '매우 높음',
};

const COLORS: Record<number, string> = {
  1: 'text-slate-500 dark:text-slate-400',
  2: 'text-sky-500 dark:text-sky-400',
  3: 'text-yellow-500 dark:text-yellow-400',
  4: 'text-emerald-500 dark:text-emerald-400',
  5: 'text-teal-600 dark:text-teal-300',
};

interface EnergySliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const EnergySlider: React.FC<EnergySliderProps> = ({ value, onChange }) => (
  <LevelSlider value={value} onChange={onChange} labels={LABELS} colors={COLORS} />
);

export default EnergySlider;

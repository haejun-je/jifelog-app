import React from 'react';
import LevelSlider from './LevelSlider';

const LABELS: Record<number, string> = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족',
};

const COLORS: Record<number, string> = {
  1: 'text-red-500 dark:text-red-400',
  2: 'text-orange-500 dark:text-orange-400',
  3: 'text-yellow-500 dark:text-yellow-400',
  4: 'text-teal-500 dark:text-teal-400',
  5: 'text-teal-600 dark:text-teal-300',
};

interface SatisfactionSliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const SatisfactionSlider: React.FC<SatisfactionSliderProps> = ({ value, onChange }) => (
  <LevelSlider value={value} onChange={onChange} labels={LABELS} colors={COLORS} />
);

export default SatisfactionSlider;

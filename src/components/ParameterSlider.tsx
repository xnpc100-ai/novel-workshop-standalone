import { Slider } from '@/components/ui/slider';

interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: 'gold' | 'blue' | 'green';
}

export function ParameterSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color = 'gold',
}: ParameterSliderProps) {
  const colorClasses = {
    gold: 'text-primary',
    blue: 'text-accent-blue',
    green: 'text-accent-green',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className={`text-sm font-bold ${colorClasses[color]}`}>{value}%</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
        className="[&_[role=slider]]:bg-current"
      />
    </div>
  );
}

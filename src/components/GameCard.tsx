import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: 'cyan' | 'magenta' | 'yellow';
  delay?: number;
}

const colorClasses = {
  cyan: 'from-primary/20 to-primary/5 border-primary/30 shadow-neon',
  magenta: 'from-secondary/20 to-secondary/5 border-secondary/30 shadow-neon-magenta',
  yellow: 'from-accent/20 to-accent/5 border-accent/30 shadow-neon-yellow',
};

const iconColors = {
  cyan: 'text-primary',
  magenta: 'text-secondary',
  yellow: 'text-accent',
};

export function GameCard({ title, description, icon: Icon, path, color, delay = 0 }: GameCardProps) {
  const navigate = useNavigate();
  const { playTap, vibrate } = useSettings();

  const handleClick = () => {
    playTap();
    vibrate(10);
    navigate(path);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`w-full p-4 rounded-2xl border bg-gradient-to-br ${colorClasses[color]} 
        text-left transition-all duration-300 active:brightness-110`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-card ${iconColors[color]}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}

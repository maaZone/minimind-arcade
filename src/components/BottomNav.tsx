import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Settings, Shield } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const navItems = [
  { path: '/', icon: Home, label: 'Games' },
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/privacy', icon: Shield, label: 'Privacy' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playTap, vibrate } = useSettings();

  const handleNav = (path: string) => {
    playTap();
    vibrate(5);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="bg-card/95 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            
            return (
              <button
                key={path}
                onClick={() => handleNav(path)}
                className="flex flex-col items-center gap-1 py-2 px-4 touch-target"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-colors duration-200 ${
                    isActive 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <span className={`text-xs font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-0 w-12 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

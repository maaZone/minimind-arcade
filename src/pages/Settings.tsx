import { motion } from 'framer-motion';
import { Volume2, VolumeX, Vibrate, Smartphone, Info } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { useSettings } from '@/contexts/SettingsContext';

const Settings = () => {
  const { soundEnabled, vibrationEnabled, toggleSound, toggleVibration, playTap, vibrate } = useSettings();

  const handleToggle = (toggle: () => void) => {
    playTap();
    vibrate(10);
    toggle();
  };

  return (
    <PageContainer title="Settings">
      <div className="px-4 space-y-4">
        {/* Sound Setting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-6 h-6 text-primary" />
              ) : (
                <VolumeX className="w-6 h-6 text-muted-foreground" />
              )}
              <div>
                <div className="font-semibold text-foreground">Sound Effects</div>
                <div className="text-sm text-muted-foreground">Play tap sounds</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle(toggleSound)}
              className={`w-14 h-8 rounded-full transition-colors duration-200 ${
                soundEnabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <motion.div
                animate={{ x: soundEnabled ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-foreground shadow-md"
              />
            </button>
          </div>
        </motion.div>

        {/* Vibration Setting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {vibrationEnabled ? (
                <Vibrate className="w-6 h-6 text-secondary" />
              ) : (
                <Smartphone className="w-6 h-6 text-muted-foreground" />
              )}
              <div>
                <div className="font-semibold text-foreground">Vibration</div>
                <div className="text-sm text-muted-foreground">Haptic feedback</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle(toggleVibration)}
              className={`w-14 h-8 rounded-full transition-colors duration-200 ${
                vibrationEnabled ? 'bg-secondary' : 'bg-muted'
              }`}
            >
              <motion.div
                animate={{ x: vibrationEnabled ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-foreground shadow-md"
              />
            </button>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-accent" />
            <div>
              <div className="font-semibold text-foreground">MiniMind Arcade</div>
              <div className="text-sm text-muted-foreground">Version 1.0.0</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A collection of simple, fun games that work completely offline. 
            No ads, no tracking, no data collection.
          </p>
        </motion.div>

        {/* Footer branding */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">Developed by maaZone</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  toggleSound: () => void;
  toggleVibration: () => void;
  playTap: () => void;
  vibrate: (pattern?: number | number[]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    const saved = localStorage.getItem('vibrationEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('vibrationEnabled', JSON.stringify(vibrationEnabled));
  }, [vibrationEnabled]);

  const toggleSound = () => setSoundEnabled((prev: boolean) => !prev);
  const toggleVibration = () => setVibrationEnabled((prev: boolean) => !prev);

  const playTap = () => {
    if (soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const vibrate = (pattern: number | number[] = 10) => {
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  return (
    <SettingsContext.Provider value={{
      soundEnabled,
      vibrationEnabled,
      toggleSound,
      toggleVibration,
      playTap,
      vibrate,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

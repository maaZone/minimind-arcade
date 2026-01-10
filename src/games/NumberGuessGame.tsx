import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

type Range = '1-50' | '1-100' | '1-200';

const rangeConfig: Record<Range, { max: number; label: string; color: string }> = {
  '1-50': { max: 50, label: 'Easy (1-50)', color: 'text-green-400' },
  '1-100': { max: 100, label: 'Medium (1-100)', color: 'text-yellow-400' },
  '1-200': { max: 200, label: 'Hard (1-200)', color: 'text-red-400' },
};

export function NumberGuessGame() {
  const navigate = useNavigate();
  const { playTap, vibrate } = useSettings();
  const [range, setRange] = useState<Range>('1-100');
  const [showRangeSelect, setShowRangeSelect] = useState(true);
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<{ value: number; hint: 'higher' | 'lower' | 'correct' }[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [bestScore, setBestScore] = useState<number>(Infinity);

  const maxNum = rangeConfig[range].max;

  useEffect(() => {
    const saved = localStorage.getItem(`numberGuessBest_${range}`);
    setBestScore(saved ? parseInt(saved) : Infinity);
  }, [range]);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > maxNum) return;

    playTap();
    vibrate(10);

    let hint: 'higher' | 'lower' | 'correct';
    if (num === target) {
      hint = 'correct';
      setIsWon(true);
      vibrate([50, 50, 50, 50, 100]);
      const newAttempts = attempts.length + 1;
      if (newAttempts < bestScore) {
        setBestScore(newAttempts);
        localStorage.setItem(`numberGuessBest_${range}`, newAttempts.toString());
      }
    } else {
      hint = num < target ? 'higher' : 'lower';
    }

    setAttempts([...attempts, { value: num, hint }]);
    setGuess('');
  };

  const resetGame = () => {
    playTap();
    vibrate(20);
    setTarget(Math.floor(Math.random() * maxNum) + 1);
    setGuess('');
    setAttempts([]);
    setIsWon(false);
  };

  const selectRange = (r: Range) => {
    playTap();
    vibrate(10);
    setRange(r);
    setShowRangeSelect(false);
    setTarget(Math.floor(Math.random() * rangeConfig[r].max) + 1);
    setGuess('');
    setAttempts([]);
    setIsWon(false);
  };

  const changeRange = () => {
    playTap();
    setShowRangeSelect(true);
  };

  const goBack = () => {
    playTap();
    vibrate(5);
    navigate('/');
  };

  const config = rangeConfig[range];

  return (
    <div className="min-h-screen pb-24 safe-top">
      {/* Range Selection */}
      <AnimatePresence>
        {showRangeSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm bg-card rounded-2xl border border-border p-6 text-center"
            >
              <h2 className="font-display text-2xl text-gradient mb-2">Number Guess</h2>
              <p className="text-muted-foreground mb-6">Select Difficulty</p>
              
              <div className="space-y-3">
                {(Object.keys(rangeConfig) as Range[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => selectRange(r)}
                    className="w-full py-4 rounded-xl bg-muted border border-border hover:border-primary/50 transition-colors"
                  >
                    <span className={`font-display text-lg ${rangeConfig[r].color}`}>
                      {rangeConfig[r].label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Guess from 1 to {rangeConfig[r].max}
                    </p>
                  </button>
                ))}
              </div>
              
              <button onClick={goBack} className="mt-4 text-sm text-muted-foreground">
                ← Back to Games
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button onClick={goBack} className="p-2 rounded-xl bg-card touch-target">
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        <div className="text-center">
          <h1 className="font-display text-xl text-gradient">Number Guess</h1>
          <button onClick={changeRange} className={`text-xs ${config.color}`}>
            {config.label} ▾
          </button>
        </div>
        <button onClick={resetGame} className="p-2 rounded-xl bg-card touch-target">
          <RotateCcw className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 px-4 mb-4">
        <div className="text-center p-2 px-4 rounded-xl bg-card">
          <div className="text-xs text-muted-foreground">Attempts</div>
          <div className="font-display text-xl text-accent">{attempts.length}</div>
        </div>
        <div className="text-center p-2 px-4 rounded-xl bg-card">
          <div className="text-xs text-muted-foreground">Best</div>
          <div className="font-display text-xl text-primary">
            {bestScore === Infinity ? '-' : bestScore}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="px-4">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <p className="text-center text-muted-foreground mb-4">
            Guess a number between 1 and {maxNum}
          </p>

          {/* Input */}
          {!isWon && (
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                placeholder={`1-${maxNum}`}
                min="1"
                max={maxNum}
                className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground 
                  text-center font-display text-xl placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleGuess}
                className="px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold"
              >
                Go
              </motion.button>
            </div>
          )}

          {/* Attempts History */}
          {attempts.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {attempts.map((attempt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-3 rounded-xl
                    ${attempt.hint === 'correct' 
                      ? 'bg-neon-green/20 border border-neon-green/30' 
                      : 'bg-muted'
                    }`}
                >
                  <span className="font-display text-lg text-foreground">{attempt.value}</span>
                  <div className="flex items-center gap-2">
                    {attempt.hint === 'higher' && (
                      <>
                        <ArrowUp className="w-5 h-5 text-primary" />
                        <span className="text-sm text-primary">Higher</span>
                      </>
                    )}
                    {attempt.hint === 'lower' && (
                      <>
                        <ArrowDown className="w-5 h-5 text-secondary" />
                        <span className="text-sm text-secondary">Lower</span>
                      </>
                    )}
                    {attempt.hint === 'correct' && (
                      <>
                        <Check className="w-5 h-5 text-neon-green" />
                        <span className="text-sm text-neon-green">Correct!</span>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Win Message */}
        {isWon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-card border border-border text-center"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-display text-xl text-foreground">
              Got it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!
            </div>
            {attempts.length <= bestScore && (
              <div className="text-accent text-sm mt-1">New Best Score!</div>
            )}
            <button
              onClick={resetGame}
              className="mt-3 px-6 py-2 rounded-xl bg-accent text-accent-foreground font-semibold"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

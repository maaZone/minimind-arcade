import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

type GridSize = '4x4' | '5x4' | '6x4';

const allEmojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎻', '🎹', '🎤', '🎧'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const gridConfig: Record<GridSize, { pairs: number; cols: number; label: string; color: string }> = {
  '4x4': { pairs: 8, cols: 4, label: '4×4 Easy', color: 'text-green-400' },
  '5x4': { pairs: 10, cols: 5, label: '5×4 Medium', color: 'text-yellow-400' },
  '6x4': { pairs: 12, cols: 6, label: '6×4 Hard', color: 'text-red-400' },
};

function createCards(pairCount: number): Card[] {
  const emojis = allEmojis.slice(0, pairCount);
  const pairs = [...emojis, ...emojis];
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
}

export function MemoryGame() {
  const navigate = useNavigate();
  const { playTap, vibrate } = useSettings();
  const [gridSize, setGridSize] = useState<GridSize>('4x4');
  const [showGridSelect, setShowGridSelect] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [bestScore, setBestScore] = useState<number>(Infinity);

  const matchedCount = cards.filter(c => c.isMatched).length;
  const isComplete = cards.length > 0 && matchedCount === cards.length;

  useEffect(() => {
    const saved = localStorage.getItem(`memoryBest_${gridSize}`);
    setBestScore(saved ? parseInt(saved) : Infinity);
  }, [gridSize]);

  useEffect(() => {
    if (isComplete && moves < bestScore) {
      setBestScore(moves);
      localStorage.setItem(`memoryBest_${gridSize}`, moves.toString());
    }
  }, [isComplete, moves, bestScore, gridSize]);

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.length >= 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    playTap();
    vibrate(10);

    const newCards = cards.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);
      
      const [first, second] = newFlipped;
      const card1 = newCards.find(c => c.id === first);
      const card2 = newCards.find(c => c.id === second);

      if (card1?.emoji === card2?.emoji) {
        vibrate([30, 50, 30]);
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    playTap();
    vibrate(20);
    setCards(createCards(gridConfig[gridSize].pairs));
    setFlippedCards([]);
    setMoves(0);
    setIsChecking(false);
  };

  const goBack = () => {
    playTap();
    vibrate(5);
    navigate('/');
  };

  const selectGrid = (size: GridSize) => {
    playTap();
    vibrate(10);
    setGridSize(size);
    setShowGridSelect(false);
    setCards(createCards(gridConfig[size].pairs));
    setFlippedCards([]);
    setMoves(0);
  };

  const changeGrid = () => {
    playTap();
    setShowGridSelect(true);
  };

  const config = gridConfig[gridSize];

  return (
    <div className="min-h-screen pb-24 safe-top">
      {/* Grid Size Selection */}
      <AnimatePresence>
        {showGridSelect && (
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
              <h2 className="font-display text-2xl text-gradient mb-2">Memory Match</h2>
              <p className="text-muted-foreground mb-6">Select Grid Size</p>
              
              <div className="space-y-3">
                {(Object.keys(gridConfig) as GridSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => selectGrid(size)}
                    className="w-full py-4 rounded-xl bg-muted border border-border hover:border-primary/50 transition-colors"
                  >
                    <span className={`font-display text-lg ${gridConfig[size].color}`}>
                      {gridConfig[size].label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {gridConfig[size].pairs} pairs to match
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
          <h1 className="font-display text-xl text-gradient">Memory Match</h1>
          <button onClick={changeGrid} className={`text-xs ${config.color}`}>
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
          <div className="text-xs text-muted-foreground">Moves</div>
          <div className="font-display text-xl text-secondary">{moves}</div>
        </div>
        <div className="text-center p-2 px-4 rounded-xl bg-card">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Star className="w-3 h-3" /> Best
          </div>
          <div className="font-display text-xl text-accent">
            {bestScore === Infinity ? '-' : bestScore}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="px-4 flex justify-center">
        <div 
          className="grid gap-2 p-3 bg-card rounded-2xl border border-border"
          style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
        >
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-xl sm:text-2xl flex items-center justify-center
                transition-all duration-300 border-2
                ${card.isFlipped || card.isMatched 
                  ? 'bg-secondary/20 border-secondary/30' 
                  : 'bg-muted border-border'
                }
                ${card.isMatched ? 'opacity-60' : ''}`}
            >
              <AnimatePresence mode="wait">
                {(card.isFlipped || card.isMatched) && (
                  <motion.span
                    initial={{ rotateY: 90, scale: 0.5 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    exit={{ rotateY: -90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.emoji}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Win Message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mx-4 p-4 rounded-2xl bg-card border border-border text-center"
        >
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-display text-xl text-foreground">
            Completed in {moves} moves!
          </div>
          {moves <= bestScore && (
            <div className="text-accent text-sm mt-1">New Best Score!</div>
          )}
          <button
            onClick={resetGame}
            className="mt-3 px-6 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

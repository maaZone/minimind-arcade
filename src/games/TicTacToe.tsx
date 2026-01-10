import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Frown, Handshake, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

type Player = 'X' | 'O' | null;
type Board = Player[];
type Difficulty = 'easy' | 'medium' | 'hard';

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

function checkWinner(board: Board): Player {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function getEmptyCells(board: Board): number[] {
  return board.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
}

// Minimax algorithm for hard difficulty
function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const winner = checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (board.every(cell => cell !== null)) return 0;

  const emptyCells = getEmptyCells(board);
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const cell of emptyCells) {
      board[cell] = 'O';
      bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
      board[cell] = null;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const cell of emptyCells) {
      board[cell] = 'X';
      bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
      board[cell] = null;
    }
    return bestScore;
  }
}

// AI move based on difficulty
function getAIMove(board: Board, difficulty: Difficulty): number {
  const emptyCells = getEmptyCells(board);
  
  if (difficulty === 'easy') {
    // Random move
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  
  if (difficulty === 'medium') {
    // 50% chance optimal, 50% random
    if (Math.random() < 0.5) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    // Try to win
    for (const cell of emptyCells) {
      const testBoard = [...board];
      testBoard[cell] = 'O';
      if (checkWinner(testBoard) === 'O') return cell;
    }
    // Block player
    for (const cell of emptyCells) {
      const testBoard = [...board];
      testBoard[cell] = 'X';
      if (checkWinner(testBoard) === 'X') return cell;
    }
    // Take center or corner
    if (board[4] === null) return 4;
    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  
  // Hard: Use minimax for optimal play
  let bestScore = -Infinity;
  let bestMove = emptyCells[0];
  
  for (const cell of emptyCells) {
    const testBoard = [...board];
    testBoard[cell] = 'O';
    const score = minimax(testBoard, 0, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  }
  
  return bestMove;
}

const difficultyConfig: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'text-green-400' },
  medium: { label: 'Medium', color: 'text-yellow-400' },
  hard: { label: 'Hard', color: 'text-red-400' },
};

export function TicTacToeGame() {
  const navigate = useNavigate();
  const { playTap, vibrate } = useSettings();
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [showResult, setShowResult] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(3);

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);
  const gameOver = winner || isDraw;

  // Show result screen when game ends
  useEffect(() => {
    if (gameOver && !showResult && !showAd) {
      vibrate([50, 50, 50]);
      // Show ad first, then result
      setShowAd(true);
      setAdCountdown(3);
    }
  }, [gameOver, showResult, showAd, vibrate]);

  // Ad countdown timer
  useEffect(() => {
    if (showAd && adCountdown > 0) {
      const timer = setTimeout(() => setAdCountdown(adCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showAd, adCountdown]);

  const closeAd = () => {
    if (adCountdown === 0) {
      playTap();
      setShowAd(false);
      setShowResult(true);
      if (winner === 'X') {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (winner === 'O') {
        setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
      }
    }
  };

  // AI move
  const makeAIMove = useCallback((currentBoard: Board) => {
    const aiMove = getAIMove(currentBoard, difficulty);
    if (aiMove !== -1 && aiMove !== undefined) {
      const newBoard = [...currentBoard];
      newBoard[aiMove] = 'O';
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  }, [difficulty]);

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => {
        makeAIMove(board);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, gameOver, makeAIMove]);

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameOver) return;

    playTap();
    vibrate(10);

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const resetGame = () => {
    playTap();
    vibrate(20);
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setShowResult(false);
    setShowAd(false);
  };

  const goBack = () => {
    playTap();
    vibrate(5);
    navigate('/');
  };

  const getResultInfo = () => {
    if (winner === 'X') {
      return { icon: Trophy, text: 'You Win!', color: 'text-primary', bgColor: 'bg-primary/20' };
    } else if (winner === 'O') {
      return { icon: Frown, text: 'You Lose!', color: 'text-destructive', bgColor: 'bg-destructive/20' };
    }
    return { icon: Handshake, text: 'Draw!', color: 'text-muted-foreground', bgColor: 'bg-muted' };
  };

  const resultInfo = getResultInfo();

  const selectDifficulty = (diff: Difficulty) => {
    playTap();
    vibrate(10);
    setDifficulty(diff);
    setShowDifficultySelect(false);
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setScores({ player: 0, ai: 0 });
  };

  const changeDifficulty = () => {
    playTap();
    setShowDifficultySelect(true);
  };

  return (
    <div className="min-h-screen pb-24 safe-top">
      {/* Difficulty Selection */}
      <AnimatePresence>
        {showDifficultySelect && (
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
              <h2 className="font-display text-2xl text-gradient mb-2">Tic Tac Toe</h2>
              <p className="text-muted-foreground mb-6">Select Difficulty</p>
              
              <div className="space-y-3">
                {(Object.keys(difficultyConfig) as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => selectDifficulty(diff)}
                    className="w-full py-4 rounded-xl bg-muted border border-border hover:border-primary/50 transition-colors"
                  >
                    <span className={`font-display text-lg ${difficultyConfig[diff].color}`}>
                      {difficultyConfig[diff].label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {diff === 'easy' && 'Random moves - Great for beginners'}
                      {diff === 'medium' && 'Mixed strategy - Balanced challenge'}
                      {diff === 'hard' && 'Optimal play - Unbeatable AI'}
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
          <h1 className="font-display text-xl text-gradient">Tic Tac Toe</h1>
          <button onClick={changeDifficulty} className={`text-xs ${difficultyConfig[difficulty].color}`}>
            {difficultyConfig[difficulty].label} Mode ▾
          </button>
        </div>
        <button onClick={resetGame} className="p-2 rounded-xl bg-card touch-target">
          <RotateCcw className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Scoreboard */}
      <div className="flex justify-center gap-8 px-4 mb-6">
        <div className={`text-center p-3 rounded-xl ${isPlayerTurn && !gameOver ? 'bg-primary/20 border border-primary/30' : 'bg-card'}`}>
          <div className="font-display text-lg text-primary">You (X)</div>
          <div className="text-lg font-semibold text-foreground">{scores.player}</div>
        </div>
        <div className={`text-center p-3 rounded-xl ${!isPlayerTurn && !gameOver ? 'bg-secondary/20 border border-secondary/30' : 'bg-card'}`}>
          <div className="font-display text-lg text-secondary">AI (O)</div>
          <div className="text-lg font-semibold text-foreground">{scores.ai}</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="px-4 flex justify-center">
        <div className="grid grid-cols-3 gap-3 p-4 bg-card rounded-2xl border border-border">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(index)}
              disabled={!isPlayerTurn || !!gameOver}
              className={`w-20 h-20 rounded-xl font-display text-4xl flex items-center justify-center
                transition-all duration-200 border-2
                ${cell ? 'bg-muted' : 'bg-card border-border hover:border-primary/50'}
                ${cell === 'X' ? 'text-primary border-primary/30' : ''}
                ${cell === 'O' ? 'text-secondary border-secondary/30' : ''}
                ${!isPlayerTurn && !gameOver ? 'cursor-wait' : ''}`}
            >
              {cell && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {cell}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Turn indicator */}
      {!gameOver && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isPlayerTurn ? "Your turn" : "AI is thinking..."}
        </div>
      )}

      {/* Interstitial Ad Overlay */}
      <AnimatePresence>
        {showAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-sm bg-card rounded-2xl border border-border p-6 text-center">
              <div className="text-xs text-muted-foreground mb-2">ADVERTISEMENT</div>
              <div className="h-40 bg-muted rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎮</div>
                  <div className="text-sm text-muted-foreground">Ad Placeholder</div>
                  <div className="text-xs text-muted-foreground mt-1">Offline Mode</div>
                </div>
              </div>
              <button
                onClick={closeAd}
                disabled={adCountdown > 0}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  adCountdown > 0 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {adCountdown > 0 ? `Continue in ${adCountdown}s` : 'Continue'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Screen Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-sm bg-card rounded-2xl border border-border p-6 text-center"
            >
              <button 
                onClick={resetGame}
                className="absolute top-4 right-4 p-2 rounded-xl bg-muted"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <div className={`w-20 h-20 mx-auto rounded-full ${resultInfo.bgColor} flex items-center justify-center mb-4`}>
                <resultInfo.icon className={`w-10 h-10 ${resultInfo.color}`} />
              </div>
              
              <h2 className={`font-display text-3xl ${resultInfo.color} mb-2`}>
                {resultInfo.text}
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {winner === 'X' ? "Great job! You beat the AI!" : winner === 'O' ? "The AI won this round. Try again!" : "It's a tie! Well played!"}
              </p>

              <div className="flex gap-3 mb-4">
                <div className="flex-1 p-3 rounded-xl bg-primary/10">
                  <div className="text-2xl font-bold text-primary">{scores.player}</div>
                  <div className="text-xs text-muted-foreground">Your Wins</div>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-secondary/10">
                  <div className="text-2xl font-bold text-secondary">{scores.ai}</div>
                  <div className="text-xs text-muted-foreground">AI Wins</div>
                </div>
              </div>
              
              <button
                onClick={resetGame}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

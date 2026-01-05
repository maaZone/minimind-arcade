import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';

type Player = 'X' | 'O' | null;
type Board = Player[];

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

export function TicTacToeGame() {
  const navigate = useNavigate();
  const { playTap, vibrate } = useSettings();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    playTap();
    vibrate(10);

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      vibrate([50, 50, 50]);
      setScores(prev => ({ ...prev, [newWinner]: prev[newWinner] + 1 }));
    }

    setIsXTurn(!isXTurn);
  };

  const resetGame = () => {
    playTap();
    vibrate(20);
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  };

  const goBack = () => {
    playTap();
    vibrate(5);
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24 safe-top">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button onClick={goBack} className="p-2 rounded-xl bg-card touch-target">
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        <h1 className="font-display text-xl text-gradient">Tic Tac Toe</h1>
        <button onClick={resetGame} className="p-2 rounded-xl bg-card touch-target">
          <RotateCcw className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>

      {/* Scoreboard */}
      <div className="flex justify-center gap-8 px-4 mb-6">
        <div className={`text-center p-3 rounded-xl ${isXTurn && !winner ? 'bg-primary/20 border border-primary/30' : 'bg-card'}`}>
          <div className="font-display text-2xl text-primary">X</div>
          <div className="text-lg font-semibold text-foreground">{scores.X}</div>
        </div>
        <div className={`text-center p-3 rounded-xl ${!isXTurn && !winner ? 'bg-secondary/20 border border-secondary/30' : 'bg-card'}`}>
          <div className="font-display text-2xl text-secondary">O</div>
          <div className="text-lg font-semibold text-foreground">{scores.O}</div>
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
              className={`w-20 h-20 rounded-xl font-display text-4xl flex items-center justify-center
                transition-all duration-200 border-2
                ${cell ? 'bg-muted' : 'bg-card border-border hover:border-primary/50'}
                ${cell === 'X' ? 'text-primary border-primary/30' : ''}
                ${cell === 'O' ? 'text-secondary border-secondary/30' : ''}`}
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

      {/* Status */}
      {(winner || isDraw) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mx-4 p-4 rounded-2xl bg-card border border-border text-center"
        >
          {winner ? (
            <div className="flex items-center justify-center gap-2">
              <Trophy className={`w-6 h-6 ${winner === 'X' ? 'text-primary' : 'text-secondary'}`} />
              <span className="font-display text-xl text-foreground">
                Player {winner} wins!
              </span>
            </div>
          ) : (
            <span className="font-display text-xl text-muted-foreground">It's a draw!</span>
          )}
          <button
            onClick={resetGame}
            className="mt-3 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

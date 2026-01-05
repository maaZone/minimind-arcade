import { Grid3X3, Brain, Target } from 'lucide-react';
import { GameCard } from '@/components/GameCard';
import { PageContainer } from '@/components/PageContainer';

const games = [
  {
    title: 'Tic Tac Toe',
    description: 'Classic X vs O battle',
    icon: Grid3X3,
    path: '/games/tictactoe',
    color: 'cyan' as const,
  },
  {
    title: 'Memory Match',
    description: 'Find all matching pairs',
    icon: Brain,
    path: '/games/memory',
    color: 'magenta' as const,
  },
  {
    title: 'Number Guess',
    description: 'Guess the secret number',
    icon: Target,
    path: '/games/number',
    color: 'yellow' as const,
  },
];

const Index = () => {
  return (
    <PageContainer title="MiniMind Arcade">
      <div className="px-4 space-y-3">
        {games.map((game, index) => (
          <GameCard
            key={game.path}
            {...game}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Footer branding */}
      <div className="px-4 mt-6 mb-4 text-center">
        <p className="text-xs text-muted-foreground">Developed by maaZone</p>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </PageContainer>
  );
};

export default Index;

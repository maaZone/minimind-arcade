import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen pb-24 safe-top"
    >
      {title && (
        <header className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-display text-gradient">{title}</h1>
        </header>
      )}
      {children}
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';

const policies = [
  {
    icon: Lock,
    title: 'No Data Collection',
    description: 'We do not collect, store, or transmit any personal data. Your privacy is absolute.',
    color: 'text-primary',
  },
  {
    icon: Eye,
    title: 'No Tracking',
    description: 'We do not use analytics, tracking cookies, or any form of user monitoring.',
    color: 'text-secondary',
  },
  {
    icon: Server,
    title: 'Fully Offline',
    description: 'This app works entirely offline. No internet connection is required or used.',
    color: 'text-accent',
  },
];

const Privacy = () => {
  return (
    <PageContainer title="Privacy Policy">
      <div className="px-4 space-y-4">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-8 h-8 text-primary" />
            <h2 className="font-display text-lg text-foreground">Your Privacy Matters</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            MiniMind Arcade is designed with privacy as a core principle. 
            We believe games should be fun without compromising your privacy.
          </p>
        </motion.div>

        {/* Policy Items */}
        {policies.map((policy, index) => (
          <motion.div
            key={policy.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 1) * 0.1 }}
            className="p-4 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-start gap-3">
              <policy.icon className={`w-6 h-6 ${policy.color} flex-shrink-0 mt-0.5`} />
              <div>
                <div className="font-semibold text-foreground mb-1">{policy.title}</div>
                <p className="text-sm text-muted-foreground">{policy.description}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Local Storage Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-2xl bg-muted border border-border"
        >
          <h3 className="font-semibold text-foreground mb-2">Local Storage</h3>
          <p className="text-sm text-muted-foreground">
            Your game scores and settings are stored locally on your device using browser storage. 
            This data never leaves your device and can be cleared at any time through your browser settings.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-2xl bg-card border border-border text-center"
        >
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
          <p className="text-xs text-muted-foreground mt-2">Developed by maaZone</p>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Privacy;

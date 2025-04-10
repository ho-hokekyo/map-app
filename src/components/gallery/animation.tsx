'use client';
import { motion } from 'framer-motion';

export const FadeUpAnimation = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            variants={{
                hidden: { y: 100, opacity: 0 },
                show: { y: 0, opacity: 1 },
            }}
            initial="hidden"
            animate="show"
        >
            {children}
        </motion.div>
    );
};

export const FadeInAnimation = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {children}
        </motion.div>
    );
};

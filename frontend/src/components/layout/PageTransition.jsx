import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94], // Smooth cubic bezier
      staggerChildren: 0.08,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.99,
    filter: 'blur(2px)',
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="will-change-[transform,opacity,filter]"
        style={{ transformOrigin: 'center top' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    }
  }
};

export function AnimatedCard({ children, className, delay = 0, ...props }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedContainer({ children, className, ...props }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className, ...props }) {
  return (
    <motion.div
      variants={cardVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { cardVariants, containerVariants };

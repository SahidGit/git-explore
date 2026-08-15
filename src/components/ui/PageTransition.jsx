import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const transition = { duration: 0.18, ease: 'easeInOut' };

/** Wraps each route in a subtle fade+slide transition */
const PageTransition = ({ children }) => (
  <motion.div
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={transition}
  >
    {children}
  </motion.div>
);

export default PageTransition;

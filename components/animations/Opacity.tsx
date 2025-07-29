"use client";
import { motion } from "motion/react";

import { ReactNode } from "react";

const OpacityAnimate = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className || ''}
      transition={{
        duration: 0.5
      }}
    >
        {children}
    </motion.div>
  );
};

export default OpacityAnimate;

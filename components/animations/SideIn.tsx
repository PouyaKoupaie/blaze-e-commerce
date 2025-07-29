"use client";

import { ReactNode } from "react";
import { motion, Transition } from "motion/react";

const SideIn = ({
  children,
  className,
  side,
}: {
  children: ReactNode;
  className?: string;
  side: "left" | "right" | "top" | "bottom";
}) => {
  const initialPosition = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    top: { x: 0, y: -100 },
    bottom: { x: 0, y: 100 },
  };

  const animatePosition = { x: 0, y: 0 };

  const transitionProps: Transition = {
    type: "spring", // You can experiment with different types like 'tween', 'just', 'keyframes'
    damping: 10,
    stiffness: 100,
    duration:0.5
    // Add other transition properties as needed, e.g., duration, delay
  };
  return (
    <motion.div
      className={className || ""}
      initial={initialPosition[side]}
      animate={animatePosition}
      transition={transitionProps}
    >
      {children}
    </motion.div>
  );
};

export default SideIn;

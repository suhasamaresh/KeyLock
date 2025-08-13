"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CustomCursorProps = {
  stroke: string;
  bgcolor: string;
};

const CustomCursor = ({ stroke, bgcolor }: CustomCursorProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const springX = useSpring(x, { stiffness: 1000, damping: 50 });
  const springY = useSpring(y, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true); 
    };

    const hideCursor = () => setIsVisible(false);
    const showCursor = () => setIsVisible(true);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || 
          e.clientX >= window.innerWidth || 
          e.clientY >= window.innerHeight) {
        setIsVisible(false);
      }
    };

    const startHover = () => setIsHovering(true);
    const endHover = () => setIsHovering(false);

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", showCursor);
    document.body.addEventListener("mouseleave", hideCursor);
    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) {
        setIsVisible(false);
      }
    });
    const addHoverListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach((el) => {
        el.addEventListener("mouseenter", startHover);
        el.addEventListener("mouseleave", endHover);
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(() => {
      addHoverListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", showCursor);
      document.body.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("mouseout", hideCursor);
      
      document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach((el) => {
        el.removeEventListener("mouseenter", startHover);
        el.removeEventListener("mouseleave", endHover);
      });
      
      observer.disconnect();
    };
  }, [x, y]);

  if (!isVisible) return null;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      stroke={stroke}
      strokeWidth={1}
      strokeLinecap="square"
      strokeLinejoin="miter"
      fill="none"
      color={bgcolor}
      style={{
        position: "fixed",
        left: springX,
        top: springY,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
      animate={{
        scale: isHovering ? 1.5 : 1, 
        opacity: isVisible ? 1 : 0, 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <polygon points="7 20 7 4 19 16 12 16 7 21" />
    </motion.svg>
  );
};

export default CustomCursor;
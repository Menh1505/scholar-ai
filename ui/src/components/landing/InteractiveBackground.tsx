"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Globe, Plane, MapPin, Trophy, Users, Brain, School, Briefcase, Star, Heart, Lightbulb, Target, Rocket } from "lucide-react";

const studyIcons = [GraduationCap, BookOpen, Globe, Plane, MapPin, Trophy, Users, Brain, School, Briefcase, Star, Heart, Lightbulb, Target, Rocket];

interface FloatingIcon {
  id: number;
  Icon: any;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  speed: number;
  direction: number;
}

const colors = [
  "text-blue-400/30",
  "text-green-400/30",
  "text-purple-400/30",
  "text-pink-400/30",
  "text-yellow-400/30",
  "text-indigo-400/30",
  "text-red-400/30",
  "text-teal-400/30",
];

export default function InteractiveBackground() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  // Initialize floating icons
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    const initialIcons: FloatingIcon[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      Icon: studyIcons[i % studyIcons.length],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 1,
      direction: Math.random() * Math.PI * 2,
    }));

    setIcons(initialIcons);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate icons
  useEffect(() => {
    const interval = setInterval(() => {
      setIcons((prevIcons) =>
        prevIcons.map((icon) => {
          let newX = icon.x + Math.cos(icon.direction) * icon.speed;
          let newY = icon.y + Math.sin(icon.direction) * icon.speed;
          let newDirection = icon.direction;

          // Bounce off walls
          if (newX <= 0 || newX >= windowSize.width - 50) {
            newDirection = Math.PI - icon.direction;
          }
          if (newY <= 0 || newY >= windowSize.height - 50) {
            newDirection = -icon.direction;
          }

          // Keep within bounds
          newX = Math.max(0, Math.min(windowSize.width - 50, newX));
          newY = Math.max(0, Math.min(windowSize.height - 50, newY));

          return {
            ...icon,
            x: newX,
            y: newY,
            direction: newDirection,
            rotation: icon.rotation + icon.speed,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [windowSize]);

  // Handle icon click
  const handleIconClick = useCallback((iconId: number) => {
    setIcons((prevIcons) =>
      prevIcons.map((icon) =>
        icon.id === iconId
          ? {
              ...icon,
              scale: 1.5,
              color: colors[Math.floor(Math.random() * colors.length)],
            }
          : icon
      )
    );

    // Reset scale after animation
    setTimeout(() => {
      setIcons((prevIcons) => prevIcons.map((icon) => (icon.id === iconId ? { ...icon, scale: 0.5 + Math.random() * 0.8 } : icon)));
    }, 300);
  }, []);

  // Calculate mouse repulsion effect
  const getRepulsionEffect = (iconX: number, iconY: number) => {
    const distance = Math.sqrt(Math.pow(mousePos.x - iconX, 2) + Math.pow(mousePos.y - iconY, 2));

    if (distance < 100) {
      const force = (100 - distance) / 100;
      const angle = Math.atan2(iconY - mousePos.y, iconX - mousePos.x);
      return {
        x: Math.cos(angle) * force * 20,
        y: Math.sin(angle) * force * 20,
      };
    }
    return { x: 0, y: 0 };
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/20 to-pink-50/20" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            animate={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Interactive study icons */}
      <AnimatePresence>
        {icons.map((icon) => {
          const repulsion = getRepulsionEffect(icon.x, icon.y);
          return (
            <motion.div
              key={icon.id}
              className={`absolute pointer-events-auto cursor-pointer ${icon.color} hover:text-primary/60 transition-colors duration-300`}
              style={{
                left: icon.x + repulsion.x,
                top: icon.y + repulsion.y,
              }}
              animate={{
                rotate: icon.rotation,
                scale: icon.scale,
                opacity: 1,
              }}
              whileHover={{
                scale: icon.scale * 1.3,
                rotate: icon.rotation + 180,
                transition: { duration: 0.3 },
              }}
              whileTap={{
                scale: icon.scale * 1.8,
                rotate: icon.rotation + 360,
                transition: { duration: 0.2 },
              }}
              onClick={() => handleIconClick(icon.id)}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.1,
                ease: "easeOut",
              }}>
              <icon.Icon size={32} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Mouse follower effect */}
      <motion.div
        className="absolute w-20 h-20 border border-primary/20 rounded-full pointer-events-none"
        animate={{
          x: mousePos.x - 40,
          y: mousePos.y - 40,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
      />

      {/* Pulsing rings around mouse */}
      <motion.div
        className="absolute w-32 h-32 border border-primary/10 rounded-full pointer-events-none"
        animate={{
          x: mousePos.x - 64,
          y: mousePos.y - 64,
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

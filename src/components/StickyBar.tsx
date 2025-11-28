"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

export const StickyBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show bar after scrolling past 600px
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 py-4 px-4"
        >
          <div className="glass-panel rounded-full mx-auto max-w-4xl flex items-center justify-between px-6 py-3 shadow-lg">
            <div className="font-serif font-bold text-xl text-medical-navy tracking-tight hidden sm:block">
              TirzepaLife
            </div>
            
            <div className="flex items-center gap-4 ml-auto sm:ml-0">
               <div className="text-sm text-gray-600 hidden md:block font-medium">
                 A revolução Twincretin
               </div>
               <Button onClick={scrollToForm} size="sm" className="shadow-none">
                 Falar com Especialista
               </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
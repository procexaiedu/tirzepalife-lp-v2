"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { useChat } from "@/context/ChatContext";

export const StickyBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { openChat } = useChat();

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
          <div className="glass-panel rounded-full mx-auto w-fit sm:w-full max-w-4xl flex items-center justify-center sm:justify-between px-3 py-2 sm:px-6 sm:py-3 shadow-lg">
            <div className="font-serif font-bold text-xl text-medical-navy tracking-tight hidden sm:block">
              TirzepaLife
            </div>
            
            <div className="flex items-center gap-4">
               <div className="text-sm text-gray-600 hidden md:block font-medium flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                 </span>
                 Especialista online agora
               </div>
               <Button onClick={openChat} className="shadow-none font-bold group">
                 <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                 FALAR AGORA
               </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
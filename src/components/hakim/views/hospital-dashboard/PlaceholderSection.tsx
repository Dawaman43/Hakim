"use client";

import { motion } from "framer-motion";

interface PlaceholderSectionProps {
  darkMode: boolean;
  title: string;
  description: string;
}

export function PlaceholderSection({ darkMode, title, description }: PlaceholderSectionProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${darkMode ? "bg-background" : "bg-background"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-foreground" : "text-foreground"}`}>{title}</h3>
        <p className={darkMode ? "text-muted-foreground" : "text-muted-foreground"}>{description}</p>
      </div>
    </motion.div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useHakimViewContext } from "./context/hakim-view-context";
import { PublicViews } from "./renderers/public-views";
import { AdminViews } from "./renderers/admin-views";
import { HospitalViews } from "./renderers/hospital-views";

export function HakimViewRenderer() {
  const { publicProps, adminProps, hospitalProps } = useHakimViewContext();
  const view = publicProps.view;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <PublicViews {...publicProps} />
        <AdminViews {...adminProps} />
        <HospitalViews {...hospitalProps} />
      </motion.div>
    </AnimatePresence>
  );
}

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
    <>
      <PublicViews {...publicProps} />
      <AdminViews {...adminProps} />
      <HospitalViews {...hospitalProps} />
    </>
  );
}

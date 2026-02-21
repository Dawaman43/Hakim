"use client";

import { createContext, useContext } from "react";
import type { HakimViewRendererProps } from "../renderers/types";

const HakimViewContext = createContext<HakimViewRendererProps | null>(null);

export function HakimViewProvider({
  value,
  children,
}: {
  value: HakimViewRendererProps;
  children: React.ReactNode;
}) {
  return <HakimViewContext.Provider value={value}>{children}</HakimViewContext.Provider>;
}

export function useHakimViewContext() {
  const ctx = useContext(HakimViewContext);
  if (!ctx) {
    throw new Error("useHakimViewContext must be used within HakimViewProvider");
  }
  return ctx;
}

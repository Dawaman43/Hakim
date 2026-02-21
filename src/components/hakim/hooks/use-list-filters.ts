"use client";

import { useState } from "react";

export function useListFilters() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("All Regions");

  return {
    viewMode,
    setViewMode,
    facilityTypeFilter,
    setFacilityTypeFilter,
    searchTerm,
    setSearchTerm,
    regionFilter,
    setRegionFilter,
  };
}

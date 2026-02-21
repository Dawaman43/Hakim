"use client";

import { useState } from "react";

export function usePagination(defaultPageSize = 24) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  return { page, setPage, pageSize, setPageSize };
}

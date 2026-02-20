/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LeafletMap = dynamic(
  () => import("./MapInternal"),
  { ssr: false }
);

export default function MapView({ items }: { items: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <LeafletMap items={items} />;
}

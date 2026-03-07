"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { MapItem } from "./MapInternal";

export type { MapItem };

const LeafletMap = dynamic(
  () => import("./MapInternal"),
  { ssr: false }
);

export default function MapView({ items }: { items: MapItem[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <LeafletMap items={items} />;
}

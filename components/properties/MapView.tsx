"use client";

import dynamic from "next/dynamic";
import type { MapItem } from "./MapInternal";

export type { MapItem };

const LeafletMap = dynamic(
  () => import("./MapInternal"),
  { ssr: false }
);

export default function MapView({ items }: { items: MapItem[] }) {
  return <LeafletMap items={items} />;
}

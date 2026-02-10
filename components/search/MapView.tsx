/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Property } from "@/types/Property";


export default function MapView({ selected }: { selected: Property | null }) {
  const center = selected
    ? [selected.lat, selected.lng]
    : [6.9271, 79.8612];

  return (
    <MapContainer center={center as any} zoom={13} className="h-full w-full">
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selected && (
        <Marker position={[selected.lat, selected.lng]}>
          <Popup>{selected.title}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

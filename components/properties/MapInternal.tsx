/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

export default function MapInternal({
  items,
}: {
  items: any[];
}) {
  return (
    <MapContainer
      center={[6.9271, 79.8612]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {items.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
        >
          <Popup>
            <div>
              <strong>{item.title}</strong>
              <br />
              ${item.price} / night
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

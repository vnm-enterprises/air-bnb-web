"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

export type MapItem = {
  id: number;
  title: string;
  price: number;
  lat: number;
  lng: number;
};

export default function MapInternal({
  items,
}: {
  items: MapItem[];
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

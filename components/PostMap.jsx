"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#B5654A;border:2px solid #FBF8F1;transform:rotate(-45deg);box-shadow:0 2px 4px rgba(62,46,34,0.4);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

export default function PostMap({ latitude, longitude, locationName }) {
  return (
    <div className="mt-8 h-48 w-full overflow-hidden rounded-md border border-ink-soft/20">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={false}
        dragging={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={pinIcon}>
          {locationName && <Popup>{locationName}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}

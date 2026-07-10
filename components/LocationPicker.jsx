"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#B5654A;border:2px solid #FBF8F1;transform:rotate(-45deg);box-shadow:0 2px 4px rgba(62,46,34,0.4);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ latitude, longitude, onChange }) {
  const [position, setPosition] = useState(
    latitude && longitude ? [latitude, longitude] : null
  );

  function handlePick(lat, lng) {
    setPosition([lat, lng]);
    onChange(lat, lng);
  }

  function handleClear() {
    setPosition(null);
    onChange(null, null);
  }

  const center = position || [-2.5489, 118.0149]; // tengah Indonesia, default

  return (
    <div>
      <div className="h-56 w-full overflow-hidden rounded-md border border-ink-soft/30">
        <MapContainer
          center={center}
          zoom={position ? 12 : 4.5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={handlePick} />
          {position && <Marker position={position} icon={pinIcon} />}
        </MapContainer>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-ink-soft">
          {position ? `${position[0].toFixed(4)}, ${position[1].toFixed(4)}` : "Klik peta untuk menandai lokasi (opsional)"}
        </p>
        {position && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-clay-dark hover:underline"
          >
            Hapus lokasi
          </button>
        )}
      </div>
    </div>
  );
}

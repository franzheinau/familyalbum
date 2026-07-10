"use client";

import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#B5654A;border:2px solid #FBF8F1;transform:rotate(-45deg);box-shadow:0 2px 4px rgba(62,46,34,0.4);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

export default function AllMemoriesMap({ posts }) {
  const center =
    posts.length > 0 ? [posts[0].latitude, posts[0].longitude] : [-2.5489, 118.0149];

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-md border border-ink-soft/20">
      <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {posts.map((post) => (
          <Marker key={post.id} position={[post.latitude, post.longitude]} icon={pinIcon}>
            <Popup>
              <Link href={`/post/${post.id}`} className="font-medium">
                {post.title}
              </Link>
              <br />
              {post.locationName}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

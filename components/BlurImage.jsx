"use client";

import { useState } from "react";
import Image from "next/image";

export default function BlurImage({ src, alt, fill, sizes, className = "", priority = false }) {
  const [loaded, setLoaded] = useState(false);
  const blurSrc = `${src}${src.includes("?") ? "&" : "?"}tr=bl-20,q-10`;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-110 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url(${blurSrc})`, opacity: loaded ? 0 : 1 }}
      />
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

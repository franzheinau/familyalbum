"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("cari") || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("cari", value);
      else params.delete("cari");
      router.push(`/?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Cari judul kenangan..."
      className="mx-auto block w-full max-w-sm rounded-full border border-ink-soft/30 bg-cream px-4 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay"
    />
  );
}

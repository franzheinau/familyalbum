"use client";

import { useState, useEffect } from "react";

export default function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("liked-posts") || "[]");
    setLiked(likedPosts.includes(postId));
  }, [postId]);

  async function handleLike() {
    if (liked) return;
    setAnimating(true);
    setLiked(true);
    setLikes((n) => n + 1);

    const likedPosts = JSON.parse(localStorage.getItem("liked-posts") || "[]");
    localStorage.setItem("liked-posts", JSON.stringify([...likedPosts, postId]));

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      }
    } catch {
      // biarkan optimistic update tetap tampil meski request gagal
    }

    setTimeout(() => setAnimating(false), 300);
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked}
      className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition ${
        liked
          ? "border-clay bg-clay/10 text-clay-dark"
          : "border-ink-soft/30 text-ink-soft hover:border-clay hover:text-clay-dark"
      }`}
    >
      <span className={`inline-block transition-transform ${animating ? "scale-125" : "scale-100"}`}>
        {liked ? "❤️" : "🤍"}
      </span>
      {likes > 0 ? likes : ""} {liked ? "Disukai" : "Suka"}
    </button>
  );
}

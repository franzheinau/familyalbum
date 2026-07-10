import Link from "next/link";
import BlurImage from "./BlurImage";

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0"];
const TAPE_COLORS = ["bg-clay", "bg-mustard"];

function formatDate(dateStr) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default function PhotoCard({ post, index }) {
  const tilt = TILTS[index % TILTS.length];
  const tape = TAPE_COLORS[index % TAPE_COLORS.length];
  const tapeSide = index % 2 === 0 ? "-left-4" : "-right-4";
  const cover = post.photos[0];

  return (
    <Link
      href={`/post/${post.id}`}
      className={`polaroid group block w-full ${tilt} animate-fade-up focus:outline-none`}
      style={{ animationDelay: `${(index % 8) * 60}ms` }}
    >
      <span
        className={`washi-tape ${tape} ${tapeSide} -top-3 rotate-[-8deg]`}
        aria-hidden="true"
      />
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper">
        {cover ? (
          <BlurImage
            src={cover.url}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft/50">
            Tidak ada foto
          </div>
        )}
        {post.photos.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream font-body">
            +{post.photos.length - 1}
          </span>
        )}
      </div>
      <div className="mt-3 px-1">
        <p className="font-display text-lg leading-tight text-ink truncate">{post.title}</p>
        <p className="polaroid-caption text-xs mt-1">
          {formatDate(post.eventDate)}
          {post.likes > 0 ? ` · ❤️ ${post.likes}` : ""}
        </p>
      </div>
    </Link>
  );
}

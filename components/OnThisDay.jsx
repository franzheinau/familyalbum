import Link from "next/link";
import BlurImage from "./BlurImage";

export default function OnThisDay({ post, yearsAgo }) {
  const cover = post.photos[0];
  return (
    <Link
      href={`/post/${post.id}`}
      className="mx-auto mb-10 flex max-w-md items-center gap-4 rounded-lg border border-mustard/40 bg-paper/60 p-3 pr-5 transition hover:border-mustard hover:bg-paper"
    >
      <div className="relative h-16 w-16 shrink-0 -rotate-3 overflow-hidden rounded-md shadow-polaroid">
        {cover && <BlurImage src={cover.url} alt={post.title} fill sizes="64px" className="object-cover" />}
      </div>
      <div className="min-w-0">
        <p className="polaroid-caption text-xs text-clay-dark">{yearsAgo} tahun lalu, hari ini</p>
        <p className="truncate font-display text-base text-ink">{post.title}</p>
      </div>
    </Link>
  );
}

import Link from "next/link";
import BlurImage from "./BlurImage";

function formatDate(dateStr) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default function TimelineView({ posts }) {
  let lastYear = null;

  return (
    <div className="relative mx-auto max-w-2xl px-6 pb-24">
      <div className="absolute bottom-0 left-6 top-0 w-px bg-ink-soft/20 sm:left-1/2" />

      {posts.map((post, index) => {
        const year = new Date(post.eventDate).getFullYear();
        const showYearMarker = year !== lastYear;
        lastYear = year;
        const cover = post.photos[0];
        const alignRight = index % 2 === 1;

        return (
          <div key={post.id}>
            {showYearMarker && (
              <div className="relative mb-8 mt-14 flex items-center first:mt-0 sm:justify-center">
                <span className="relative z-10 rounded-full bg-clay px-4 py-1 font-display text-lg italic text-cream">
                  {year}
                </span>
              </div>
            )}

            <div
              className={`relative mb-10 flex items-start gap-4 sm:mb-14 ${
                alignRight ? "sm:flex-row-reverse sm:text-right" : ""
              }`}
            >
              <span className="absolute left-6 top-2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-clay sm:left-1/2" />

              <Link
                href={`/post/${post.id}`}
                className={`polaroid ml-12 block w-full max-w-xs sm:ml-0 sm:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
                  {cover && (
                    <BlurImage
                      src={cover.url}
                      alt={post.title}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="mt-3 px-1">
                  <p className="font-display text-lg leading-tight text-ink">{post.title}</p>
                  <p className="polaroid-caption text-xs mt-1">{formatDate(post.eventDate)}</p>
                </div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

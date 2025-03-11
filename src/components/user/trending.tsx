import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatNumber } from "@/functions/format-number";

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
      SELECT LOWER(hashtags[1]) AS hashtag, COUNT(*) AS count
      FROM (
          SELECT regexp_matches(content, '#[[:alnum:]_]+', 'g') AS hashtags
          FROM posts
      ) sub
      GROUP BY hashtag
      ORDER BY count DESC, hashtag ASC
      LIMIT 3
    `;

    return result.map((row) => ({
      hashtag: row.hashtag.startsWith("#") ? row.hashtag : `#${row.hashtag}`,
      count: Number(row.count),
    }));
  },
  [`trending_topics_${Math.floor(Date.now() / (3 * 60 * 60 * 1000))}`],
  { revalidate: 3 * 60 * 60 }
);

export async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="hidden md:block space-y-2 mt-5 rounded-2xl shadow-sm border p-2 min-h-32 py-5 px-4">
      <div className="text-xl">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.replace("#", ""); 

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block px-3 py-1 rounded-lg">
            <p className="line-clamp-1 break-all text-sm font-semibold hover:underline" title={hashtag}>
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
            {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

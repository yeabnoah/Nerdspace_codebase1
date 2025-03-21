import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const communities = [
  {
    name: "Marvel Gamers",
    slug: "web-dev",
    members: 12000,
    image: "/game.jpg",
  },

  {
    name: "Render Network",
    slug: "crypto",
    members: 7300,
    image: "/logo.jpg",
  },
  {
    name: "SHIB Designers",
    slug: "ui-ux",
    members: 5600,
    image: "/hu.webp",
  },
];

export default function CommunitiesList() {
  return (
    <Card className="hidden min-h-32 rounded-2xl border border-gray-100 shadow-none dark:border-gray-500/5 bg-transparent pt-4  md:block">
      <h2 className="mb-3 px-6 font-instrument italic text-2xl text-textAlternative dark:text-white">
        Communities to join
      </h2>
      <CardContent className="flex flex-col">
        {communities.map(({ name, slug, members, image }) => (
          <Link
            key={slug}
            href={`/community/${slug}`}
            className="flex flex-row items-center gap-2 rounded-lg py-2 transition hover:bg-muted"
          >
            <img
              src={image}
              alt={`${name} image`}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium hover:underline" title={name}>
                {name}
              </p>
              <p className="text-xs text-muted-foreground">
                {members.toLocaleString()} members
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const communities = [
  {
    name: "Web Developers",
    slug: "web-dev",
    members: 12000,
    image: "/user.jpg",
  },
  {
    name: "AI Enthusiasts",
    slug: "ai",
    members: 8900,
    image: "/user.jpg",
  },
  {
    name: "Gaming Hub",
    slug: "gaming",
    members: 15000,
    image: "/user.jpg",
  },
  {
    name: "Crypto & Blockchain",
    slug: "crypto",
    members: 7300,
    image: "/user.jpg",
  },
  {
    name: "UI/UX Designers",
    slug: "ui-ux",
    members: 5600,
    image: "/user.jpg",
  },
];

export default function CommunitiesList() {
  return (
    <Card className="hidden min-h-32 rounded-2xl border bg-transparent pt-4 shadow-sm md:block">
      <h2 className="mb-3 px-6 font-instrument text-2xl text-textAlternative dark:text-white">
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

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const communities = [
  { name: "Web Developers", slug: "web-dev", members: 12000 },
  { name: "AI Enthusiasts", slug: "ai", members: 8900 },
  { name: "Gaming Hub", slug: "gaming", members: 15000 },
  { name: "Crypto & Blockchain", slug: "crypto", members: 7300 },
  { name: "UI/UX Designers", slug: "ui-ux", members: 5600 },
];

export default function CommunitiesList() {
  return (
    <Card className="hidden md:block bg-transparent rounded-2xl shadow-sm border pt-4 min-h-32">
      <h2 className="text-lg px-4">Communities to Join</h2>
      <CardContent className="">
        {communities.map(({ name, slug, members }) => (
          <Link key={slug} href={`/community/${slug}`} className="block py-2 rounded-lg hover:bg-muted transition">
            <p className=" text-sm font-medium hover:underline" title={name}>
              {name}
            </p>
            <p className="text-xs text-muted-foreground">
              {members.toLocaleString()} members
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

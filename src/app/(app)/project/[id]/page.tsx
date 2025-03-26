// "use client ";

// import LeftNavbar from "@/components/navbar/left-navbar";

// export default function StuffPage({ params }: { params: { id: string } }) {
//   return (
//     <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
//       <LeftNavbar />
//       <div className="my-5 min-h-fit flex-1 md:mx-10">
//         procect id : {params.id}
//       </div>
//     </div>
//   );
// }

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ExternalLink,
  Flag,
  Heart,
  MessageSquare,
  Share2,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import LeftNavbar from "@/components/navbar/left-navbar";

export default function ProjectDetailPage() {
  // This would normally come from your API
  const project = {
    id: "8493fc81-8720-426b-accd-4ba5810fe319",
    name: "project Lunar",
    description:
      "this is a mission to mars we are planning on working on it for the next decade",
    image:
      "https://res.cloudinary.com/dsaitxphg/image/upload/v1743008683/nerdspace/rockets_phsj1y.jpg",
    userId: "RQXQLcnGeKW45mg2vBJVR5XSzMibrT8s",
    status: "ONGOING",
    category: ["rocket", "Lunar", "mars", "nasa"],
    access: "public",
    createdAt: "2025-03-26T17:04:43.792Z",
    _count: {
      updates: 0,
      stars: 0,
      ratings: 0,
      reviews: 0,
      followers: 0,
    },
    user: {
      id: "RQXQLcnGeKW45mg2vBJVR5XSzMibrT8s",
      name: "nati",
      email: "ashebiryeabsra6@gmail.com",
      emailVerified: true,
      image:
        "https://res.cloudinary.com/dsaitxphg/image/upload/v1742568185/nerdspace/music1_u2xutm.jpg",
      createdAt: "2025-03-21T14:41:06.869Z",
      updatedAt: "2025-03-21T14:41:06.869Z",
      nerdAt: "Rockets",
      bio: "I blow some stuff that shoots me to the stars",
      countryId: null,
      link: "https://t.me/natyiu",
      visualName: "Nati",
      firstTime: false,
      coverImage:
        "https://res.cloudinary.com/dsaitxphg/image/upload/v1742812691/nerdspace/music1_oushb4.jpg",
    },
  };

  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });


  // const {data} = 

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 min-h-fit flex-1 md:mx-10">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Hero Section */}
          <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-xl md:h-[400px]">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/20 text-primary-foreground"
                >
                  {project.status}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-secondary/30 bg-secondary/20 text-secondary-foreground"
                >
                  {project.access}
                </Badge>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                {project.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <Image
                      src={project.user.image || "/placeholder.svg"}
                      alt={project.user.visualName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-white">
                    {project.user.visualName}
                  </span>
                </div>
                <div className="flex items-center text-sm text-white/80">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Project Details */}
            <div className="space-y-8 lg:col-span-2">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {project.category.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-sm">
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-bold">
                    About This Project
                  </h2>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-bold">Project Stats</h2>
                  <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-5">
                    <div className="flex flex-col items-center">
                      <Star className="mb-1 h-5 w-5 text-yellow-500" />
                      <span className="font-bold">{project._count.stars}</span>
                      <span className="text-xs text-muted-foreground">
                        Stars
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Heart className="mb-1 h-5 w-5 text-red-500" />
                      <span className="font-bold">
                        {project._count.followers}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Followers
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageSquare className="mb-1 h-5 w-5 text-blue-500" />
                      <span className="font-bold">
                        {project._count.reviews}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Reviews
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Flag className="mb-1 h-5 w-5 text-green-500" />
                      <span className="font-bold">
                        {project._count.updates}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Updates
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Star className="mb-1 h-5 w-5 text-purple-500" />
                      <span className="font-bold">
                        {project._count.ratings}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Ratings
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Updates Section (Empty State) */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-2xl font-bold">Project Updates</h2>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Flag className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No updates yet</h3>
                    <p className="mt-2 max-w-md text-muted-foreground">
                      This project hasn't posted any updates. Check back later
                      for progress on this mission to Mars.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Action Buttons */}
              <Card>
                <CardContent className="space-y-4 p-6">
                  <Button className="w-full gap-2">
                    <Heart className="h-4 w-4" />
                    Follow Project
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Star className="h-4 w-4" />
                    Star Project
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </CardContent>
              </Card>

              {/* Creator Profile */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Creator</h2>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full">
                      <Image
                        src={project.user.image || "/placeholder.svg"}
                        alt={project.user.visualName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold">
                      {project.user.visualName}
                    </h3>
                    <span className="mb-2 text-sm text-muted-foreground">
                      Nerd at: {project.user.nerdAt}
                    </span>
                    <p className="mb-4 text-sm">{project.user.bio}</p>
                    <Separator className="my-4" />
                    <Link
                      href={project.user.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Connect with {project.user.visualName}
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Projects Placeholder */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-xl font-bold">Similar Projects</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-md bg-muted"></div>
                      <div>
                        <h3 className="font-medium">Mars Rover</h3>
                        <p className="text-xs text-muted-foreground">
                          By SpaceX
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-md bg-muted"></div>
                      <div>
                        <h3 className="font-medium">Lunar Gateway</h3>
                        <p className="text-xs text-muted-foreground">By NASA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-md bg-muted"></div>
                      <div>
                        <h3 className="font-medium">Artemis Program</h3>
                        <p className="text-xs text-muted-foreground">By ESA</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

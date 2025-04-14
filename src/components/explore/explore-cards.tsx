"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import postInterface from "@/interface/auth/post.interface";
import ProjectInterface from "@/interface/auth/project.interface";
import UserInterface from "@/interface/auth/user.interface";
import { motion } from "framer-motion";
import { MessageSquare, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface User {
  name: string;
  nerdAt: string;
  image?: string;
  bio?: string;
  _count?: {
    followers?: number;
    posts?: number;
  };
}

interface Post {
  id: string;
  content: string;
  user: User;
  media?: Media[];
  _count?: {
    likes?: number;
    bookmarks?: number;
  };
}

interface Media {
  id: string;
  url: string;
}



export const UserCard = ({ user }: { user: UserInterface }) => (
  <Link href={`/app/profile/${user.nerdAt}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden rounded-xl border-border/50 bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-border/5">
        <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
        <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>
        
        <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-6">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
            <AvatarImage src={user.image || "/user.jpg"} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold sm:text-lg">
              {user.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground sm:text-sm">
              @{user.nerdAt}
            </p>
            {user.bio && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                {user.bio}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-4 p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{user._count?.followers || 0} followers</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{user._count?.posts || 0} posts</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

export const PostCard = ({ post }: { post: postInterface }) => (
  <Link href={`/app/posts/${post.id}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden rounded-xl border-border/50 bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-border/5">
        <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
        <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>
        
        <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.image || "/user.jpg"} alt={post.user.name} />
            <AvatarFallback>{post.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-semibold sm:text-base">
              {post.user.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              @{post.user.nerdAt}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <p className="text-sm sm:text-base">{post.content}</p>
          {post.media && post.media.length > 0 && (
            <div className="grid gap-2">
              {post.media.map((media) => (
                <div key={media.id} className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={media.url}
                    alt="Post media"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{post._count?.likes || 0} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>{post._count?.bookmarks || 0} bookmarks</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

export const ProjectCard = ({ project }: { project: ProjectInterface }) => (
  <Link href={`/app/projects/${project.id}`}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden rounded-xl border-border/50 bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-border/5">
        <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
        <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>
        
        <CardHeader className="space-y-2 p-4 sm:p-6">
          <CardTitle className="text-lg font-semibold sm:text-xl">
            {project.name}
          </CardTitle>
          <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
            {project.description}
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {project.image && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>{project._count?.stars || 0} stars</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{project._count?.ratings || 0} ratings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

// export const CommunityCard = ({ community }: { community: Community }) => (
//   <Link href={`/app/communities/${community.id}`}>
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ scale: 1.02 }}
//       transition={{ duration: 0.2 }}
//     >
//       <Card className="group relative overflow-hidden rounded-xl border-border/50 bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-border/5">
//         <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
//         <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>
        
//         <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-6">
//           <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
//             <AvatarImage src={community.image || "/user.jpg"} alt={community.name} />
//             <AvatarFallback>{community.name.substring(0, 2).toUpperCase()}</AvatarFallback>
//           </Avatar>
//           <div>
//             <CardTitle className="text-base font-semibold sm:text-lg">
//               {community.name}
//             </CardTitle>
//             <p className="text-xs text-muted-foreground sm:text-sm">
//               @{community.nerdAt}
//             </p>
//             {community.description && (
//               <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
//                 {community.description}
//               </p>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent className="flex items-center gap-4 p-4 pt-0 sm:p-6 sm:pt-0">
//           <div className="flex items-center gap-1 text-xs text-muted-foreground">
//             <Users className="h-3.5 w-3.5" />
//             <span>{community._count?.members || 0} members</span>
//           </div>
//           <div className="flex items-center gap-1 text-xs text-muted-foreground">
//             <MessageSquare className="h-3.5 w-3.5" />
//             <span>{community._count?.posts || 0} posts</span>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   </Link>
// ); 
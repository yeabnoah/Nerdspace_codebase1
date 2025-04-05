// import { ArrowLeft, Badge, Calendar, Info, MessageCircle, MoreHorizontal, Shield, Users } from "lucide-react";
// import { Button } from "../ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Separator } from "@radix-ui/react-dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

// const CommunityHeader = ({}) => (
//     <div className="mb-8">
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => router.push("/community")}
//             className="h-9 w-9 rounded-full"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-xl font-semibold">{data.name}</h1>
//         </div>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-full"
//             >
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-[200px]">
//             <DropdownMenuItem>
//               <Info className="mr-2 h-4 w-4" />
//               Community Info
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <Shield className="mr-2 h-4 w-4" />
//               Report Community
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//               <Users className="mr-2 h-4 w-4" />
//               Invite Members
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>

//       <div className="mb-6 flex items-center gap-4">
//         <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
//           <AvatarImage
//             src={`/placeholder.svg?height=56&width=56`}
//             alt={data.name}
//           />
//           <AvatarFallback className="text-lg font-medium">
//             {data.name.substring(0, 2).toUpperCase()}
//           </AvatarFallback>
//         </Avatar>

//         <div className="flex-1">
//           <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-2">
//             <div className="flex items-center text-sm text-muted-foreground">
//               <Users className="mr-1.5 h-3.5 w-3.5" />
//               <span>{data.members.length} members</span>
//             </div>
//             <div className="flex items-center text-sm text-muted-foreground">
//               <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
//               <span>{data.posts.length} posts</span>
//             </div>
//             <div className="flex items-center text-sm text-muted-foreground">
//               <Calendar className="mr-1.5 h-3.5 w-3.5" />
//               <span>
//                 Created {new Date(data.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//           </div>

//           {data.category && (
//             <Badge variant="secondary" className="mt-1">
//               {data.category.name}
//             </Badge>
//           )}
//         </div>

//         <Button
//           variant={isJoined ? "outline" : "default"}
//           size="sm"
//           onClick={handleJoinCommunity}
//           className={
//             isJoined ? "border-primary/30 text-primary hover:bg-primary/10" : ""
//           }
//         >
//           {isJoined ? "Joined" : "Join"}
//         </Button>
//       </div>

//       <Tabs
//         defaultValue="feed"
//         value={currentView}
//         onValueChange={(value) => setCurrentView(value as ScreenView)}
//         className="w-full"
//       >
//         <TabsList className="mb-1 grid h-11 w-full grid-cols-3">
//           <TabsTrigger value="feed" className="text-sm">
//             Feed
//           </TabsTrigger>
//           <TabsTrigger value="members" className="text-sm">
//             Members
//           </TabsTrigger>
//           <TabsTrigger value="about" className="text-sm">
//             About
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>

//       <Separator />
//     </div>
//   );

// export default CommunityHeader;
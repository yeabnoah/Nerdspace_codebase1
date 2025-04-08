// "use client";

// import { useEffect, useState } from "react";
// import PostCard from "@/components/post/post-card";
// import { authClient } from "@/lib/auth-client";
// import { queryClient } from "@/providers/tanstack-query-provider";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// interface Project {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   status: string;
//   category: string[];
//   access: string;
//   _count: {
//     updates: number;
//     stars: number;
//     reviews: number;
//   };
// }

// export default function ProjectsTab() {
//   const session = authClient.useSession();
//   const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
//   const [commentShown, setCommentShown] = useState<{ [key: string]: boolean }>(
//     {},
//   );
//   const [expandedComments, setExpandedComments] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [replyShown, setReplyShown] = useState<{ [key: string]: boolean }>({});
//   const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
//     {},
//   );
//   const [expandedReplies, setExpandedReplies] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [modalEditOpened, setModalEditOpened] = useState(false);
//   const [modalDeleteOpened, setModalDeleteOpened] = useState(false);
//   const [reportModalOpen, setReportModalOpen] = useState(false);
//   const [commentId, setCommentId] = useState("");

//   const { data: projects, isLoading } = useQuery({
//     queryKey: ["projects", session.data?.user.id],
//     queryFn: async () => {
//       const response = await axios.get(
//         `/api/project/user/${session.data?.user.id}`,
//       );
//       return response.data.data;
//     },
//     enabled: !!session.data?.user.id,
//   });

//   useEffect(() => {
//     if (projects) {
//       setExpandedStates(new Array(projects.length).fill(false));
//     }
//   }, [projects]);

//   const toggleExpand = (index: number) => {
//     setExpandedStates((prev) => {
//       const newStates = [...prev];
//       newStates[index] = !newStates[index];
//       return newStates;
//     });
//   };

//   const toggleCommentShown = (postId: string) => {
//     setCommentShown((prev) => ({
//       ...prev,
//       [postId]: !prev[postId],
//     }));
//   };

//   const toggleCommentExpand = (commentId: string) => {
//     setExpandedComments((prev) => ({
//       ...prev,
//       [commentId]: !prev[commentId],
//     }));
//   };

//   const toggleReplyShown = (commentId: string) => {
//     setReplyShown((prev) => ({
//       ...prev,
//       [commentId]: !prev[commentId],
//     }));
//   };

//   const handleReplySubmit = (commentId: string) => {
//     // Implement reply submission logic
//   };

//   const toggleReplies = (commentId: string) => {
//     setExpandedReplies((prev) => ({
//       ...prev,
//       [commentId]: !prev[commentId],
//     }));
//   };

//   const handleEditComment = (commentId: string) => {
//     setModalEditOpened(true);
//   };

//   const handleDeleteComment = (commentId: string) => {
//     setModalDeleteOpened(true);
//   };

//   const openEditModal = (comment: any) => {
//     setModalEditOpened(true);
//   };

//   const openDeleteModal = (comment: any) => {
//     setModalDeleteOpened(true);
//   };

//   const setSelectedCommentReply = (comment: any) => {
//     // Implement comment reply selection logic
//   };

//   const changePostAccessType = (post: any) => {
//     // Implement post access type change logic
//   };

//   const handleFollow = (post: any) => {
//     // Implement follow logic
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="space-y-4">
//       {projects?.map((project: Project, index: number) => (
//         <PostCard
//           key={project.id}
//           post={{
//             id: project.id,
//             content: project.description,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             userId: session.data?.user.id || "",
//             access: project.access as any,
//             user: {
//               id: session.data?.user.id || "",
//               name: session.data?.user.name || "",
//               email: session.data?.user.email || "",
//               emailVerified: session.data?.user.emailVerified || false,
//               image: session.data?.user.image || "",
//               createdAt: new Date(),
//               updatedAt: new Date(),
//               username: session.data?.user.name || "",
//               country: {
//                 id: "",
//                 alpha2: "",
//                 alpha3: "",
//                 countryCallingCodes: [],
//                 currencies: [],
//                 emoji: "",
//                 ioc: "",
//                 languages: [],
//                 name: "",
//                 status: "",
//                 userId: session.data?.user.id || "",
//               },
//               posts: [],
//               isFollowingAuthor: false,
//             },
//             shared: true,
//             project: {
//               id: project.id,
//               name: project.name,
//               description: project.description,
//               image: project.image,
//               userId: session.data?.user.id || "",
//               status: project.status as "COMPLETED" | "IN_PROGRESS" | "DRAFT",
//               category: project.category,
//               access: project.access as "public" | "private",
//               createdAt: new Date(),
//               updatedAt: new Date(),
//               _count: {
//                 updates: project._count.updates,
//                 stars: project._count.stars,
//                 ratings: 0,
//                 reviews: project._count.reviews,
//                 followers: 0,
//               },
//             },
//           }}
//           index={index}
//           expandedStates={expandedStates}
//           toggleExpand={toggleExpand}
//           commentShown={commentShown}
//           toggleCommentShown={toggleCommentShown}
//           expandedComments={expandedComments}
//           toggleCommentExpand={toggleCommentExpand}
//           replyShown={replyShown}
//           toggleReplyShown={toggleReplyShown}
//           replyContent={replyContent}
//           setReplyContent={setReplyContent}
//           handleReplySubmit={handleReplySubmit}
//           expandedReplies={expandedReplies}
//           toggleReplies={toggleReplies}
//           handleEditComment={handleEditComment}
//           handleDeleteComment={handleDeleteComment}
//           openEditModal={openEditModal}
//           openDeleteModal={openDeleteModal}
//           setSelectedCommentReply={setSelectedCommentReply}
//           modalEditOpened={modalEditOpened}
//           modalDeleteOpened={modalDeleteOpened}
//           reportModalOpen={reportModalOpen}
//           setReportModalOpen={setReportModalOpen}
//           setCommentId={setCommentId}
//           commentLoading={false}
//           comments={[]}
//           hasNextCommentPage={false}
//           isFetchingNextCommentPage={false}
//           fetchNextCommentPage={() => {}}
//           setEditModal={setModalEditOpened}
//           setDeleteModal={setModalDeleteOpened}
//           changePostAccessType={changePostAccessType}
//           handleFollow={handleFollow}
//         />
//       ))}
//     </div>
//   );
// }

"use client"

import type React from "react"

import { getTrimLimit } from "@/functions/render-helper"
import type postInterface from "@/interface/auth/post.interface"
import { authClient } from "@/lib/auth-client"
import usePostStore from "@/store/post.store"
import useReportStore from "@/store/report.strore"
import { PostAccess } from "@prisma/client"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { motion } from "framer-motion"
import {
  BanIcon,
  Clock,
  Edit,
  LockIcon,
  LockOpen,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  SendIcon,
  Star,
  TrashIcon,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { GoHeart, GoHeartFill } from "react-icons/go"
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2"
import ImagePreviewDialog from "../image-preview"
import DeleteModal from "../modal/delete.modal"
import EditModal from "../modal/edit.modal"
import CommentSkeleton from "../skeleton/comment.skelton"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { renderComments } from "./comment/render-comments"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmojiPicker, EmojiPickerSearch, EmojiPickerContent, EmojiPickerFooter } from "@/components/ui/emoji-picker"
import { SmileIcon } from "lucide-react"

interface PostCardProps {
  post: postInterface
  index: number
  expandedStates: boolean[]
  toggleExpand: (index: number) => void
  commentShown: { [key: string]: boolean }
  toggleCommentShown: (postId: string) => void
  expandedComments: { [key: string]: boolean }
  toggleCommentExpand: (commentId: string) => void
  replyShown: { [key: string]: boolean }
  toggleReplyShown: (commentId: string) => void
  replyContent: { [key: string]: string }
  setReplyContent: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  handleReplySubmit: (commentId: string) => void
  expandedReplies: { [key: string]: boolean }
  toggleReplies: (commentId: string) => void
  handleEditComment: (commentId: string) => void
  handleDeleteComment: (commentId: string) => void
  openEditModal: (comment: any) => void
  openDeleteModal: (comment: any) => void
  setSelectedCommentReply: (comment: any) => void
  modalEditOpened: boolean
  modalDeleteOpened: boolean
  reportModalOpen: boolean
  setReportModalOpen: (open: boolean) => void
  commentLoading: boolean
  comments: any[]
  hasNextCommentPage: boolean
  isFetchingNextCommentPage: boolean
  fetchNextCommentPage: () => void
  setEditModal: (open: boolean) => void
  setDeleteModal: (open: boolean) => void
  changePostAccessType: (post: postInterface) => void
  handleLike: (postId: string) => void
  handleBookmark: (postId: string) => void
  setCommentId: (id: string) => void
}

const PostCard = ({
  post,
  index,
  expandedStates,
  toggleExpand,
  commentShown,
  toggleCommentShown,
  expandedComments,
  toggleCommentExpand,
  replyShown,
  toggleReplyShown,
  replyContent,
  setReplyContent,
  handleReplySubmit,
  expandedReplies,
  toggleReplies,
  handleEditComment,
  handleDeleteComment,
  openEditModal,
  openDeleteModal,
  setSelectedCommentReply,
  modalEditOpened,
  modalDeleteOpened,
  reportModalOpen,
  setReportModalOpen,
  commentLoading,
  comments,
  hasNextCommentPage,
  isFetchingNextCommentPage,
  fetchNextCommentPage,
  setEditModal,
  setDeleteModal,
  changePostAccessType,
  setCommentId,
}: PostCardProps) => {
  const router = useRouter()
  const session = authClient.useSession()
  const queryClient = useQueryClient()
  const { setSelectedPost, setContent } = usePostStore()
  const { setPostId } = useReportStore()
  const [commentContent, setCommentContent] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([])
  const [optimisticLikes, setOptimisticLikes] = useState<{
    [key: string]: boolean
  }>({})
  const [optimisticBookmarks, setOptimisticBookmarks] = useState<{
    [key: string]: boolean
  }>({})
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}m`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const contentWords = post.content.split(" ")
  const trimLimit = getTrimLimit()
  const truncatedContent = contentWords.slice(0, trimLimit).join(" ")
  const isLongContent = contentWords.length > trimLimit
  const isShortContent = contentWords.length < trimLimit
  const isTooShort = contentWords.length < 10

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/like", {
        postId,
        userId: session.data?.user.id,
      })
      return response.data.data
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      const previousPosts = queryClient.getQueryData(["posts"])

      // Optimistically update the UI
      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: !post.likes?.some((like) => like.userId === session.data?.user.id),
      }))

      // Optimistically update the count
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) => {
              if (p.id === postId) {
                const isLiked = p.likes?.some((like: any) => like.userId === session.data?.user.id)
                return {
                  ...p,
                  likes: isLiked
                    ? p.likes.filter((like: any) => like.userId !== session.data?.user.id)
                    : [...p.likes, { userId: session.data?.user.id, postId: p.id }],
                  _count: {
                    ...p._count,
                    likes: isLiked ? p._count.likes - 1 : p._count.likes + 1,
                  },
                }
              }
              return p
            }),
          })),
        }
      })

      return { previousPosts }
    },
    onError: (err, postId, context) => {
      // Revert the optimistic update on error
      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: !optimisticLikes[postId],
      }))
      queryClient.setQueryData(["posts"], context?.previousPosts)
      toast.error("Error occurred while liking/unliking post")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/bookmark", {
        postId,
        userId: session.data?.user.id,
      })
      return response.data.data
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      const previousPosts = queryClient.getQueryData(["posts"])

      // Optimistically update the UI
      setOptimisticBookmarks((prev) => ({
        ...prev,
        [postId]: !post.bookmarks.some((bookmark) => bookmark.userId === session.data?.user.id),
      }))

      // Optimistically update the count
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) => {
              if (p.id === postId) {
                const isBookmarked = p.bookmarks.some((bookmark: any) => bookmark.userId === session.data?.user.id)
                return {
                  ...p,
                  bookmarks: isBookmarked
                    ? p.bookmarks.filter((bookmark: any) => bookmark.userId !== session.data?.user.id)
                    : [...p.bookmarks, { userId: session.data?.user.id, postId: p.id }],
                  _count: {
                    ...p._count,
                    bookmarks: isBookmarked ? p._count.bookmarks - 1 : p._count.bookmarks + 1,
                  },
                }
              }
              return p
            }),
          })),
        }
      })

      return { previousPosts }
    },
    onError: (err, postId, context) => {
      // Revert the optimistic update on error
      setOptimisticBookmarks((prev) => ({
        ...prev,
        [postId]: !optimisticBookmarks[postId],
      }))
      queryClient.setQueryData(["posts"], context?.previousPosts)
      toast.error("Error occurred while bookmarking/unbookmarking post")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const commentMutation = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string
      content: string
    }) => {
      const response = await axios.post("/api/post/comment", {
        postId,
        content,
      })
      return response.data
    },
    onMutate: async ({ postId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      const previousPosts = queryClient.getQueryData(["posts"])

      // Optimistically update the comment count
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) => {
              if (p.id === postId) {
                return {
                  ...p,
                  _count: {
                    ...p._count,
                    replies: (p._count?.replies || 0) + 1,
                  },
                }
              }
              return p
            }),
          })),
        }
      })

      return { previousPosts }
    },
    onError: (err, variables, context) => {
      // Revert the optimistic update on error
      queryClient.setQueryData(["posts"], context?.previousPosts)
      toast.error("Error occurred while adding comment")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["comment"] })
      setCommentContent("")
    },
  })

  const handleCommentSubmit = () => {
    if (commentContent.trim()) {
      commentMutation.mutate({
        postId: post.id,
        content: commentContent.trim(),
      })
    }
  }

  const handleMediaClick = (index: number, images: string[]) => {
    setSelectedMediaIndex(index)
    setSelectedPostImages(images)
    setIsDialogOpen(true)
  }

  const getGridClass = (mediaCount: number) => {
    switch (mediaCount) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
      case 4:
        return "grid-cols-2"
      default:
        return ""
    }
  }

  const handleUserProfileClick = (userId: string) => {
    router.push(`/user-profile/${userId}`)
  }

  const handleReport = (postId: string) => {
    setPostId(postId)
    setReportModalOpen(true)
  }

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
  }

  const likeVariants = {
    initial: { scale: 1, color: "currentColor" },
    liked: { scale: [1, 1.2, 1], color: "#ef4444" },
  }

  const bookmarkVariants = {
    initial: { scale: 1, color: "currentColor" },
    bookmarked: { scale: [1, 1.2, 1], color: "var(--primary)" },
  }

  const followMutation = useMutation({
    mutationFn: async ({
      userId,
      action,
    }: {
      userId: string
      action: "follow" | "unfollow"
    }) => {
      const response = await axios.post(`/api/user/follow?userId=${userId}&action=${action}`)
      return response.data
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["who-to-follow"] })
      queryClient.invalidateQueries({ queryKey: ["follow-status"] })
      queryClient.invalidateQueries({ queryKey: ["user-followers"] })
      queryClient.invalidateQueries({ queryKey: ["user-following"] })
      queryClient.invalidateQueries({ queryKey: ["explore"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success(data.message)
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user")
    },
  })

  const handleFollow = (post: postInterface) => {
    if (!session.data?.user?.id) {
      toast.error("Please sign in to follow users")
      return
    }
    if (session.data.user.id === post.user.id) {
      toast.error("You cannot follow yourself")
      return
    }
    const isFollowing = post.user.isFollowingAuthor
    followMutation.mutate({
      userId: post.user.id,
      action: isFollowing ? "unfollow" : "follow",
    })
  }
  const handleAccessChange = async () => {
    setIsAccessDialogOpen(true)
  }

  const onEmojiClick = (emojiObject: any) => {
    const text = commentContent
    const before = text.slice(0, cursorPosition)
    const after = text.slice(cursorPosition)
    const newText = before + emojiObject.emoji + after
    setCommentContent(newText)
    setCursorPosition(cursorPosition + emojiObject.emoji.length)
  }

  return (
    <div className="relative my-5 w-full flex-1 border-b border-transparent p-2 px-2 before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-orange-500/10 before:to-transparent after:absolute after:left-0 after:top-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-blue-500/20 after:to-transparent sm:p-4 sm:px-3">
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {/* Only render these effects on desktop for better performance */}
        <div className="hidden md:block">
          <div className="absolute -right-4 size-40 -rotate-45 rounded-full bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent opacity-80 blur-[100px]"></div>
          <div className="absolute -bottom-5 left-12 size-40 rotate-45 rounded-full bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent opacity-80 blur-[100px]"></div>
        </div>
      </div>

      <div className="relative backdrop-blur-sm sm:pl-5 md:pl-3">
        <div className="mr-2 flex w-full flex-col items-start justify-between gap-2 pb-2 sm:flex-row sm:items-center sm:gap-0">
          <div className="flex flex-1 items-center gap-2 sm:gap-3">
            <Image
              src={post.user.image || "/user.jpg"}
              alt="user"
              className="size-8 cursor-pointer rounded-full shadow-[0_0_3px_rgba(0,122,255,0.5),0_0_5px_rgba(255,165,0,0.5),0_0_7px_rgba(0,122,255,0.4)] transition-all sm:size-10"
              height={200}
              width={200}
              onClick={() => handleUserProfileClick(post.user.id)}
            />

            <div onClick={() => handleUserProfileClick(post.user.id)} className="cursor-pointer">
              <h1 className="text-xs font-medium sm:text-sm">{post.user.name}</h1>
              <h1 className="text-[10px] text-muted-foreground sm:text-xs">
                Nerd@
                <span className="text-purple-500">{post.user.nerdAt}</span>
              </h1>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            {session?.data?.user?.id !== post.user.id && (
              <Button
                variant={"outline"}
                size="sm"
                className={`h-9 w-full rounded-xl bg-transparent px-2 text-xs shadow-none hover:bg-transparent sm:h-11 sm:w-auto md:text-sm`}
                onClick={() => {
                  handleFollow(post)
                }}
              >
                <span className="flex items-center gap-1 px-2">
                  {!post.user?.isFollowingAuthor && <Plus size={15} />}
                  {post.user?.isFollowingAuthor ? "Following" : "Follow"}
                </span>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              {session?.data?.user?.id === post.user.id ? (
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-2xl border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-black/80"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPost(post)
                      setEditModal(true)
                    }}
                    className="h-10 cursor-pointer rounded-xl hover:bg-black/70"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPost(post)
                      setDeleteModal(true)
                    }}
                    className="h-10 cursor-pointer rounded-xl hover:bg-black/70"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  {(post?.access as unknown as string) === (PostAccess.public as unknown as string) ? (
                    <DropdownMenuItem
                      onClick={() => {
                        handleAccessChange()
                      }}
                      className="h-10 cursor-pointer rounded-xl hover:bg-black/70"
                    >
                      <LockIcon className="mr-2 h-4 w-4" />
                      <span>Go Private</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => {
                        handleAccessChange()
                      }}
                      className="h-10 cursor-pointer rounded-xl hover:bg-black/70"
                    >
                      <LockOpen className="mr-2 h-4 w-4" />
                      <span>Go Public</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-2xl border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-black/80"
                >
                  <DropdownMenuItem
                    onClick={() => handleReport(post.id)}
                    disabled={session?.data?.user?.id === post.user.id}
                    className="h-10 cursor-pointer rounded-xl hover:bg-black/70"
                  >
                    <BanIcon className="mr-2 h-4 w-4" />
                    <span>Report</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>

        <div className={`mt-2 flex w-full flex-1 flex-col items-start justify-center`}>
          <div className="flex w-[100%] flex-1 flex-col justify-start gap-3">
            {post?.shared && (
              <Card
                onClick={() => router.push(`project/${post.project?.id}`)}
                className="h-24 overflow-hidden border-gray-100 opacity-80 shadow-none transition-all hover:cursor-pointer hover:opacity-100 dark:border-gray-500/5"
              >
                <div className="flex h-full gap-3">
                  <div className="relative h-full w-24">
                    <Image
                      fill
                      src={post?.project?.image || "/placeholder.svg"}
                      alt={post?.project?.name as string}
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-2">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-medium tracking-tight">{post?.project?.name}</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge variant="outline" className="bg-primary/5 text-[10px] font-normal">
                          {post?.project?.status}
                        </Badge>
                        {post?.project?.category && (
                          <Badge variant="outline" className="bg-primary/5 text-[10px] font-normal">
                            {post?.project?.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post?.project?._count.updates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{post?.project?._count.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{post?.project?._count.reviews}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {post.media && post.media.length > 0 && (
              <div
                className={`${!post.shared && "mt-2 sm:mt-4"} grid w-[100%] flex-1 gap-1 sm:gap-2 ${getGridClass(post.media.length)}`}
              >
                {post.media.length === 1 && (
                  <div
                    className="relative h-[25vh] sm:h-[30vh] md:h-[36vh]"
                    onClick={() =>
                      handleMediaClick(
                        0,
                        post.media.map((media) => media.url),
                      )
                    }
                  >
                    <Image
                      fill
                      src={post.media[0].url || "/placeholder.svg"}
                      alt="Post media"
                      className="w-full rounded-xl object-cover"
                    />
                  </div>
                )}
                {post.media.length === 2 &&
                  post.media.map((media, mediaIndex) => (
                    <div
                      key={media.id}
                      className="relative h-[15vh] sm:h-[20vh] md:h-[28vh]"
                      onClick={() =>
                        handleMediaClick(
                          mediaIndex,
                          post.media.map((media) => media.url),
                        )
                      }
                    >
                      <Image
                        fill
                        src={media.url || "/placeholder.svg"}
                        alt="Post media"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>
                  ))}
                {post.media.length >= 3 && (
                  <div className="grid h-[30vh] w-full max-w-[82vw] grid-cols-[auto_100px] gap-1 sm:h-[36vh] sm:grid-cols-[auto_120px] sm:gap-2 md:w-[36vw]">
                    <div
                      className="relative h-full w-full"
                      onClick={() =>
                        handleMediaClick(
                          0,
                          post.media.map((media) => media.url),
                        )
                      }
                    >
                      <Image
                        fill
                        src={post.media[0].url || "/placeholder.svg"}
                        alt="Post media"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>

                    <div className="flex w-full flex-col gap-1 sm:gap-2">
                      {post.media.slice(1, 4).map((media, mediaIndex) => (
                        <div
                          key={media.id}
                          className="relative h-full w-full"
                          onClick={() =>
                            handleMediaClick(
                              mediaIndex + 1,
                              post.media.map((media) => media.url),
                            )
                          }
                        >
                          <Image
                            fill
                            src={media.url || "/placeholder.svg"}
                            alt="Post media"
                            className="h-full w-full rounded-xl object-cover"
                          />
                          {mediaIndex === 2 && post.media.length > 4 && (
                            <div className="absolute bottom-1 right-1 rounded-full bg-black/50 px-1 py-0.5 text-[10px] text-white sm:bottom-2 sm:right-2 sm:px-2 sm:py-1 sm:text-xs">
                              +{post.media.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 break-words">
              <h4 className="whitespace-pre-wrap break-all text-xs sm:text-sm md:text-sm">
                {(expandedStates[index] || !isLongContent ? post.content : truncatedContent)
                  .split(/(\s+)/)
                  .map((word, i) =>
                    word.startsWith("#") ? (
                      <span key={i} className="text-purple-500">
                        {word}
                      </span>
                    ) : (
                      word
                    ),
                  )}
                {!expandedStates[index] && isLongContent && "..."}
              </h4>
              {isLongContent && (
                <button
                  className="mt-1 text-xs text-purple-500 hover:underline sm:mt-2 sm:text-sm"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedStates[index] ? "See less" : "See more"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex w-full items-center justify-start gap-6 border-t border-t-gray-500/10 pt-3">
            <motion.div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => likeMutation.mutate(post.id)}
              variants={likeVariants}
              initial="initial"
              animate={
                optimisticLikes[post.id] !== undefined
                  ? optimisticLikes[post.id]
                    ? "liked"
                    : "initial"
                  : post.likes?.some((like) => like.userId === session.data?.user.id)
                    ? "liked"
                    : "initial"
              }
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
            >
              {optimisticLikes[post.id] !== undefined ? (
                optimisticLikes[post.id] ? (
                  <GoHeartFill className="size-5 text-red-500" />
                ) : (
                  <GoHeart className="size-5" />
                )
              ) : post.likes?.some((like) => like.userId === session.data?.user.id) ? (
                <GoHeartFill className="size-5 text-red-500" />
              ) : (
                <GoHeart className="size-5" />
              )}
              <span className="text-sm font-medium">{formatCount(post._count?.likes || 0)}</span>
            </motion.div>

            <motion.div
              onClick={async () => {
                await setSelectedPost(post)
                toggleCommentShown(post.id)
                await queryClient.invalidateQueries({
                  queryKey: ["comment", post.id],
                })
              }}
              className="flex cursor-pointer items-center gap-2"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="size-5" />
              <span className="text-sm font-medium">{formatCount(post._count?.replies || 0)}</span>
            </motion.div>

            <motion.div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => bookmarkMutation.mutate(post.id)}
              variants={bookmarkVariants}
              initial="initial"
              animate={
                optimisticBookmarks[post.id] !== undefined
                  ? optimisticBookmarks[post.id]
                    ? "bookmarked"
                    : "initial"
                  : post.bookmarks.some((bookmark) => bookmark.userId === session.data?.user.id)
                    ? "bookmarked"
                    : "initial"
              }
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
            >
              {optimisticBookmarks[post.id] !== undefined ? (
                optimisticBookmarks[post.id] ? (
                  <HiBookmark className="size-5 text-primary" />
                ) : (
                  <HiOutlineBookmark className="size-5" />
                )
              ) : post.bookmarks.some((bookmark) => bookmark.userId === session.data?.user.id) ? (
                <HiBookmark className="size-5 text-primary" />
              ) : (
                <HiOutlineBookmark className="size-5" />
              )}
              <span className="text-sm font-medium">{formatCount(post._count?.bookmarks || 0)}</span>
            </motion.div>
          </div>
        </div>

        {commentShown[post.id] && (
          <div>
            <hr className="mb-2 mt-3 sm:mt-5" />
            <div className="itemc flex gap-2 py-2">
              <div className="relative flex-1">
                <input
                  placeholder="Comment here"
                  className="w-full border-0 border-b border-b-textAlternative/20 bg-transparent px-2 py-2 text-xs placeholder:font-instrument placeholder:text-base focus:border-b focus:border-gray-500 focus:outline-none focus:ring-0 dark:border-white/50 sm:text-sm sm:placeholder:text-lg"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e?.target?.value)}
                  onSelect={(e) => setCursorPosition(e?.currentTarget?.selectionStart || 0)}
                />
                <div className="absolute bottom-1 right-2">
                  <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 rounded-lg p-0 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <SmileIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-0">
                      <EmojiPicker
                        className="h-[342px]"
                        onEmojiSelect={({ emoji }) => {
                          setIsEmojiOpen(false)
                          onEmojiClick({ emoji })
                        }}
                      >
                        <EmojiPickerSearch />
                        <EmojiPickerContent />
                        <EmojiPickerFooter />
                      </EmojiPicker>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button
                onClick={handleCommentSubmit}
                className="h-8 border bg-transparent shadow-none hover:bg-transparent focus:outline-none focus:ring-0 sm:h-9"
              >
                <SendIcon className="size-4 text-card-foreground dark:text-white sm:size-5" />
              </Button>
            </div>
            {commentLoading && <CommentSkeleton />}
            <div className="mt-3 sm:mt-4">
              {renderComments({
                comments: comments,
                parentId: null,
                level: 0,
                expandedComments,
                toggleCommentExpand,
                replyShown,
                toggleReplyShown,
                replyContent,
                setReplyContent,
                handleReplySubmit,
                expandedReplies,
                toggleReplies,
                handleEditComment,
                handleDeleteComment,
                openEditModal,
                openDeleteModal,
                setSelectedCommentReply,
                modalEditOpened: modalEditOpened,
                modalDeleteOpened: modalDeleteOpened,
                reportModalOpen,
                setReportModalOpen,
                setCommentId: (id: string) => setCommentId(id),
              })}
              {hasNextCommentPage && (
                <Button
                  onClick={() => fetchNextCommentPage()}
                  disabled={isFetchingNextCommentPage}
                  className="mt-3 h-8 w-full text-xs sm:mt-4 sm:h-9 sm:text-sm"
                >
                  {isFetchingNextCommentPage ? "Loading..." : "Load More"}
                </Button>
              )}
            </div>
          </div>
        )}

        <ImagePreviewDialog
          images={selectedPostImages}
          initialIndex={selectedMediaIndex || 0}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />

        <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
          <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
            <DialogTitle></DialogTitle>
            {/* Optimized gradient effects */}
            <div className="pointer-events-none absolute inset-0 overflow-visible">
              <div className="absolute -right-4 size-40 -rotate-45 rounded-full bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent opacity-80 blur-[100px]"></div>
              <div className="absolute -bottom-5 left-12 size-40 rotate-45 rounded-full bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent opacity-80 blur-[100px]"></div>
            </div>
            <div className="relative flex flex-col">
              <div className="flex w-full flex-col px-6 pb-3">
                <div className="mb-2 font-geist text-3xl font-medium">
                  {(post.access as unknown as string) === (PostAccess.public as unknown as string)
                    ? "Make Post Private"
                    : "Make Post Public"}
                </div>
                <p className="mb-6 font-geist text-muted-foreground">
                  {(post.access as unknown as string) === (PostAccess.public as unknown as string)
                    ? "Are you sure you want to make this post private? This will hide it from other users."
                    : "Are you sure you want to make this post public? This will make it visible to other users."}
                </p>

                <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                  <Button
                    variant="outline"
                    className="h-11 w-24 rounded-2xl"
                    onClick={() => setIsAccessDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      await changePostAccessType(post)
                      setIsAccessDialogOpen(false)
                    }}
                    className="h-11 w-24 rounded-2xl"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Modal */}

      <EditModal
        incasePost={post}
        setEditModal={setEditModal}
        editModal={modalEditOpened}
        incaseContent={post.content}
      />

      <DeleteModal
        selectedPost={post}
        setDeleteModal={setDeleteModal}
        deleteModal={modalDeleteOpened}
        content={post.content}
        setContent={setContent}
      />
    </div>
  )
}

export default PostCard

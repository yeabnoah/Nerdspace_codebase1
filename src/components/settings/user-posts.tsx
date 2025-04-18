"use client"

import type React from "react"

import { timeAgo } from "@/functions/calculate-time-difference"
import { getTrimLimit } from "@/functions/render-helper"
import useUserProfileStore from "@/store/userProfile.store"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { BanIcon, MessageCircle, MoreHorizontal, Share2Icon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import ImagePreviewDialog from "../image-preview"
import RenderPostSkeleton from "../skeleton/render-post.skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { GoHeart, GoHeartFill } from "react-icons/go"
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import toast from "react-hot-toast"

const RenderUserPosts = () => {
  const { ref, inView } = useInView()
  const router = useRouter()
  const queryClient = useQueryClient()
  const session = authClient.useSession()
  const { userProfile } = useUserProfileStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([])
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({})
  const [optimisticLikes, setOptimisticLikes] = useState<Record<string, boolean>>({})
  const [optimisticBookmarks, setOptimisticBookmarks] = useState<Record<string, boolean>>({})

  // Fetch user posts with infinite query
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["user-posts", userProfile?.id],
    queryFn: ({ pageParam = null }) => {
      return axios
        .get(`/api/user/posts?userId=${userProfile?.id}${pageParam ? `&cursor=${pageParam}` : ""}`)
        .then((response) => response.data)
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userProfile?.id,
  })

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/like", {
        postId,
        userId: session.data?.user.id,
      })
      return response.data.data
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["user-posts"] })
      const previousPosts = queryClient.getQueryData(["user-posts"])

      // Optimistically update the UI
      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }))

      // Optimistically update the count
      queryClient.setQueryData(["user-posts"], (old: any) => {
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
      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: !optimisticLikes[postId],
      }))
      queryClient.setQueryData(["user-posts"], context?.previousPosts)
      toast.error("Error occurred while liking/unliking post")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] })
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
      await queryClient.cancelQueries({ queryKey: ["user-posts"] })
      const previousPosts = queryClient.getQueryData(["user-posts"])

      // Optimistically update the UI
      setOptimisticBookmarks((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }))

      // Optimistically update the count
      queryClient.setQueryData(["user-posts"], (old: any) => {
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
      setOptimisticBookmarks((prev) => ({
        ...prev,
        [postId]: !optimisticBookmarks[postId],
      }))
      queryClient.setQueryData(["user-posts"], context?.previousPosts)
      toast.error("Error occurred while bookmarking/unbookmarking post")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] })
    },
  })

  // Format count numbers
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}m`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  // Handle media preview
  const handleMediaClick = (postId: string, index: number, images: string[], e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedMediaIndex(index)
    setSelectedPostImages(images)
    setIsDialogOpen(true)
  }

  // Toggle expanded content
  const toggleExpand = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedStates((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  // Handle like
  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session.data?.user?.id) {
      toast.error("Please sign in to like posts")
      return
    }
    likeMutation.mutate(postId)
  }

  // Handle bookmark
  const handleBookmark = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session.data?.user?.id) {
      toast.error("Please sign in to bookmark posts")
      return
    }
    bookmarkMutation.mutate(postId)
  }

  // Get grid class based on media count
  const getGridClass = (mediaCount: number) => {
    switch (mediaCount) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
      case 4:
        return "grid-cols-[2fr_1fr]"
      default:
        return ""
    }
  }

  // Load more posts when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage])

  if (isLoading) {
    return <RenderPostSkeleton />
  }

  if (data && data.pages.flatMap((page) => page.data).length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-card/50">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium">No posts yet</h3>
          <p className="text-sm text-muted-foreground">Posts you create will appear here</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-card/50">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium">Something went wrong</h3>
          <p className="text-sm text-muted-foreground">Failed to load posts. Please try again later.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  const posts = data?.pages.flatMap((page) => page.data) || []

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const contentWords = post.content.split(" ")
        const trimLimit = getTrimLimit()
        const truncatedContent = contentWords.slice(0, trimLimit).join(" ")
        const isLongContent = contentWords.length > trimLimit
        const isExpanded = expandedStates[post.id] || false
        const isLiked = post.likes?.some((like: { userId: string }) => like.userId === session.data?.user.id)
        const isBookmarked = post.bookmarks?.some((bookmark: { userId: string }) => bookmark.userId === session.data?.user.id)

        return (
          <motion.div
            key={post.id}
            className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-500/5 dark:bg-card/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => router.push(`/post/${post.id}`)}
          >
            {/* Glow effects */}
            <div className="absolute hidden md:block -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute hidden md:block -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="relative p-6">
              {/* Post Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20">
                    <Image
                      src={post.user.image || "/user.jpg"}
                      alt={post.user.name}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h1 className="font-geist text-sm font-medium">{post.user.name}</h1>
                    <p className="font-geist text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-xl border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-black/80"
                  >
                    <DropdownMenuItem className="flex h-11 items-center gap-2 rounded-xl font-geist">
                      <Share2Icon className="h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex h-11 items-center gap-2 rounded-xl font-geist">
                      <BanIcon className="h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-4">
                {/* Post Media */}
                {post.media && post.media.length > 0 && (
                  <div className="relative overflow-hidden rounded-xl">
                    <div className={cn("grid gap-2", getGridClass(post.media.length))}>
                      {post.media.length === 1 && (
                        <div
                          className="relative aspect-[16/9] overflow-hidden rounded-xl"
                          onClick={(e) =>
                            handleMediaClick(
                              post.id,
                              0,
                              post.media.map((m: { id: string; url: string }) => m.url),
                              e,
                            )
                          }
                        >
                          <Image
                            fill
                            src={post.media[0].url || "/placeholder.svg"}
                            alt="Post media"
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {post.media.length === 2 &&
                        post.media.map((m: { id: string; url: string }, index: number) => (
                          <div
                            key={m.id}
                            className="relative aspect-square overflow-hidden rounded-xl"
                            onClick={(e) =>
                              handleMediaClick(
                                post.id,
                                index,
                                post.media.map((m: { id: string; url: string }) => m.url),
                                e,
                              )
                            }
                          >
                            <Image
                              fill
                              src={m.url || "/placeholder.svg"}
                              alt="Post media"
                              className="object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>
                        ))}

                      {post.media.length >= 3 && (
                        <>
                          <div
                            className="relative aspect-[4/3] overflow-hidden rounded-xl"
                            onClick={(e) =>
                              handleMediaClick(
                                post.id,
                                0,
                                post.media.map((m: { id: string; url: string }) => m.url),
                                e,
                              )
                            }
                          >
                            <Image
                              fill
                              src={post.media[0].url || "/placeholder.svg"}
                              alt="Post media"
                              className="object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          </div>

                          <div className="grid gap-2">
                            {post.media.slice(1, 3).map((m: { id: string; url: string }, index: number) => (
                              <div
                                key={m.id}
                                className="relative aspect-[4/3] overflow-hidden rounded-xl"
                                onClick={(e) =>
                                  handleMediaClick(
                                    post.id,
                                    index + 1,
                                    post.media.map((m: { id: string; url: string }) => m.url),
                                    e,
                                  )
                                }
                              >
                                <Image
                                  fill
                                  src={m.url || "/placeholder.svg"}
                                  alt="Post media"
                                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                                {index === 1 && post.media.length > 3 && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white backdrop-blur-sm">
                                    <span className="text-lg font-medium">+{post.media.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Post Content */}
                <div className="space-y-2">
                  <p className="font-geist text-sm leading-relaxed text-foreground">
                    {isExpanded || !isLongContent ? post.content : `${truncatedContent}...`}
                  </p>
                  {isLongContent && (
                    <button
                      className="font-geist text-xs text-primary hover:underline"
                      onClick={(e) => toggleExpand(post.id, e)}
                    >
                      {isExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between border-t pt-4 dark:border-gray-500/5">
                  <div className="flex items-center gap-6">
                    <motion.button
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleLike(post.id, e)}
                    >
                      {optimisticLikes[post.id] !== undefined ? (
                        optimisticLikes[post.id] ? (
                          <GoHeartFill className="h-5 w-5 text-red-500" />
                        ) : (
                          <GoHeart className="h-5 w-5" />
                        )
                      ) : isLiked ? (
                        <GoHeartFill className="h-5 w-5 text-red-500" />
                      ) : (
                        <GoHeart className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">{formatCount(post._count?.likes || 0)}</span>
                    </motion.button>

                    <motion.button
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{formatCount(post._count?.replies || 0)}</span>
                    </motion.button>

                    <motion.button
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleBookmark(post.id, e)}
                    >
                      {optimisticBookmarks[post.id] !== undefined ? (
                        optimisticBookmarks[post.id] ? (
                          <HiBookmark className="h-5 w-5 text-primary" />
                        ) : (
                          <HiOutlineBookmark className="h-5 w-5" />
                        )
                      ) : isBookmarked ? (
                        <HiBookmark className="h-5 w-5 text-primary" />
                      ) : (
                        <HiOutlineBookmark className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">{formatCount(post._count?.bookmarks || 0)}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}

      <div ref={ref}>{isFetchingNextPage && <RenderPostSkeleton />}</div>

      <ImagePreviewDialog
        images={selectedPostImages}
        initialIndex={selectedMediaIndex || 0}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}

export default RenderUserPosts

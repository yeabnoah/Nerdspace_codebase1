"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { dummyData } from "@/lib/dummy-data"
import type { Community, CommunityMembership, CommunityPost, CommunityCategory, User } from "@/lib/types"

type CommunityContextType = {
  communities: Community[]
  categories: CommunityCategory[]
  currentUser: User
  selectedCommunity: Community | null
  selectCommunity: (communityId: string | null) => void
  createCommunity: (data: Partial<Community>) => void
  updateCommunity: (communityId: string, data: Partial<Community>) => void
  joinCommunity: (communityId: string) => void
  leaveCommunity: (communityId: string) => void
  createPost: (communityId: string, content: string, image?: string) => void
  likePost: (postId: string) => void
  addComment: (postId: string, content: string) => void
  activeTab: "posts" | "chat"
  setActiveTab: (tab: "posts" | "chat") => void
  chatMessages: { id: string; userId: string; communityId: string; content: string; createdAt: Date }[]
  sendChatMessage: (content: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  getUserCommunities: () => Community[]
  getDiscoverCommunities: () => Community[]
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>(dummyData.communities)
  const [categories] = useState<CommunityCategory[]>(dummyData.categories)
  const [currentUser] = useState<User>(dummyData.currentUser)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [activeTab, setActiveTab] = useState<"posts" | "chat">("posts")
  const [chatMessages, setChatMessages] = useState<
    { id: string; userId: string; communityId: string; content: string; createdAt: Date }[]
  >([])
  const [searchQuery, setSearchQuery] = useState("")

  // Load initial data
  useEffect(() => {
    // In a real app, you would fetch data from an API here

    // Set the first user community as selected by default if available
    const userCommunities = communities.filter((community) =>
      community.members.some((member) => member.userId === currentUser.id),
    )

    if (userCommunities.length > 0 && !selectedCommunity) {
      selectCommunity(userCommunities[0].id)
    }
  }, [])

  // Helper functions to get filtered communities
  const getUserCommunities = () => {
    return communities.filter((community) => community.members.some((member) => member.userId === currentUser.id))
  }

  const getDiscoverCommunities = () => {
    return communities.filter((community) => !community.members.some((member) => member.userId === currentUser.id))
  }

  // Select a community
  const selectCommunity = (communityId: string | null) => {
    if (!communityId) {
      setSelectedCommunity(null)
      return
    }

    const community = communities.find((c) => c.id === communityId) || null
    setSelectedCommunity(community)

    // Reset chat messages when changing communities
    if (community) {
      setChatMessages(dummyData.chatMessages.filter((m) => m.communityId === communityId))
    }
  }

  // Create a new community
  const createCommunity = (data: Partial<Community>) => {
    const newCommunity: Community = {
      id: `community-${Date.now()}`,
      name: data.name || "New Community",
      description: data.description || "",
      image: data.image,
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: currentUser.id,
      members: [],
      posts: [],
      categoryId: data.categoryId,
      ...data,
    }

    // Add creator as admin
    const membership: CommunityMembership = {
      id: `membership-${Date.now()}`,
      userId: currentUser.id,
      communityId: newCommunity.id,
      role: "ADMIN",
      joinedAt: new Date(),
    }

    newCommunity.members = [membership]

    setCommunities((prev) => [...prev, newCommunity])
    setSelectedCommunity(newCommunity)
  }

  // Update a community
  const updateCommunity = (communityId: string, data: Partial<Community>) => {
    setCommunities((prev) => {
      return prev.map((community) => {
        if (community.id === communityId) {
          return {
            ...community,
            name: data.name || community.name,
            description: data.description || community.description,
            image: data.image !== undefined ? data.image : community.image,
            categoryId: data.categoryId !== undefined ? data.categoryId : community.categoryId,
            updatedAt: new Date(),
          }
        }
        return community
      })
    })

    // Update selected community if it's the one being edited
    if (selectedCommunity?.id === communityId) {
      setSelectedCommunity((prev) => {
        if (!prev) return null
        return {
          ...prev,
          name: data.name || prev.name,
          description: data.description || prev.description,
          image: data.image !== undefined ? data.image : prev.image,
          categoryId: data.categoryId !== undefined ? data.categoryId : prev.categoryId,
          updatedAt: new Date(),
        }
      })
    }
  }

  // Join a community
  const joinCommunity = (communityId: string) => {
    setCommunities((prev) => {
      return prev.map((community) => {
        if (community.id === communityId) {
          // Check if user is already a member
          const isMember = community.members.some((m) => m.userId === currentUser.id)
          if (isMember) return community

          // Add new membership
          const newMembership: CommunityMembership = {
            id: `membership-${Date.now()}`,
            userId: currentUser.id,
            communityId,
            role: "MEMBER",
            joinedAt: new Date(),
          }

          return {
            ...community,
            members: [...community.members, newMembership],
          }
        }
        return community
      })
    })
  }

  // Leave a community
  const leaveCommunity = (communityId: string) => {
    setCommunities((prev) => {
      return prev.map((community) => {
        if (community.id === communityId) {
          return {
            ...community,
            members: community.members.filter((m) => m.userId !== currentUser.id),
          }
        }
        return community
      })
    })

    // If the selected community is the one being left, deselect it
    if (selectedCommunity?.id === communityId) {
      // Select another user community if available
      const userCommunities = getUserCommunities().filter((c) => c.id !== communityId)
      if (userCommunities.length > 0) {
        selectCommunity(userCommunities[0].id)
      } else {
        setSelectedCommunity(null)
      }
    }
  }

  // Create a post in a community
  const createPost = (communityId: string, content: string, image?: string) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      content,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: currentUser.id,
      communityId,
      likes: [],
      comments: [],
    }

    setCommunities((prev) => {
      return prev.map((community) => {
        if (community.id === communityId) {
          return {
            ...community,
            posts: [newPost, ...community.posts],
          }
        }
        return community
      })
    })

    // Update selected community if it's the current one
    if (selectedCommunity?.id === communityId) {
      setSelectedCommunity((prev) => {
        if (!prev) return null
        return {
          ...prev,
          posts: [newPost, ...prev.posts],
        }
      })
    }
  }

  // Like a post
  const likePost = (postId: string) => {
    setCommunities((prev) => {
      return prev.map((community) => {
        const updatedPosts = community.posts.map((post) => {
          if (post.id === postId) {
            const hasLiked = post.likes.some((like) => like.userId === currentUser.id)

            if (hasLiked) {
              // Unlike
              return {
                ...post,
                likes: post.likes.filter((like) => like.userId !== currentUser.id),
              }
            } else {
              // Like
              return {
                ...post,
                likes: [...post.likes, { id: `like-${Date.now()}`, userId: currentUser.id, postId }],
              }
            }
          }
          return post
        })

        return {
          ...community,
          posts: updatedPosts,
        }
      })
    })

    // Update selected community if needed
    if (selectedCommunity) {
      setSelectedCommunity((prev) => {
        if (!prev) return null

        const updatedPosts = prev.posts.map((post) => {
          if (post.id === postId) {
            const hasLiked = post.likes.some((like) => like.userId === currentUser.id)

            if (hasLiked) {
              // Unlike
              return {
                ...post,
                likes: post.likes.filter((like) => like.userId !== currentUser.id),
              }
            } else {
              // Like
              return {
                ...post,
                likes: [...post.likes, { id: `like-${Date.now()}`, userId: currentUser.id, postId }],
              }
            }
          }
          return post
        })

        return {
          ...prev,
          posts: updatedPosts,
        }
      })
    }
  }

  // Add a comment to a post
  const addComment = (postId: string, content: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      content,
      createdAt: new Date(),
      userId: currentUser.id,
      postId,
    }

    setCommunities((prev) => {
      return prev.map((community) => {
        const updatedPosts = community.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            }
          }
          return post
        })

        return {
          ...community,
          posts: updatedPosts,
        }
      })
    })

    // Update selected community if needed
    if (selectedCommunity) {
      setSelectedCommunity((prev) => {
        if (!prev) return null

        const updatedPosts = prev.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            }
          }
          return post
        })

        return {
          ...prev,
          posts: updatedPosts,
        }
      })
    }
  }

  // Send a chat message
  const sendChatMessage = (content: string) => {
    if (!selectedCommunity) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      communityId: selectedCommunity.id,
      content,
      createdAt: new Date(),
    }

    setChatMessages((prev) => [...prev, newMessage])
  }

  return (
    <CommunityContext.Provider
      value={{
        communities,
        categories,
        currentUser,
        selectedCommunity,
        selectCommunity,
        createCommunity,
        updateCommunity,
        joinCommunity,
        leaveCommunity,
        createPost,
        likePost,
        addComment,
        activeTab,
        setActiveTab,
        chatMessages,
        sendChatMessage,
        searchQuery,
        setSearchQuery,
        getUserCommunities,
        getDiscoverCommunities,
      }}
    >
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider")
  }
  return context
}


import type { User, Community, CommunityCategory } from "@/lib/types"

// Current user
const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  image: "/placeholder.svg?height=40&width=40",
}

// Other users
const users: User[] = [
  currentUser,
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-4",
    name: "Alice Williams",
    email: "alice@example.com",
    image: "/placeholder.svg?height=40&width=40",
  },
]

// Categories
const categories: CommunityCategory[] = [
  {
    id: "category-1",
    name: "Technology",
  },
  {
    id: "category-2",
    name: "Art & Design",
  },
  {
    id: "category-3",
    name: "Sports",
  },
  {
    id: "category-4",
    name: "Gaming",
  },
  {
    id: "category-5",
    name: "Education",
  },
]

// Create communities with memberships and posts
const communities: Community[] = [
  {
    id: "community-1",
    name: "Web Development",
    description: "A community for web developers to share knowledge and resources.",
    image: "/placeholder.svg?height=100&width=100",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    creatorId: "user-1",
    categoryId: "category-1",
    members: [
      {
        id: "membership-1",
        userId: "user-1",
        communityId: "community-1",
        role: "ADMIN",
        joinedAt: new Date("2023-01-15"),
        user: users.find((u) => u.id === "user-1"),
      },
      {
        id: "membership-2",
        userId: "user-2",
        communityId: "community-1",
        role: "MEMBER",
        joinedAt: new Date("2023-01-16"),
        user: users.find((u) => u.id === "user-2"),
      },
      {
        id: "membership-3",
        userId: "user-3",
        communityId: "community-1",
        role: "MODERATOR",
        joinedAt: new Date("2023-01-17"),
        user: users.find((u) => u.id === "user-3"),
      },
    ],
    posts: [
      {
        id: "post-1",
        content: "Just launched my new portfolio website using Next.js and Tailwind CSS. Check it out!",
        image: "/placeholder.svg?height=300&width=600",
        createdAt: new Date("2023-02-10"),
        updatedAt: new Date("2023-02-10"),
        userId: "user-2",
        communityId: "community-1",
        likes: [
          {
            id: "like-1",
            userId: "user-1",
            postId: "post-1",
          },
          {
            id: "like-2",
            userId: "user-3",
            postId: "post-1",
          },
        ],
        comments: [
          {
            id: "comment-1",
            content: "Looks amazing! What was the most challenging part?",
            createdAt: new Date("2023-02-10T12:30:00"),
            userId: "user-1",
            postId: "post-1",
          },
          {
            id: "comment-2",
            content: "The animations were tricky, but I'm happy with how they turned out.",
            createdAt: new Date("2023-02-10T13:15:00"),
            userId: "user-2",
            postId: "post-1",
          },
        ],
      },
      {
        id: "post-2",
        content: "What's your favorite CSS framework? I've been using Tailwind for a while now and I love it.",
        createdAt: new Date("2023-02-15"),
        updatedAt: new Date("2023-02-15"),
        userId: "user-3",
        communityId: "community-1",
        likes: [
          {
            id: "like-3",
            userId: "user-1",
            postId: "post-2",
          },
        ],
        comments: [
          {
            id: "comment-3",
            content: "Tailwind is great! I also like Bootstrap for quick prototypes.",
            createdAt: new Date("2023-02-15T14:20:00"),
            userId: "user-1",
            postId: "post-2",
          },
        ],
      },
    ],
  },
  {
    id: "community-2",
    name: "Digital Art",
    description: "Share your digital artwork and get feedback from other artists.",
    image: "/placeholder.svg?height=100&width=100",
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-01-20"),
    creatorId: "user-2",
    categoryId: "category-2",
    members: [
      {
        id: "membership-4",
        userId: "user-2",
        communityId: "community-2",
        role: "ADMIN",
        joinedAt: new Date("2023-01-20"),
        user: users.find((u) => u.id === "user-2"),
      },
      {
        id: "membership-5",
        userId: "user-4",
        communityId: "community-2",
        role: "MEMBER",
        joinedAt: new Date("2023-01-21"),
        user: users.find((u) => u.id === "user-4"),
      },
    ],
    posts: [
      {
        id: "post-3",
        content: "My latest digital painting. Spent about 20 hours on this one!",
        image: "/placeholder.svg?height=400&width=600",
        createdAt: new Date("2023-02-05"),
        updatedAt: new Date("2023-02-05"),
        userId: "user-2",
        communityId: "community-2",
        likes: [
          {
            id: "like-4",
            userId: "user-4",
            postId: "post-3",
          },
        ],
        comments: [
          {
            id: "comment-4",
            content: "The lighting is incredible! What software did you use?",
            createdAt: new Date("2023-02-05T18:45:00"),
            userId: "user-4",
            postId: "post-3",
          },
          {
            id: "comment-5",
            content: "Thanks! I used Procreate on iPad Pro.",
            createdAt: new Date("2023-02-05T19:10:00"),
            userId: "user-2",
            postId: "post-3",
          },
        ],
      },
    ],
  },
  {
    id: "community-3",
    name: "Basketball Fans",
    description: "Discuss games, players, and everything basketball related.",
    image: "/placeholder.svg?height=100&width=100",
    createdAt: new Date("2023-01-25"),
    updatedAt: new Date("2023-01-25"),
    creatorId: "user-3",
    categoryId: "category-3",
    members: [
      {
        id: "membership-6",
        userId: "user-3",
        communityId: "community-3",
        role: "ADMIN",
        joinedAt: new Date("2023-01-25"),
        user: users.find((u) => u.id === "user-3"),
      },
    ],
    posts: [],
  },
  {
    id: "community-4",
    name: "Minecraft Builders",
    description: "Share your Minecraft builds and get inspired by others.",
    image: "/placeholder.svg?height=100&width=100",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-01"),
    creatorId: "user-4",
    categoryId: "category-4",
    members: [
      {
        id: "membership-7",
        userId: "user-4",
        communityId: "community-4",
        role: "ADMIN",
        joinedAt: new Date("2023-02-01"),
        user: users.find((u) => u.id === "user-4"),
      },
      {
        id: "membership-8",
        userId: "user-1",
        communityId: "community-4",
        role: "MEMBER",
        joinedAt: new Date("2023-02-02"),
        user: users.find((u) => u.id === "user-1"),
      },
    ],
    posts: [
      {
        id: "post-4",
        content: "Just finished my medieval castle build. Took me 2 weeks!",
        image: "/placeholder.svg?height=300&width=600",
        createdAt: new Date("2023-02-20"),
        updatedAt: new Date("2023-02-20"),
        userId: "user-4",
        communityId: "community-4",
        likes: [
          {
            id: "like-5",
            userId: "user-1",
            postId: "post-4",
          },
        ],
        comments: [
          {
            id: "comment-6",
            content: "This is incredible! Did you use any mods?",
            createdAt: new Date("2023-02-20T21:30:00"),
            userId: "user-1",
            postId: "post-4",
          },
          {
            id: "comment-7",
            content: "Nope, all vanilla! Thanks for the compliment.",
            createdAt: new Date("2023-02-20T22:05:00"),
            userId: "user-4",
            postId: "post-4",
          },
        ],
      },
    ],
  },
]

// Chat messages for communities
const chatMessages = [
  {
    id: "msg-1",
    userId: "user-1",
    communityId: "community-1",
    content: "Hey everyone! Anyone working on any cool projects?",
    createdAt: new Date("2023-03-01T10:15:00"),
  },
  {
    id: "msg-2",
    userId: "user-2",
    communityId: "community-1",
    content: "I'm building a new e-commerce site with Next.js and Prisma!",
    createdAt: new Date("2023-03-01T10:18:00"),
  },
  {
    id: "msg-3",
    userId: "user-3",
    communityId: "community-1",
    content: "That sounds awesome! I've been meaning to try Prisma.",
    createdAt: new Date("2023-03-01T10:20:00"),
  },
  {
    id: "msg-4",
    userId: "user-1",
    communityId: "community-1",
    content: "Prisma is great for type safety. Let me know if you need any help getting started!",
    createdAt: new Date("2023-03-01T10:22:00"),
  },
  {
    id: "msg-5",
    userId: "user-2",
    communityId: "community-2",
    content: "Just got a new drawing tablet! Can't wait to try it out.",
    createdAt: new Date("2023-03-02T14:30:00"),
  },
  {
    id: "msg-6",
    userId: "user-4",
    communityId: "community-2",
    content: "Nice! Which one did you get?",
    createdAt: new Date("2023-03-02T14:32:00"),
  },
]

export const dummyData = {
  currentUser,
  users,
  categories,
  communities,
  chatMessages,
}


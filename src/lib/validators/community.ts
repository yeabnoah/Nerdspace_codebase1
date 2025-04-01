export type Community = {
  id: string
  name: string
  description: string
  image?: string
  createdAt: Date
  updatedAt: Date
  creatorId: string
  members: any[] // Replace 'any' with the correct type if available
  posts: any[] // Replace 'any' with the correct type if available
  categoryId?: string
}


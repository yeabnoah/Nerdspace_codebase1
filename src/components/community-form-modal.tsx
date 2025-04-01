"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCommunity } from "@/components/community-provider"
import type { Community } from "@/lib/types"

interface CommunityFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  communityToEdit?: Community
}

export function CommunityFormModal({ open, onOpenChange, communityToEdit }: CommunityFormModalProps) {
  const { categories, createCommunity, updateCommunity } = useCommunity()

  const isEditMode = !!communityToEdit

  const [name, setName] = useState(communityToEdit?.name || "")
  const [description, setDescription] = useState(communityToEdit?.description || "")
  const [categoryId, setCategoryId] = useState(communityToEdit?.categoryId || "")
  const [image, setImage] = useState<string | undefined>(communityToEdit?.image)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when the modal opens or communityToEdit changes
  useEffect(() => {
    if (communityToEdit) {
      setName(communityToEdit.name)
      setDescription(communityToEdit.description)
      setCategoryId(communityToEdit.categoryId || "")
      setImage(communityToEdit.image)
    } else {
      setName("")
      setDescription("")
      setCategoryId("")
      setImage(undefined)
    }
  }, [communityToEdit, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const communityData = {
        name,
        description,
        categoryId: categoryId || undefined,
        image,
      }

      if (isEditMode && communityToEdit) {
        updateCommunity(communityToEdit.id, communityData)
      } else {
        createCommunity(communityData)
      }

      // Close modal
      onOpenChange(false)
    } catch (error) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} community:`, error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would upload the image to a server
    // For this demo, we'll just use a placeholder
    setImage("/placeholder.svg?height=300&width=300")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit community" : "Create a new community"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update your community details."
                : "Create a community to connect with others who share your interests."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Photography Enthusiasts"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this community about?"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Community Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  {image ? (
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Community image"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("community-image")?.click()}
                >
                  Upload Image
                </Button>
                <input
                  id="community-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !name || !description}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Community"
                  : "Create Community"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


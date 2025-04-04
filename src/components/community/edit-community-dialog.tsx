"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { CommunityInterface } from "@/interface/auth/community.interface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface EditCommunityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  community: CommunityInterface
  onSubmit: (data: Partial<CommunityInterface>) => void
  isLoading: boolean
  categories: any[]
}

export function EditCommunityDialog({
  open,
  onOpenChange,
  community,
  onSubmit,
  isLoading,
  categories,
}: EditCommunityDialogProps) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    image: "",
    categoryId: "",
  })

  useEffect(() => {
    if (community) {
      setForm({
        id: community.id,
        name: community.name,
        description: community.description,
        image: community.image || "",
        categoryId: community.categoryId || "",
      })
    }
  }, [community])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Community</DialogTitle>
          <DialogDescription>
            Update the details of your community. All members will be able to see these changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter community name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your community"
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" placeholder="Enter image URL" value={form.image} onChange={handleChange} />
              <p className="text-xs text-muted-foreground">
                Provide a URL for your community image. Leave blank to use a default image.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) => setForm((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Community"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


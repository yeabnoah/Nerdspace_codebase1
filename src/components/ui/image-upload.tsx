"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="relative w-full h-40">
      <div className="w-full h-full flex items-center justify-center rounded-md border border-dashed">
        {value ? (
          <div className="relative w-full h-full">
            <Image fill src={value || "/placeholder.svg"} alt="Upload" className="object-cover rounded-md" sizes="(max-width: 768px) 100vw, 40vw" />
            <Button
              onClick={() => onChange("")}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              type="button"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              // This would typically open a file picker or upload dialog
              // For simplicity, we're just setting a placeholder image
              onChange("/placeholder.svg?height=400&width=400")
            }}
            variant="ghost"
            disabled={disabled}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full rounded-md",
              disabled && "cursor-not-allowed opacity-75",
            )}
          >
            <ImageIcon className="h-10 w-10 mb-2" />
            <span className="text-sm">Upload an image</span>
          </Button>
        )}
      </div>
    </div>
  )
}


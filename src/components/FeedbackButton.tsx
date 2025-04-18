"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Loader2, MessageCircle, AlertTriangle, AlertOctagon } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface FeedbackButtonProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  apiEndpoint?: string
}

export function FeedbackButton({ position = "bottom-right", apiEndpoint = "/api/bug" }: FeedbackButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const [severity, setSeverity] = useState("LOW")
//   const { toast } = useToast()
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  }

  const { mutate: submitFeedback, isPending } = useMutation({
    mutationFn: async () => {
      return axios.post(apiEndpoint, {
        content,
        bugseverity: severity,
        status: "PENDING",
      })
    },
    onSuccess: () => {
      toast.success("Feedback submitted")
      setContent("")
      setSeverity("LOW")
      setIsOpen(false)
    },
    onError: () => {
      toast.error("Failed to submit feedback. Please try again.")
    },
  })

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Missing description",
        description: "Please provide a description of the issue.",
        variant: "destructive",
      })
      return
    }
    submitFeedback()
  }

  const getSeverityIcon = (value: string) => {
    switch (value) {
      case "LOW":
        return <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
      case "MEDIUM":
        return <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
      case "HIGH":
        return <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
      case "CRITICAL":
        return <AlertOctagon className="mr-2 h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const maxCharCount = 500

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "group h-12 w-12 rounded-full border bg-white hover:bg-gray-100 shadow-lg transition-all duration-300 dark:border-gray-500/5 dark:bg-card",
              isButtonHovered ? "scale-110 shadow-xl" : "",
            )}
            size="icon"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            aria-label="Open feedback form"
          >
            <MessageCircle
              className={cn(
                "h-3 w-3 text-primary transition-all duration-300 dark:text-white",
                isButtonHovered ? "scale-110" : "",
              )}
            />
            <span className="absolute -top-1 -right-1 flex dark:bg-gray-300 h-5 w-5 items-center justify-center rounded-full bg-primary text-[17px] font-bold text-white dark:text-black">
              +
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 shadow-2xl backdrop-blur-sm transition-all duration-300">
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="absolute -right-4 size-40 -rotate-45 rounded-full border border-primary/50 bg-gradient-to-br from-primary/40 via-primary/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute -bottom-5 left-12 size-40 rotate-45 rounded-full border border-secondary/50 bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="flex w-full flex-col px-7 pb-4">
              <DialogHeader>
                <DialogTitle className="mb-2 mt-6 font-geist text-3xl font-medium">Submit Bug Report</DialogTitle>
                <p className="font-geist text-sm text-muted-foreground">
                  Help us improve by reporting issues or suggesting improvements.
                </p>
              </DialogHeader>

              <div className="mt-7 space-y-5">
                <div className="space-y-2">
                  <label className="font-geist text-sm font-medium">Severity</label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger className="h-12 rounded-xl border-input/90 font-geist shadow-none focus-visible:ring-primary/50 dark:border-gray-500/10">
                      <SelectValue placeholder="Select severity">
                        <div className="flex items-center">
                          {getSeverityIcon(severity)}
                          {severity === "LOW" && "Low"}
                          {severity === "MEDIUM" && "Medium"}
                          {severity === "HIGH" && "High"}
                          {severity === "CRITICAL" && "Critical"}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW" className="flex items-center">
                        <div className="flex items-center">
                          {getSeverityIcon("LOW")}
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        <div className="flex items-center">
                          {getSeverityIcon("MEDIUM")}
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="HIGH">
                        <div className="flex items-center">
                          {getSeverityIcon("HIGH")}
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="CRITICAL">
                        <div className="flex items-center">
                          {getSeverityIcon("CRITICAL")}
                          Critical
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-geist text-sm font-medium">Description</label>
                    <span className="text-xs text-muted-foreground">
                      {content.length}/{maxCharCount}
                    </span>
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => {
                      if (e.target.value.length <= maxCharCount) {
                        setContent(e.target.value)
                      }
                    }}
                    placeholder="Describe the issue or suggestion in detail..."
                    className="min-h-[140px] resize-none rounded-xl border-input/90 font-geist shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                  />
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-5 font-geist dark:border-gray-500/5">
                  <Button
                    variant="outline"
                    className="h-12 w-28 rounded-2xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="h-12 w-28 rounded-2xl transition-all duration-200"
                    disabled={isPending || !content.trim()}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

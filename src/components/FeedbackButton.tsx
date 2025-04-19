"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [severity, setSeverity] = useState("LOW");
  const { toast } = useToast();

  const { mutate: submitFeedback } = useMutation({
    mutationFn: async () => {
      return axios.post("/api/bug", {
        content,
        bugseverity: severity,
        status: "PENDING",
      });
    },
    onSuccess: () => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      setContent("");
      setSeverity("LOW");
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    submitFeedback();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="h-12 w-12 rounded-full border border-gray-100 bg-white shadow-lg transition-all hover:shadow-xl dark:border-gray-500/5 dark:bg-card/50 dark:hover:bg-card/80 fixed bottom-4 right-4"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 text-primary dark:text-secondary" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/50 bg-gradient-to-br from-primary/40 via-primary/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-secondary/50 bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="flex w-full flex-col px-6 pb-3">
              <DialogHeader>
                <DialogTitle className="mb-2 mt-5 font-geist text-3xl font-medium">
                  Submit Bug Report
                </DialogTitle>
                <p className="font-geist text-sm text-muted-foreground">
                  Help us improve by reporting issues or suggesting
                  improvements.
                </p>
              </DialogHeader>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="font-geist text-sm font-medium">
                    Severity
                  </label>
                  <Select value={severity} onValueChange={setSeverity}>
                    <SelectTrigger className="h-11 rounded-xl border-input/50 font-geist shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="font-geist text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe the issue or suggestion..."
                    className="min-h-[120px] resize-none rounded-xl border-input/50 font-geist shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                  />
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                  <Button
                    variant="outline"
                    className="h-11 w-24 rounded-2xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="h-11 w-24 rounded-2xl"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

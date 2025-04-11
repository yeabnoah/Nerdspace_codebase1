"use client"

import { cn } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import useReportStore from "@/store/report.strore";
import { Textarea } from "../ui/textarea";

const ReportModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { commentId, postId, reason, additionalContext, setReason, setAdditionalContext } = useReportStore();
  const [selectedReason, setSelectedReason] = useState("");

  const handleSubmit = async () => {
    try {
      const fullReason = selectedReason + (additionalContext ? `: ${additionalContext}` : "");
      await axios.post("/api/post/report", { 
        postId, 
        commentId, 
        reason: fullReason,
        additionalContext 
      });
      toast.success("Report submitted successfully");
      setSelectedReason("");
      setAdditionalContext("");
      onClose();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error("You have already submitted a report for this item");
        onClose();
      } else {
        toast.error("Error submitting report");
        onClose();
      }
    }
  };

  const reasons = [
    { value: "spam", label: "Spam" },
    { value: "harassment", label: "Harassment" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "hate_speech", label: "Hate Speech" },
    { value: "misinformation", label: "Misinformation" },
    { value: "violence", label: "Violence or Threats" },
    { value: "privacy", label: "Privacy Violation" },
    { value: "copyright", label: "Copyright Infringement" },
    { value: "other", label: "Other" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
        <DialogTitle></DialogTitle>
        <div className="relative flex flex-col">
          {/* Glow effects */}
          <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-red-300/50 bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
          <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

          <div className="flex w-full flex-col px-6 pb-3">
            <div className="mb-2 font-geist text-3xl font-medium">
              Report {postId ? "Post" : "Comment"}
            </div>
            <p className="mb-6 font-geist text-muted-foreground">
              Please select a reason for reporting this {postId ? "post" : "comment"}
            </p>

            <div className="space-y-2">
              {reasons.map((r) => (
                <Button
                  key={r.value}
                  onClick={() => {
                    setSelectedReason(r.label);
                    setReason(r.value);
                  }}
                  className={cn(
                    "w-full rounded-xl font-geist text-sm font-medium transition-all duration-300",
                    selectedReason === r.label
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  )}
                >
                  {r.label}
                </Button>
              ))}
            </div>

            {selectedReason && (
              <div className="mt-4">
                <Textarea
                  placeholder="Please provide additional context (optional)"
                  className="min-h-[100px] w-full rounded-xl border-none bg-secondary/50 p-3 font-geist text-sm placeholder:text-muted-foreground focus:border-none focus:ring-0"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                />
              </div>
            )}

            <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
              <Button
                variant="outline"
                className="h-11 w-24 rounded-2xl"
                onClick={() => {
                  setSelectedReason("");
                  setAdditionalContext("");
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                className="h-11 w-24 rounded-2xl"
                onClick={handleSubmit}
                disabled={!selectedReason}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;

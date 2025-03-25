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

const ReportModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { commentId, postId } = useReportStore();
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("/api/post/report", { postId, commentId, reason });
      toast.success("Report submitted successfully");
      onClose();
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error("You have already submitted a report for twhenis item");
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
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-xl dark:bg-textAlternative">
        <DialogHeader>
          <DialogTitle>Report {postId ? "Post" : "Comment"}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="mt-2 flex flex-col space-y-2">
            {reasons.map((r) => (
              <Button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={cn(
                  "w-full hover:text-white hover:dark:bg-primary/90 hover:dark:text-card-foreground",
                  reason === r.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {r.label}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;

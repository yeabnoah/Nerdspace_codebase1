"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { CommunityInterface } from "@/interface/auth/community.interface";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditCommunityDialog } from "./edit-community-dialog";
import { MoreHorizontal, Edit, Trash, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface CommunityDetailProps {
  community: CommunityInterface;
  isCreator: boolean;
  userId: string;
  isMember: boolean;
}

export function CommunityDetail({
  community,
  isCreator,
  userId,
  isMember,
}: CommunityDetailProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete("/api/communities", {
        data: { id: community.id },
      });
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Community deleted successfully",
      });
      router.push("/communities");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const joinLeaveMutation = useMutation({
    mutationFn: async () => {
      // Replace with actual join/leave API logic
      return isMember ? "Left community" : "Joined community";
    },
    onSuccess: (message) => {
      toast({
        title: message,
        description: isMember
          ? "You have left the community"
          : "You have joined the community",
      });
      router.refresh();
    },
  });

  const handleJoinLeave = () => {
    joinLeaveMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="relative h-48 w-full overflow-hidden rounded-lg md:h-64">
        {community.image ? (
          <Image
            src={community.image || "/placeholder.svg"}
            alt={community.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300">
            <span className="text-4xl font-bold text-gray-500">
              {community.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">{community.name}</h1>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage src={community.creator.image || ""} />
              <AvatarFallback>
                {community.creator.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span>
              Created by{" "}
              <span className="font-medium">{community.creator.name}</span>
              {" · "}
              {formatDistanceToNow(new Date(community.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCreator && (
            <Button
              onClick={handleJoinLeave}
              variant={isMember ? "outline" : "default"}
            >
              {isMember ? "Leave Community" : "Join Community"}
            </Button>
          )}

          {isCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Community
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Community
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center">
          <Users className="mr-1 h-4 w-4" />
          <span>{community.members.length} members</span>
        </div>
        {community.category && (
          <div className="rounded-full bg-muted px-2 py-1 text-xs">
            {community.category.name}
          </div>
        )}
      </div>

      <div className="prose max-w-none">
        <p>{community.description}</p>
      </div>

      {/* Edit Dialog */}
      <EditCommunityDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        community={community}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              community and all its posts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

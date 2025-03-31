"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  image: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

// API functions
const fetchCommunities = async () => {
  const response = await axios.get("/api/community");
  return response.data;
};

const createCommunity = async (data: FormValues) => {
  const response = await axios.post("/api/community", data);
  return response.data;
};

const updateCommunity = async (data: FormValues & { id: string }) => {
  const response = await axios.patch("/api/community", data);
  return response.data;
};

const deleteCommunity = async (id: string) => {
  const response = await axios.delete("/api/community", { data: { id } });
  return response.data;
};

interface Community {
  id: string;
  name: string;
  description: string;
  image?: string;
  categoryId?: string;
}

export default function CommunityManager() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(
    null,
  );

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      categoryId: "",
    },
  });

  // Queries and mutations
  const { data, isLoading, error } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const createMutation = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Success",
        description: "Community created successfully",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create community",
        variant: "destructive",
      });
      console.error("Error creating community:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Success",
        description: "Community updated successfully",
      });
      setIsOpen(false);
      setSelectedCommunity(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update community",
        variant: "destructive",
      });
      console.error("Error updating community:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Success",
        description: "Community deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete community",
        variant: "destructive",
      });
      console.error("Error deleting community:", error);
    },
  });

  // Handlers
  const onSubmit = (values: FormValues) => {
    if (selectedCommunity) {
      updateMutation.mutate({ ...values, id: selectedCommunity.id });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (community: Community) => {
    setSelectedCommunity(community);
    form.reset({
      name: community.name,
      description: community.description,
      image: community.image || "",
      categoryId: community.categoryId || "",
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    setCommunityToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (communityToDelete) {
      deleteMutation.mutate(communityToDelete);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedCommunity(null);
      form.reset({
        name: "",
        description: "",
        image: "",
        categoryId: "",
      });
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Communities</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">
              Error Loading Communities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{(error as Error).message}</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["communities"] })
              }
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Communities</h1>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCommunity ? "Edit Community" : "Create Community"}
              </DialogTitle>
              <DialogDescription>
                {selectedCommunity
                  ? "Update the details of your community below."
                  : "Fill in the details to create a new community."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Community name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your community"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a URL for your community image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Category identifier" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {selectedCommunity ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((community: Community) => (
          <Card key={community.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{community.name}</CardTitle>
              {community.categoryId && (
                <CardDescription>
                  Category: {community.categoryId}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {community.image && (
                <div className="mb-4 h-40 w-full overflow-hidden rounded-md">
                  <img
                    src={community.image || "/placeholder.svg"}
                    alt={community.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder.svg?height=160&width=320";
                    }}
                  />
                </div>
              )}
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {community.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => handleEdit(community)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <AlertDialog
                open={isDeleteDialogOpen && communityToDelete === community.id}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleDelete(community.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the community and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmDelete}
                      disabled={deleteMutation.isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      {data?.data.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No communities yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Get started by creating your first community
            </p>
            <DialogTrigger asChild>
              <Button onClick={() => setIsOpen(true)}>Create Community</Button>
            </DialogTrigger>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

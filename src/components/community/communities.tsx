"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { queryClient } from "@/providers/tanstack-query-provider";
import type { CommunityInterface } from "@/interface/auth/community.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  ImageIcon,
  Users,
  MessageSquare,
  Filter,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { EditCommunityDialog } from "./edit-community-dialog";
import { CreateCommunityDialog } from "./create-community-dialog";
import { authClient } from "@/lib/auth-client";

// Utility function to validate URLs
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const CommunityManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] =
    useState<CommunityInterface | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredCommunities, setFilteredCommunities] = useState<
    CommunityInterface[] | null
  >(null);

  const session = authClient.useSession();

  // Fetch communities
  const {
    data: communities,
    isLoading,
    isFetching,
  } = useQuery<CommunityInterface[]>({
    queryKey: ["communities", cursor],
    queryFn: async () => {
      const response = await axios.get("/api/community", {
        params: { cursor, limit: 9 },
      });
      setHasMore(response.data.hasMore);
      return response.data.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["community-categories"],
    queryFn: async () => {
      const response = await axios.get("/api/community/categories");
      return response.data;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newCommunity: Partial<CommunityInterface>) =>
      axios.post("/api/community", newCommunity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setIsCreateDialogOpen(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (updatedCommunity: Partial<CommunityInterface>) =>
      axios.patch("/api/community", updatedCommunity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setIsEditDialogOpen(false);
      setSelectedCommunity(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.delete("/api/community", { data: { id } });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["communities"] }),
  });

  // Handle edit
  const handleEdit = (community: CommunityInterface) => {
    setSelectedCommunity(community);
    setIsEditDialogOpen(true);
  };

  // Load more
  const loadMore = () => {
    if (communities && communities.length > 0) {
      setCursor(communities[communities.length - 1].id);
    }
  };

  // Filter communities based on search and category
  useEffect(() => {
    if (!communities) return;

    let filtered = [...communities];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (community) => community.categoryId === selectedCategory,
      );
    }

    setFilteredCommunities(filtered);
  }, [communities, searchQuery, selectedCategory]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  // Display communities (filtered or all)
  const displayCommunities = filteredCommunities || communities;

  if (isLoading && !communities) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8 space-y-4">
          <Skeleton className="h-12 w-full max-w-md" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((each) => (
            <Skeleton key={each} className="h-[350px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-instrument">Community</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Create Community
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchQuery || selectedCategory) && (
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <Filter className="h-4 w-4" /> Reset Filters
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            {displayCommunities?.length || 0} communities
          </Badge>
          {filteredCommunities && (
            <p className="text-sm text-muted-foreground">
              Showing filtered results
            </p>
          )}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Communities Grid */}
      {displayCommunities && displayCommunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayCommunities.map((community) => (
            <Card key={community.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                {community.image && isValidUrl(community.image) ? (
                  <Image
                    src={community.image}
                    alt={community.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {community.category && (
                  <Badge className="absolute right-2 top-2 bg-black/70 text-white hover:bg-black/70">
                    {community.category.name}
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{community.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{community.members?.length || 0}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{community.members?.length || 0} members</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {community.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{community.posts?.length || 0} posts</span>
                  </div>
                  <div className="text-xs">
                    Created:{" "}
                    {new Date(community.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                {session.data?.user.id === community.creatorId ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(community)}
                      className="flex-1 gap-2"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 gap-2"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Community</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{community.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(community.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Unauthorized</p>
                )}
                <Button variant="secondary" size="sm" className="flex-1 gap-2">
                  <Eye className="h-4 w-4" /> View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory
              ? "No communities match your search criteria."
              : "No communities found. Create one to get started."}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !searchQuery && !selectedCategory && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={loadMore}
            disabled={isFetching}
            variant="outline"
            className="min-w-[150px]"
          >
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Create Community Dialog */}
      <CreateCommunityDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
        categories={categories || []}
      />

      {/* Edit Community Dialog */}
      {selectedCommunity && (
        <EditCommunityDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          community={selectedCommunity}
          onSubmit={(data) => updateMutation.mutate(data)}
          isLoading={updateMutation.isPending}
          categories={categories || []}
        />
      )}
    </div>
  );
};

export default CommunityManager;

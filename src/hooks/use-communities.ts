import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { CommunityInterface } from "@/interface/auth/community.interface";

// Query keys
export const communityKeys = {
  all: ["communities"] as const,
  lists: () => [...communityKeys.all, "list"] as const,
  list: (filters: string) => [...communityKeys.lists(), { filters }] as const,
  details: () => [...communityKeys.all, "detail"] as const,
  detail: (id: string) => [...communityKeys.details(), id] as const,
};

// Fetch all communities
export const useCommunitiesQuery = (filters?: string) => {
  return useQuery({
    queryKey: communityKeys.list(filters || "all"),
    queryFn: async () => {
      const response = await api.get("/communities");
      return response.data.data as CommunityInterface[];
    },
  });
};

// Fetch a single community by ID
export const useCommunityQuery = (id: string) => {
  return useQuery({
    queryKey: communityKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/communities/${id}`);
      return response.data.data as CommunityInterface;
    },
    enabled: !!id, // Only run the query if we have an ID
  });
};

// Create a new community
export const useCreateCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCommunity: {
      name: string;
      description: string;
      image?: string;
      categoryId?: string;
    }) => {
      const response = await api.post("/communities", newCommunity);
      return response.data.data as CommunityInterface;
    },
    onSuccess: (data) => {
      // Invalidate and refetch communities list
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });

      // Optionally update the cache directly
      queryClient.setQueryData(
        communityKeys.list("all"),
        (old: CommunityInterface[] | undefined) => {
          return old ? [data, ...old] : [data];
        },
      );
    },
  });
};

// Join a community
export const useJoinCommunityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ communityId }: { communityId: string }) => {
      const response = await api.post(`/communities/${communityId}/join`);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific community and list
      queryClient.invalidateQueries({
        queryKey: communityKeys.detail(variables.communityId),
      });
      queryClient.invalidateQueries({ queryKey: communityKeys.lists() });
    },
  });
};

"use client";

import useUserStore from "@/store/user.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReactNode } from "react";

const WhoAmIProvider = ({ children }: { children: ReactNode }) => {
  const { setuser, setIsLoading } = useUserStore();

  useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/whoami", {
          withCredentials: true,
        });
        setuser(response.data.data);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // setuser(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
  
  return <>{children}</>;
};

export default WhoAmIProvider;

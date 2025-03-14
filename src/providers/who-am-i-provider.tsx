"use client"

import useUserStore from "@/store/user.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReactNode } from "react";

const WhoAmIProvider = ({ children }: { children: ReactNode }) => {
  const { setuser } = useUserStore();
  const { data, isPending } = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const response = await axios.get("/api/whoami", {
        withCredentials: true,
      });

      setuser(response.data.data);
      return response.data;
    },
  });
  return <div>{children}</div>;
};

export default WhoAmIProvider;

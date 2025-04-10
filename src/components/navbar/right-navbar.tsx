"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import FollowList from "../user/followList";
import RecomendedProjects from "../user/recommend-project";

const RightNavbar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await authClient.getSession();
        const response = await fetch(`/api/users?exclude=${user?.data?.user.id}&limit=5`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="sticky left-0 top-20 mt-5 md:pr-5 lg:pr-0">
      <FollowList />
      <div className="mt-5">
        <RecomendedProjects />
      </div>
    </div>
  );
};

export default RightNavbar;

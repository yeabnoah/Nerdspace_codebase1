"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfileStatsProps {
  nerdAt: string;
  userId: string;
}

interface Stats {
  following: number;
  followers: number;
}

export default function UserProfileStats({ nerdAt, userId }: UserProfileStatsProps) {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ following: 0, followers: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [followingRes, followersRes] = await Promise.all([
          axios.get(`/api/users/${userId}/following?limit=1`),
          axios.get(`/api/users/${userId}/followers?limit=1`)
        ]);

        setStats({
          following: followingRes.data.pagination.total,
          followers: followersRes.data.pagination.total
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="mb-4 flex gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>
    );
  }

  return (
    <div className="mb-4 flex gap-4">
      <Link
        href={`/app/profile/${nerdAt}/following`}
        className="text-sm text-muted-foreground hover:text-primary"
        onClick={(e) => {
          e.preventDefault();
          router.push(`/app/profile/${nerdAt}/following`);
        }}
      >
        <span className="font-medium text-foreground">
          {stats.following}
        </span>{" "}
        Following
      </Link>
      <Link
        href={`/app/profile/${nerdAt}/followers`}
        className="text-sm text-muted-foreground hover:text-primary"
        onClick={(e) => {
          e.preventDefault();
          router.push(`/app/profile/${nerdAt}/followers`);
        }}
      >
        <span className="font-medium text-foreground">
          {stats.followers}
        </span>{" "}
        Followers
      </Link>
    </div>
  );
} 
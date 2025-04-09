"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import { User } from "@prisma/client";

interface FollowListProps {
  type: "followers" | "following";
  nerdAt: string;
}

interface PaginatedResponse {
  data: User[];
  pagination: {
    nextCursor: string | null;
    hasNextPage: boolean;
    total: number;
  };
}

export default function FollowList({ type, nerdAt }: FollowListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  const fetchUsers = async () => {
    if (!hasNextPage || isLoading) return;

    setIsLoading(true);
    try {
      const url = new URL(
        `/api/users/${nerdAt}/${type}`,
        window.location.origin
      );
      if (cursor) {
        url.searchParams.set("cursor", cursor);
      }
      url.searchParams.set("limit", "10");

      const response = await fetch(url.toString());
      const data: PaginatedResponse = await response.json();

      setUsers((prev) => [...prev, ...data.data]);
      setCursor(data.pagination.nextCursor);
      setHasNextPage(data.pagination.hasNextPage);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchUsers();
    }
  }, [inView]);

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/profile/${user.nerdAt}`}
          className="flex items-center gap-4 rounded-lg p-4 hover:bg-accent"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={user.image || "/user.jpg"}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">Nerd@{user.nerdAt}</p>
          </div>
        </Link>
      ))}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isLoading && <div>Loading...</div>}
        </div>
      )}
    </div>
  );
} 
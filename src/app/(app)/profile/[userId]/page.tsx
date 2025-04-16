// This is a Next.js server component for profile pages
"use client";

import { use } from "react";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold">Profile {userId}</h1>
    </div>
  );
}

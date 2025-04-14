// This is a Next.js server component for profile pages
"use client";

import { use } from "react";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold">Profile {id}</h1>
    </div>
  );
}

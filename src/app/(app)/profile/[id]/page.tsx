import React from "react";
import { notFound } from "next/navigation";

const ProfilePage = ({ params }: { params: { id: string } }) => {
  // This is the main profile page
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold">Profile {params.id}</h1>
      {/* Add your profile content here */}
    </div>
  );
};

export default ProfilePage;

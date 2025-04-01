"use client";

import { useState } from "react";
import { CommunityProvider } from "@/components/community-provider";
import { CommunityNavbar } from "@/components/community-navbar";
import { CommunitySidebar } from "@/components/community-sidebar";
import { CommunityDetail } from "@/components/community-detail";
import { CommunityDiscover } from "@/components/community-discover";
import { CommunityFormModal } from "@/components/community-form-modal";
import type { Community } from "@/lib/types";

export function CommunityDashboard() {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [communityToEdit, setCommunityToEdit] = useState<Community | undefined>(
    undefined,
  );
  const [activeView, setActiveView] = useState<"my-communities" | "discover">(
    "my-communities",
  );

  const handleOpenCreateModal = () => {
    setCommunityToEdit(undefined);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (community: Community) => {
    setCommunityToEdit(community);
    setFormModalOpen(true);
  };

  return (
    <CommunityProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <CommunityNavbar
          onCreateCommunity={handleOpenCreateModal}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <main className="flex flex-1 flex-col md:flex-row">
          {activeView === "my-communities" ? (
            <div className="flex flex-row gap-5">
              <CommunitySidebar />
              <CommunityDetail onEditCommunity={handleOpenEditModal} />
            </div>
          ) : (
            <CommunityDiscover />
          )}
        </main>
        <CommunityFormModal
          open={formModalOpen}
          onOpenChange={setFormModalOpen}
          communityToEdit={communityToEdit}
        />
      </div>
    </CommunityProvider>
  );
}

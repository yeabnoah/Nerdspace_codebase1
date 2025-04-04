import { CommunityInterface } from "@/interface/auth/community.interface";
import { create } from "zustand";

interface CommunityStore {
  activeView: "my-communities" | "discover";
  setActiveView: (view: "my-communities" | "discover") => void;
  communityToEdit: CommunityInterface;
  setCommunityToEdit: (community: any | undefined) => void;
  isFormModalOpen: boolean;
  setFormModalOpen: (isOpen: boolean) => void;
}

const useCommunityStore = create<CommunityStore>((set) => ({
  activeView: "my-communities",
  setActiveView: (view) => set({ activeView: view }),
  communityToEdit: {} as CommunityInterface,
  setCommunityToEdit: (community) => set({ communityToEdit: community }),
  isFormModalOpen: false,
  setFormModalOpen: (isOpen) => set({ isFormModalOpen: isOpen }),
}));

export default useCommunityStore;

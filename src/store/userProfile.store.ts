import { create } from "zustand";
import UserInterface from "@/interface/auth/user.interface";

interface UserProfileState {
  userProfile: UserInterface | null;
  setUserProfile: (user: UserInterface) => void;
}

const useUserProfileStore = create<UserProfileState>((set) => ({
  userProfile: null,
  setUserProfile: (user) => set({ userProfile: user }),
}));

export default useUserProfileStore;

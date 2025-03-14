import UserInterface from "@/interface/auth/user.interface";
import { create } from "zustand";
import { useFormStore } from "./useFormStore";

interface userStoreInterface {
  user: UserInterface;
  setuser: (newUser: UserInterface) => void;
}

const useUserStore = create<userStoreInterface>((set) => ({
  user: {} as UserInterface,
  setuser: (newUser: UserInterface) => {
    set(() => ({ user: newUser }));
    useFormStore.setState({
      nerdAt: newUser.nerdAt!,
      bio: newUser.bio!,
      displayName: newUser.visualName!,
      link: newUser.link!,
      selectedImage: newUser.image!,
    });
  },
}));

export default useUserStore;

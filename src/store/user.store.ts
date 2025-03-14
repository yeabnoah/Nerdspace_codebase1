import UserInterface from "@/interface/auth/user.interface";
import { create } from "zustand";
import { useFormStore } from "./useFormStore";

interface userStoreInterface {
  isloading: boolean;
  setIsLoading: (data: boolean) => void;
  user: UserInterface;
  setuser: (newUser: UserInterface) => void;
}

const useUserStore = create<userStoreInterface>((set) => ({
  isloading: true,
  setIsLoading: (data) => {
    set({
      isloading: data,
    });
  },
  user: {} as UserInterface,
  setuser: (newUser: UserInterface) => {
    set(() => ({ user: newUser }));
    useFormStore.setState({
      nerdAt: newUser.nerdAt!,
      bio: newUser.bio!,
      displayName: newUser.visualName!,
      link: newUser.link!,
      selectedImage: newUser.image!,
      // selectedCountry: newUser.country,
    });
  },
}));

export default useUserStore;

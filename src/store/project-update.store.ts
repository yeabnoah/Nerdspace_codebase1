import { UpdateInterface } from "@/interface/auth/project.interface";
import { create } from "zustand";

interface ProjectUpdateInterface {
  projectUpdate: UpdateInterface;
  setProjectUpdate: (projectUpdate: UpdateInterface) => void;
  reset: () => void;
}

const useProjectUpdateStore = create<ProjectUpdateInterface>((set) => ({
  projectUpdate: {} as UpdateInterface,
  setProjectUpdate: (projectUpdateIncoming: UpdateInterface) => {
    set({
      projectUpdate: projectUpdateIncoming,
    });
  },
  reset: () => {
    set({
      projectUpdate: {} as UpdateInterface,
    });
  },
}));

export default useProjectUpdateStore;

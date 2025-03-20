import { create } from "zustand";

type FileWithPreview = {
  file: File;
  id: string;
  preview: string;
  type: "image" | "video" | "gif";
};

interface FileStore {
  files: FileWithPreview[];
  error: string | null;
  addFiles: (newFiles: FileWithPreview[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setError: (error: string | null) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  error: null,
  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles].slice(0, 4),
    })),
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),
  clearFiles: () => set({ files: [] }),
  setError: (error) => set({ error }),
}));

"use client";

import { useRef, type ChangeEvent } from "react";
import { X, ImageIcon, Film, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileStore } from "@/store/fileStore";
import axios from "axios";

interface PostFileUploaderProps {
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesSelected?: (files: File[]) => void;
  acceptedFileTypes?: string[];
}

export function PostFileUploader({
  maxFiles = 4,
  maxSize = 50,
  onFilesSelected,
  acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/quicktime",
  ],
}: PostFileUploaderProps) {
  const { files, addFiles, removeFile, clearFiles, setError, error } = useFileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    await processFiles(selectedFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFiles = async (selectedFiles: File[]) => {
    setError(null);

    if (files.length + selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (!acceptedFileTypes.includes(file.type)) {
        setError(`File type ${file.type} is not supported.`);
        return false;
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} exceeds the maximum size of ${maxSize}MB.`);
        return false;
      }

      return true;
    });

    const newFilesWithPreview = validFiles.map((file) => {
      const id = crypto.randomUUID();
      let type: "image" | "video" | "gif" = "image";

      if (file.type.startsWith("video/")) {
        type = "video";
      } else if (file.type === "image/gif") {
        type = "gif";
      }

      return {
        file,
        id,
        preview: URL.createObjectURL(file),
        type,
      };
    });

    addFiles(newFilesWithPreview);

    if (onFilesSelected) {
      onFilesSelected(validFiles);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (fileType.startsWith("video/")) return <Film className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="m-0 border-none bg-transparent p-0 shadow-none"
          onClick={() => {
            fileInputRef.current?.setAttribute(
              "accept",
              "image/jpeg,image/png,image/gif",
            );
            fileInputRef.current?.click();
          }}
        >
          <ImageIcon className="mx-2 h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          className="m-0 border-none bg-transparent p-0 shadow-none"
          onClick={() => {
            fileInputRef.current?.setAttribute(
              "accept",
              "video/mp4,video/quicktime",
            );
            fileInputRef.current?.click();
          }}
        >
          <Film className="mx-2 h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          className="m-0 border-none bg-transparent p-0 shadow-none"
          onClick={() => {
            fileInputRef.current?.setAttribute("accept", "image/gif");
            fileInputRef.current?.click();
          }}
        >
          <File className="mx-2 h-5 w-5" />
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative overflow-hidden h-36 rounded-lg border"
            >
              <div className="relative aspect-square bg-gray-100">
                {file.type === "image" || file.type === "gif" ? (
                  <img
                    src={file.preview || "/placeholder.svg"}
                    alt={file.file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={file.preview}
                    className=" h-full w-full object-cover"
                    controls
                  />
                )}

                <div className="absolute right-2 top-2 flex gap-1 ">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

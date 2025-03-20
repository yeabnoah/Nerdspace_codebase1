"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileWithPreview = {
  file: File;
  id: string;
  preview: string;
  type: "image";
  status?: "idle" | "uploading" | "complete" | "error";
  progress?: number;
};

interface FileUploaderProps {
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesSelected?: (files: File[]) => void;
  acceptedFileTypes?: string[];
}

export function FileUploader({
  maxFiles = 4,
  maxSize = 50, // 50MB default
  onFilesSelected,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"],
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);

    // Reset the input value so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (selectedFiles: File[]) => {
    setError(null);

    // Check if adding these files would exceed the max number
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
        setError(`File type ${file.type} is not supported.`);
        return false;
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} exceeds the maximum size of ${maxSize}MB.`);
        return false;
      }

      return true;
    });

    // Create preview for each file
    const newFilesWithPreview = validFiles.map((file) => {
      const id = crypto.randomUUID();
      return {
        file,
        id,
        preview: URL.createObjectURL(file),
        type: "image",
        status: "idle" as const,
        progress: 0,
      };
    });

    const updatedFiles = [...files, ...newFilesWithPreview].slice(0, maxFiles);
    setFiles(updatedFiles as FileWithPreview[]);

    // Call the callback with the raw File objects
    if (onFilesSelected) {
      onFilesSelected(updatedFiles.map((f) => f.file));
    }
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter((f) => f.id !== id);
    setFiles(updatedFiles);

    // Call the callback with the updated raw File objects
    if (onFilesSelected) {
      onFilesSelected(updatedFiles.map((f) => f.file));
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    return null;
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload area */}
      <div
        className={cn(
          "rounded-lg border border-dashed p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300",
          "cursor-pointer",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-8 w-8 text-gray-400" />
          <h3 className="text-base font-medium">
            Drag & drop files or click to browse
          </h3>
          <p className="text-sm text-gray-500">
            Supports images up to {maxSize}MB
          </p>

          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative h-32 overflow-hidden rounded-lg border"
            >
              <div className="relative aspect-square size-2xl bg-gray-100">
                <img
                  src={file.preview || "/placeholder.svg"}
                  alt={file.file.name}
                  className="h-32 w-full object-cover"
                />

                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-white/90 hover:bg-white"
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
    </div>
  );
}

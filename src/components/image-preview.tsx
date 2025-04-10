"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  RotateCw,
  Copy,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";

interface ImagePreviewDialogProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImagePreviewDialog({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImagePreviewDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setRotation(0);
    }
  }, [initialIndex, isOpen]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 1));
  };

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Failed to download image: ", error);
      toast.error("Failed to download image");
    }
  };

  const handleCopy = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      // Convert JPEG to PNG for clipboard compatibility
      const img = new window.Image();
      img.src = URL.createObjectURL(blob);
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const pngBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });
      const item = new ClipboardItem({ 'image/png': pngBlob });
      await navigator.clipboard.write([item]);
      toast.success("Image copied to clipboard");
    } catch (error) {
      console.error("Failed to copy image: ", error);
      toast.error("Failed to copy image");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTitle className="sr-only">Image Preview</DialogTitle>
      <DialogContent 
        className="flex h-screen max-w-[100vw] items-center justify-center border-none bg-black/30 p-0 dark:bg-black/10"
        aria-describedby="image-preview-description"
      >
        <div id="image-preview-description" className="sr-only">
          Image preview dialog with navigation and zoom controls
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
            onClick={onClose}
            style={{ color: 'white' }}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Image container */}
          <div className="relative flex h-full w-full items-center justify-center overflow-auto">
            <div
              className="relative"
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
            >
              <Image
                src={images[currentIndex] || "/placeholder.svg?height=600&width=600"}
                alt={`Image ${currentIndex + 1}`}
                width={1000}
                height={1000}
                className="h-fit w-fit rounded-xl object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40 md:left-4 md:h-10 md:w-10"
              onClick={goToPrevious}
              style={{ color: 'white' }}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40 md:right-4 md:h-10 md:w-10"
              onClick={goToNext}
              style={{ color: 'white' }}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>

            {/* Feature buttons */}
            <div className="absolute bottom-4 right-2 flex flex-col items-center gap-2 rounded-full border border-white/10 p-1 dark:border-black/10 md:right-4 md:gap-4 md:p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40 md:h-10 md:w-10"
                onClick={handleZoomIn}
                style={{ color: 'white' }}
              >
                <ZoomIn className="h-5 w-5 md:h-6 md:w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40 md:h-10 md:w-10"
                onClick={handleZoomOut}
                style={{ color: 'white' }}
              >
                <ZoomOut className="h-5 w-5 md:h-6 md:w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40 md:h-10 md:w-10"
                onClick={handleRotate}
                style={{ color: 'white' }}
              >
                <RotateCw className="h-5 w-5 md:h-6 md:w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40 md:h-10 md:w-10"
                onClick={handleDownload}
                style={{ color: 'white' }}
              >
                <Download className="h-5 w-5 md:h-6 md:w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40 md:h-10 md:w-10"
                onClick={handleCopy}
                style={{ color: 'white' }}
              >
                <Copy className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </div>

            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform items-center justify-center gap-1.5 py-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-2.5 py-1 text-sm text-white dark:bg-white/20 dark:text-black">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

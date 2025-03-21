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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = images[currentIndex];
    link.download = `image-${currentIndex + 1}.jpg`;
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(images[currentIndex]);
    alert("Image URL copied to clipboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTitle className="sr-only">Image Preview</DialogTitle>
      <DialogContent className="flex h-screen max-w-[100vw] items-center justify-center border-none bg-black/30 p-0 dark:bg-black/10">
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Image container */}
          <div className="relative flex h-full w-full items-center justify-center">
            <div
              className="relative"
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
            >
              <Image
                src={
                  images[currentIndex] ||
                  "/placeholder.svg?height=600&width=600"
                }
                alt={`Image ${currentIndex + 1}`}
                width={1000}
                height={1000}
                className="h-fit w-fit rounded-xl object-contain"
                priority
              />
            </div>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Feature buttons */}
            <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4 rounded-full border border-white/10 p-2 dark:border-black/10">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
                onClick={handleRotate}
              >
                <RotateCw className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
                onClick={handleDownload}
              >
                <Download className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 dark:bg-white/20 dark:text-black dark:hover:bg-white/40"
                onClick={handleCopy}
              >
                <Copy className="h-6 w-6" />
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

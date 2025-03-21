"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

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

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTitle className="sr-only">Image Preview</DialogTitle>
      <DialogContent className="flex h-screen w-screen items-center justify-center rounded-none border-none bg-black/50 p-0">
        <div className="relative flex h-full w-full max-w-4xl flex-col items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Image container */}
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="relative" style={{ transform: `scale(${zoom})` }}>
              <Image
                src={
                  images[currentIndex] ||
                  "/placeholder.svg?height=600&width=600"
                }
                alt={`Image ${currentIndex + 1}`}
                width={1000}
                height={1000}
                className="max-h-full max-w-full object-contain"
                priority
              />
            </div>
            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            {/* Zoom buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-20 right-4 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-6 w-6" />
            </Button>
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
            <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-2.5 py-1 text-sm text-white"></div>
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

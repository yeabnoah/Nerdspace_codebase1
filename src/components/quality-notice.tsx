"use client";

import { Bell, Info, ImagePlus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const QualityNotice = () => {
  const [showQualityTip, setShowQualityTip] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowQualityTip(true)}
      onMouseLeave={() => setShowQualityTip(false)}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative h-9 w-9 rounded-full"
      >
        <ImagePlus className="h-5 w-5 text-purple-500" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white ring-2 ring-white dark:ring-black">
          !
        </span>
      </Button>

      {showQualityTip && (
        <div className="absolute right-0 top-[120%] w-64 rounded-xl border border-purple-500/20 bg-white p-3 text-sm shadow-lg dark:bg-black">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
            <div>
              <p className="font-medium text-purple-500">Quality Guidelines</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Please ensure your images are high-quality and relevant to maintain our community standards 📸✨
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityNotice; 
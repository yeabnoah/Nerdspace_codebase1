"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

export function MobileViewMessage() {
  const imageList = useMemo(
    () => [
      "/03.png",
      "/01.png",
      "/Enistine.png",
      "/Elon.png",
      "/05.png",
      "/04.png",
    ],
    [],
  );

  function shuffleArray(array: string[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const [shuffledImages, setShuffledImages] = useState<string[]>(imageList);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setShuffledImages(shuffleArray(imageList));
    setCurrentImageIndex(0);
  }, [imageList]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        if (prevIndex + 1 >= shuffledImages.length) {
          setShuffledImages(shuffleArray(imageList));
          return 0;
        }
        return prevIndex + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [shuffledImages, currentImageIndex, imageList]);

  return (
    <div className="fixed inset-0 z-50 flex min-h-svh flex-col bg-[#0A0A0A] md:hidden">
      <div className="relative flex-1">
        <div className="absolute inset-0">
          <Image
            src={shuffledImages[currentImageIndex]}
            alt="Background"
            fill
            className="object-cover brightness-[0.8]"
            priority
            quality={100}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]"></div>
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />
      </div>
      
      <div className="relative z-10 p-8">
        <h1 className="mb-3 text-[42px] font-bold leading-[1.1] text-white">
          mobile view<br />
          <span className="text-white">coming soon.</span>
        </h1>
        <p className="text-base text-[#8F8F8F]">
          we&apos;re working on bringing NerdSpace<br />
          to mobile devices. please use a<br />
          larger screen for the best experience.
        </p>
      </div>

      <div className="absolute bottom-4 right-4 z-30 text-sm font-bold text-gray-400">
        Built by{" "}
        <a
          href="https://x.com/technerd556"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-white"
        >
          TechNerd
        </a>
      </div>

      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
} 
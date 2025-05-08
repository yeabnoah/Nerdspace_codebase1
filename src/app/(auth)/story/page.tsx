"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StoryPage() {
  return (
    <div className="relative bg-[#0A0A0A] min-h-svh">
      <div className="relative grid grid-cols-1 lg:grid-cols-6 min-h-svh">
        <div className="relative flex flex-col col-span-1 lg:col-span-2 p-4 sm:p-6 lg:p-12 lg:pl-16 border-white/10 lg:border-r border-b lg:border-b-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full lg:max-w-[370px]"
          >
            <Link 
              href="/login"
              className="flex items-center gap-2 mb-6 sm:mb-8 text-[#8F8F8F] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            {/* Scrollable story container */}
            <div className="pr-4 h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
              <h1 className="mb-6 sm:mb-8 font-bold text-white lg:text-[60px] text-4xl sm:text-5xl leading-[1.1]">
                My <br />
                <span className="text-white">Story</span>
              </h1>

              <div className="space-y-4 sm:space-y-6 pb-16 text-[#8F8F8F] text-base sm:text-lg">
                <p>
                  I&apos;ve always been that kid who dives way too deep into things. Whether it was tech, storytelling, music, or random historical rabbit holes at 2 a.m., I never knew how to do &quot;casual interest.&quot; If I loved something, I obsessed over it. I wanted to understand how it worked, where it came from, and how far I could take it.
                </p>

                <p>
                  But somewhere along the way, I realized that kind of passion can feel lonely. You know, when your eyes light up talking about something you love, and the people around you just smile politely — but don&apos;t really get it. That&apos;s when I started thinking: what if there was a space where that energy — that nerdiness — was the norm, not the exception?
                </p>

                <p>
                  That&apos;s how NerdSpace was born.
                </p>

                <p>
                  I didn&apos;t want to build just another social network. I wanted to create a home for people like me — and maybe like you — who are obsessed with their craft, who love sharing their process, geeking out with others, and getting inspired by others doing the same.
                </p>

                <p>
                  NerdSpace is where we celebrate deep dives, midnight breakthroughs, weird side projects, and the joy of building, exploring, and learning. It&apos;s where artists, coders, scientists, writers, gamers, historians, engineers, tinkerers — all kinds of nerds — can find each other, learn from each other, and maybe even create something together.
                </p>

                <p>
                  I&apos;m still learning and growing as a builder, and NerdSpace is growing with me. It&apos;s not perfect, and it never will be — because like any passion project, it&apos;ll always be evolving.
                </p>

                <p>
                  But it&apos;s real. It&apos;s built with care. And it&apos;s for us.
                </p>

                <p>
                  Welcome to NerdSpace. I&apos;m glad you&apos;re here.
                </p>

                <div className="pt-6 sm:pt-8">
                  <p className="text-white">Yeabsra Ashebir (Tech Nerd)</p>
                  <div className="flex gap-4 mt-3 sm:mt-4">
                    <a
                      href="https://t.me/selfmadecoder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8F8F8F] hover:text-white transition-colors"
                    >
                      Telegram
                    </a>
                    <a
                      href="https://x.com/technerd556"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8F8F8F] hover:text-white transition-colors"
                    >
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="hidden lg:block relative col-span-4">
          <div className="absolute inset-0">
            <Image
              src="/03.png"
              alt="Background"
              fill
              className="brightness-[0.8] object-cover"
              priority
              quality={100}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent"></div>
          {/* Add noise/grain overlay */}
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: "overlay"
            }}
          />
        </div>
      </div>
      {/* Add subtle grain effect to entire page */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay"
        }}
      />
    </div>
  );
} 
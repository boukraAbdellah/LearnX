"use client";

import React from "react";
import Image from "next/image";
import { PlayCircleFilledIcon } from "@/components/ui/icons";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

interface LessonVideoEmbedProps {
  videoUrl?: string | null;
  startSeconds?: number | null;
  title: string;
  thumbnail?: SanityImageSource | null;
  duration?: number | null;
}

/** Parse video provider information and construct an embed URL */
function resolveEmbedUrl(
  rawUrl: string,
  startSeconds?: number | null
): { embedUrl: string; type: "iframe" | "video" } | null {
  const url = rawUrl.trim();
  const start = startSeconds && startSeconds > 0 ? Math.floor(startSeconds) : 0;

  // 1. YouTube
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch =
    url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const params = new URLSearchParams({
      autoplay: "0",
      rel: "0",
      modestbranding: "1",
    });
    if (start > 0) {
      params.set("start", String(start));
    }
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`,
      type: "iframe",
    };
  }

  // 2. Vimeo
  // Matches: vimeo.com/123456789 or player.vimeo.com/video/123456789
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    const timeParam = start > 0 ? `#t=${start}s` : "";
    return {
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=0${timeParam}`,
      type: "iframe",
    };
  }

  // 3. Bunny Stream
  if (url.includes("mediadelivery.net") || url.includes("b-cdn.net")) {
    const separator = url.includes("?") ? "&" : "?";
    const timeParam = start > 0 ? `${separator}t=${start}` : "";
    return {
      embedUrl: `${url}${timeParam}`,
      type: "iframe",
    };
  }

  // 4. Direct video file (mp4, webm)
  if (/\.(mp4|webm|ogg)($|\?)/i.test(url)) {
    return {
      embedUrl: url,
      type: "video",
    };
  }

  // 5. Generic embed iframe fallback
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return {
      embedUrl: url,
      type: "iframe",
    };
  }

  return null;
}

/** Format seconds to mm:ss or hh:mm:ss */
function formatDuration(totalSeconds: number | null | undefined): string {
  if (!totalSeconds || totalSeconds <= 0) return "";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function LessonVideoEmbed({
  videoUrl,
  startSeconds,
  title,
  thumbnail,
  duration,
}: LessonVideoEmbedProps) {
  const resolved = videoUrl ? resolveEmbedUrl(videoUrl, startSeconds) : null;
  const thumbnailUrl = thumbnail ? urlFor(thumbnail).width(1280).height(720).url() : null;

  return (
    <div className="w-full relative rounded-2xl overflow-hidden bg-neutral-900 border border-[#EDE5DF] shadow-md aspect-video">
      {resolved?.type === "iframe" ? (
        <iframe
          src={resolved.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      ) : resolved?.type === "video" ? (
        <video
          src={resolved.embedUrl}
          controls
          playsInline
          poster={thumbnailUrl ?? undefined}
          className="w-full h-full object-cover absolute inset-0"
        />
      ) : (
        /* Fallback poster when videoUrl is missing or invalid */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white relative">
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover opacity-40"
            />
          )}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary-500/90 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105">
              <PlayCircleFilledIcon size={44} />
            </div>
            <h3 className="font-sans font-semibold text-lg max-w-md line-clamp-2">
              {title}
            </h3>
            {duration && (
              <span className="text-xs bg-neutral-800/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-neutral-300 font-medium border border-neutral-700">
                {formatDuration(duration)}
              </span>
            )}
            <p className="text-xs text-neutral-400">
              Video lesson will begin when ready
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

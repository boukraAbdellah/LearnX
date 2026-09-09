import React from "react";

export interface BottomBarsProps {
  className?: string;
}

/**
 * Signature Bottom Equalizer Bars component
 * Recreates the decorative atmospheric gradient equalizer bars at the bottom of LearnX
 * rendered dynamically with pure SVG/CSS using the Deep Indigo primary palette.
 */
export function BottomBars({ className = "" }: BottomBarsProps) {
  return (
    <footer
      className={`w-full overflow-hidden mt-auto leading-none select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1024 218"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto min-h-[140px] max-h-[220px] block"
      >
        <defs>
          {/* Deep Indigo Gradient - Vibrant Peak (Bars 3, 10, 14) */}
          <linearGradient id="indigo-bar-peak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
            <stop offset="18%" stopColor="#6366F1" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#4F46E5" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4338CA" stopOpacity="0.82" />
          </linearGradient>

          {/* Deep Indigo Gradient - Medium Height Bars */}
          <linearGradient id="indigo-bar-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
            <stop offset="22%" stopColor="#6366F1" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.70" />
          </linearGradient>

          {/* Deep Indigo Gradient - Soft/Lighter Alternating Bars */}
          <linearGradient id="indigo-bar-soft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0" />
            <stop offset="25%" stopColor="#818CF8" stopOpacity="0.16" />
            <stop offset="65%" stopColor="#6366F1" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.58" />
          </linearGradient>

          {/* Subtle Ambient Base Glow tying the bars at the bottom */}
          <linearGradient id="indigo-base-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
            <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4338CA" stopOpacity="0.32" />
          </linearGradient>

          {/* Subtle top edge blur filter for atmospheric diffusion */}
          <filter id="bar-blur" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Individual Equalizer Bars */}
        {/* Left Cluster */}
        {/* Bar 1: Left start */}
        <rect
          x="0"
          y="123"
          width="78"
          height="95"
          fill="url(#indigo-bar-soft)"
          opacity="0.9"
        />

        {/* Bar 2: Stepping up */}
        <rect
          x="78"
          y="96"
          width="68"
          height="122"
          fill="url(#indigo-bar-mid)"
        />

        {/* Bar 3: High riser */}
        <rect
          x="146"
          y="53"
          width="68"
          height="165"
          fill="url(#indigo-bar-peak)"
          opacity="0.95"
        />

        {/* Bar 4: Left Peak */}
        <rect
          x="214"
          y="23"
          width="72"
          height="195"
          fill="url(#indigo-bar-peak)"
        />

        {/* Bar 5: Stepping down */}
        <rect
          x="286"
          y="80"
          width="70"
          height="138"
          fill="url(#indigo-bar-mid)"
          opacity="0.92"
        />

        {/* Bar 6: Low descent */}
        <rect
          x="356"
          y="116"
          width="62"
          height="102"
          fill="url(#indigo-bar-soft)"
          opacity="0.88"
        />

        {/* Center Valley / Subtle low bridge */}
        <rect
          x="418"
          y="178"
          width="90"
          height="40"
          fill="url(#indigo-bar-soft)"
          opacity="0.45"
        />

        {/* Bar 8: Rising out of center */}
        <rect
          x="508"
          y="133"
          width="38"
          height="85"
          fill="url(#indigo-bar-soft)"
          opacity="0.85"
        />

        {/* Right Cluster */}
        {/* Bar 9: Stepping up */}
        <rect
          x="546"
          y="126"
          width="74"
          height="92"
          fill="url(#indigo-bar-soft)"
          opacity="0.9"
        />

        {/* Bar 10: Ascending */}
        <rect
          x="620"
          y="90"
          width="70"
          height="128"
          fill="url(#indigo-bar-mid)"
        />

        {/* Bar 11: High riser */}
        <rect
          x="690"
          y="53"
          width="70"
          height="165"
          fill="url(#indigo-bar-mid)"
          opacity="0.95"
        />

        {/* Bar 12: Right Peak (Tallest) */}
        <rect
          x="760"
          y="20"
          width="78"
          height="198"
          fill="url(#indigo-bar-peak)"
        />

        {/* Bar 13: Dip */}
        <rect
          x="838"
          y="108"
          width="44"
          height="110"
          fill="url(#indigo-bar-soft)"
          opacity="0.88"
        />

        {/* Bar 14: Ascending again */}
        <rect
          x="882"
          y="70"
          width="62"
          height="148"
          fill="url(#indigo-bar-mid)"
          opacity="0.95"
        />

        {/* Bar 15: Right edge peak */}
        <rect
          x="944"
          y="38"
          width="80"
          height="180"
          fill="url(#indigo-bar-peak)"
        />

        {/* Ambient base blend across the entire bottom boundary */}
        <rect
          x="0"
          y="165"
          width="1024"
          height="53"
          fill="url(#indigo-base-glow)"
        />
      </svg>
    </footer>
  );
}

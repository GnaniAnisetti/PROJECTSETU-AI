import React from 'react';

/**
 * Subtle abstract infrastructure line / bridge pattern.
 * Ultra-lightweight vector graphics (0 external assets, ~1KB footprint).
 */
export const BridgeBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <svg
        className="w-full h-full text-slate-400/20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="gridPattern" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.25" />
          </pattern>
        </defs>

        {/* Subtle engineering grid */}
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        {/* Cable Stayed Bridge Pylon 1 */}
        <path
          d="M 280 850 L 320 220 L 360 850"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <line x1="320" y1="220" x2="100" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="320" y1="260" x2="140" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="320" y1="300" x2="180" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="320" y1="340" x2="220" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="320" y1="380" x2="260" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />

        <line x1="320" y1="220" x2="540" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="320" y1="260" x2="500" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="320" y1="300" x2="460" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="320" y1="340" x2="420" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="320" y1="380" x2="380" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />

        {/* Cable Stayed Bridge Pylon 2 */}
        <path
          d="M 1080 850 L 1120 220 L 1160 850"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <line x1="1120" y1="220" x2="900" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="1120" y1="260" x2="940" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="1120" y1="300" x2="980" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="1120" y1="340" x2="1020" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="1120" y1="380" x2="1060" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />

        <line x1="1120" y1="220" x2="1340" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="1120" y1="260" x2="1300" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="1120" y1="300" x2="1260" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="1120" y1="340" x2="1220" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
        <line x1="1120" y1="380" x2="1180" y2="720" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />

        {/* Horizontal Deck Corridor Line */}
        <line x1="0" y1="720" x2="1440" y2="720" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
        <line x1="0" y1="728" x2="1440" y2="728" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 4" strokeOpacity="0.3" />

        {/* Gentle Geotechnical Contour Elevation Lines */}
        <path
          d="M 0 680 Q 360 640, 720 670 T 1440 640"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeOpacity="0.25"
        />
        <path
          d="M 0 760 Q 400 780, 800 750 T 1440 770"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeOpacity="0.2"
        />
      </svg>
    </div>
  );
};

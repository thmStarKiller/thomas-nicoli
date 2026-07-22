/** Static dark hero artwork — reduced-motion / no-WebGL / error fallback. */
export function HeroFallback() {
  return (
    <svg
      viewBox="0 0 800 800"
      role="img"
      aria-label="Abstract cobalt orb with orbital rings"
      className="h-full w-full"
    >
      <defs>
        <radialGradient id="hf-glow" cx="50%" cy="46%" r="50%">
          <stop offset="0%" stopColor="#3d5bff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#2f4bff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2f4bff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hf-orb" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#2c2c36" />
          <stop offset="70%" stopColor="#191920" />
          <stop offset="100%" stopColor="#101014" />
        </radialGradient>
        <linearGradient id="hf-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d5bff" stopOpacity="0" />
          <stop offset="55%" stopColor="#3d5bff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#3d5bff" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <circle cx="400" cy="380" r="360" fill="url(#hf-glow)" />
      <circle cx="400" cy="380" r="185" fill="url(#hf-orb)" />
      <circle cx="400" cy="380" r="185" fill="none" stroke="url(#hf-rim)" strokeWidth="3" />

      <ellipse
        cx="400"
        cy="380"
        rx="285"
        ry="96"
        fill="none"
        stroke="#c9c4b8"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        transform="rotate(-14 400 380)"
      />
      <ellipse
        cx="400"
        cy="380"
        rx="330"
        ry="118"
        fill="none"
        stroke="#c9c4b8"
        strokeOpacity="0.22"
        strokeWidth="1.2"
        transform="rotate(-14 400 380)"
      />
      <circle cx="657" cy="316" r="9" fill="#3d5bff" />
      <circle cx="657" cy="316" r="18" fill="none" stroke="#3d5bff" strokeOpacity="0.4" />
    </svg>
  );
}

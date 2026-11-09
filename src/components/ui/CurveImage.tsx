type CurveImageProps = {
  /** Image path/URL to render behind the curved cut. */
  src: string;
  /** Accessible description. Leave empty for purely decorative images. */
  alt?: string;
  /** Extra classes applied to the outer wrapper. */
  className?: string;
  /** 0–1 dark tint drawn over the photo. */
  overlayOpacity?: number;
  /** >1 zooms in on the source image, <1 zooms out. */
  zoom?: number;
  /** Color painted into the curved cut — match the surface behind this component. */
  revealColor?: string;
};

const VIEW_WIDTH = 755;
const VIEW_HEIGHT = 524;

export function CurveImage({
  src,
  alt = "",
  className = "",
  overlayOpacity = 0,
  zoom = 1,
  revealColor = "#ffffff",
}: CurveImageProps) {
  const drawWidth = VIEW_WIDTH * zoom;
  const drawHeight = VIEW_HEIGHT * zoom;
  const drawX = (VIEW_WIDTH - drawWidth) / 2;
  const drawY = (VIEW_HEIGHT - drawHeight) / 2;

  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Base layer — the photo, uniformly scaled so it's never distorted. */}
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <image
          href={src}
          x={drawX}
          y={drawY}
          width={drawWidth}
          height={drawHeight}
          preserveAspectRatio="xMidYMid slice"
        />
        {overlayOpacity > 0 ? (
          <rect
            x="0"
            y="0"
            width={VIEW_WIDTH}
            height={VIEW_HEIGHT}
            fill={`rgba(0,0,0,${overlayOpacity})`}
          />
        ) : null}
      </svg>

      {/* Curve layer — intentionally stretches to fill (never crops), so the
          curve/circle accents stay fully visible on every aspect ratio,
          including tall narrow mobile screens. */}
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle cx="715" cy="520" r="40" fill={revealColor} />
        <rect width="718" height="61" y="480" fill={revealColor} />
        <path
          d="M 0 180 L 0 480.99 L 70 480 C 18 480 0 455 0 430 Z"
          fill={revealColor}
        />
      </svg>
    </div>
  );
}

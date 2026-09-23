import manifest from "@/lib/image-manifest.json";

export type PhotoName = keyof typeof manifest;

type PhotoProps = {
  name: PhotoName;
  /** Layout hint for the browser's srcset picker. Always pass a real one. */
  sizes: string;
  className?: string;
  /** Override the manifest alt text, or pass "" for a purely decorative image. */
  alt?: string;
  /** Set on an above-the-fold image so it is fetched eagerly at high priority. */
  priority?: boolean;
};

/**
 * Photography, served from our own origin.
 *
 * Every photo is pre-encoded to WebP at two fixed widths at build time
 * (see scripts/fetch-images.mjs), so there is no image optimizer in the request
 * path, no `sharp` dependency, and no third-party image host to connect to.
 *
 * Three things keep this fast and stable:
 *  - width/height come from the manifest, so the box is reserved before the
 *    bytes arrive and Cumulative Layout Shift stays at zero;
 *  - backgroundColor is the photo's own average colour, so the reserved box
 *    reads as part of the design instead of flashing grey;
 *  - everything below the fold is lazy and async-decoded.
 */
export default function Photo({ name, sizes, className, alt, priority = false }: PhotoProps) {
  const image = manifest[name];

  return (
    // Bypassing next/image on purpose: these are pre-encoded static WebP assets,
    // so the optimizer would only add a server hop and a sharp dependency.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      style={{ backgroundColor: image.color }}
      className={className}
    />
  );
}

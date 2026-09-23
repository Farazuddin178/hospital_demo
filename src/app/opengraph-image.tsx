import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-data";

// Next.js generates this as /opengraph-image on every route that doesn't
// override it, giving every page a social preview image with zero extra assets.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1c62ad 0%, #0a2540 100%)",
          color: "white",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        <div>{siteConfig.name}</div>
        <div style={{ fontSize: 32, fontWeight: 400, marginTop: 16 }}>{siteConfig.tagline}</div>
      </div>
    ),
    { ...size }
  );
}

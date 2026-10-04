import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-data";
import { locations } from "@/lib/home-content";

// The preview card WhatsApp, Facebook, LinkedIn and X show when the site is
// shared. Generated once at build time, so it costs nothing per request.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.legalName}, ${locations.map((l) => l.area).join(" and ")}, Hyderabad`;

export default function OpengraphImage() {
  // Full-resolution copy made by scripts/make-logo-assets.ps1; the header logo
  // in /public is too small to scale up to share-card size without blurring.
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "assets", "brand", "logo-og.png")).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "#ffffff",
          borderBottom: "16px solid #28536f",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={302} height={352} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#131e27", lineHeight: 1.05 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 32, color: "#28536f", marginTop: 16 }}>{siteConfig.tagline}</div>
          {/* One string per line: the OG renderer rejects mixed text children. */}
          <div style={{ fontSize: 26, color: "#5a6872", marginTop: 40 }}>
            {`${locations.map((l) => l.area).join(" and ")}, Hyderabad`}
          </div>
          <div style={{ fontSize: 26, color: "#5a6872", marginTop: 10 }}>
            {`${siteConfig.phonePrimary}  |  ${siteConfig.phoneSecondary}`}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

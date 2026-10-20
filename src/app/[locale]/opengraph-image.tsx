import { ImageResponse } from "next/og";

export const alt = "Syaha Tour: tailored journeys in Cairo, Luxor and Aswan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand card used for social sharing until verified photography is available.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #123F43 0%, #0B2B2E 60%, #3A2A20 100%)",
          color: "#F7F3EB",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontSize: 64, fontWeight: 600 }}>Syaha</span>
          <span style={{ fontSize: 22, letterSpacing: 12, fontFamily: "sans-serif" }}>TOUR</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>Ancient wonders. Your own Egyptian journey.</div>
          <div style={{ marginTop: 28, fontSize: 26, letterSpacing: 6, color: "#D8BD8F", fontFamily: "sans-serif" }}>
            CAIRO · LUXOR · ASWAN
          </div>
        </div>
        <svg width="1040" height="60" viewBox="0 0 1040 60">
          <path d="M0 40 C 160 0, 300 0, 420 30 S 700 60, 840 20 S 1000 10, 1040 30" fill="none" stroke="#B58B50" strokeWidth="3" />
        </svg>
      </div>
    ),
    size,
  );
}

import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Set ALLOW_INDEXING=true only on the live domain, so previews stay out of search results.
export default function robots(): MetadataRoute.Robots {
  const allow = process.env.ALLOW_INDEXING === "true";
  return {
    rules: allow ? [{ userAgent: "*", allow: "/", disallow: "/api/" }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

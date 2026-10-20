import Image from "next/image";
import { getImage } from "@/content/images";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { Scene } from "./Scene";

/**
 * Renders a verified photograph when one exists for `id`, otherwise the
 * matching original illustration. Fills its (relatively positioned) parent.
 */
export function Photo({
  id,
  locale,
  sizes = "100vw",
  priority = false,
  className = "",
  decorative = false,
}: {
  id: string;
  locale: Locale;
  sizes?: string;
  priority?: boolean;
  className?: string;
  decorative?: boolean;
}) {
  const entry = getImage(id);
  const copy = getContent(locale).images.find((i) => i.id === id);
  const alt = decorative ? "" : (copy?.alt ?? entry.alt);

  if (entry.photo) {
    return (
      <Image
        src={entry.photo.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
        style={entry.focus ? { objectPosition: entry.focus } : undefined}
      />
    );
  }

  return (
    <Scene
      motif={entry.motif}
      tone={entry.tone}
      className={`absolute inset-0 h-full w-full ${className}`}
      title={decorative ? undefined : `${getContent(locale).ui.a11y.illustration}: ${copy?.subject ?? entry.subject}`}
    />
  );
}

import Link from "next/link";
import { Container } from "@/components/blocks";
import { Scene } from "@/components/Scene";
import { getContent } from "@/content";

// Rendered inside the locale layout; falls back to English copy because the
// not-found boundary does not receive route params.
export default function NotFound() {
  const { ui } = getContent("en");
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-nile-deep text-ivory">
      <div className="absolute inset-0 -z-10 opacity-60">
        <Scene motif="desert" tone="night" className="h-full w-full" />
      </div>
      <Container className="py-32">
        <p className="eyebrow eyebrow-light">404</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">{ui.notFound.title}</h1>
        <p className="mt-4 text-lg text-ivory/80">{ui.notFound.body}</p>
        <Link href="/" className="btn btn-gold mt-8">{ui.notFound.home}</Link>
      </Container>
    </section>
  );
}

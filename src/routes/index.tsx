import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const MainframePage = lazy(() => import("../codavolt/MainframePage"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Codavolt — Systems that move business" },
      { name: "description", content: "Codavolt builds automation, custom software, clean data systems, AI tools and integrations for businesses ready to move." },
      { property: "og:title", content: "Codavolt — Systems that move business" },
      { property: "og:description", content: "Automation, custom software, clean data, AI tools and integrations — built around how your business actually works." },
      { property: "og:url", content: "https://www.codavolt.tech/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:domain", content: "codavolt.tech" },
      { name: "twitter:url", content: "https://www.codavolt.tech/" },
    ],
    links: [
      { rel: "canonical", href: "https://www.codavolt.tech/" },
    ],
  }),
  component: Index,
});

function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const fallback = <div style={{ minHeight: "100vh", background: "var(--ink)" }} />;
  if (!mounted) return fallback;
  return (
    <Suspense fallback={fallback}>
      <MainframePage />
    </Suspense>
  );
}

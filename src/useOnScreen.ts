import { useEffect, useRef, useState } from "react";

/**
 * Reports whether the element is near the viewport.
 *
 * Every live panel on this page runs on an interval. Left ungated they all tick
 * forever, including while eight screens away, which is both a waste of battery
 * and a poor look for a studio that sells not doing pointless work.
 *
 * The margin starts panels slightly before they scroll into view, so a sequence
 * is already in motion by the time it is actually looked at.
 */
export function useOnScreen<T extends HTMLElement>(margin = "240px") {
  const ref = useRef<T | null>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Without support, never pause: a still panel is worse than a busy one.
    if (typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => setOnScreen(entries[0].isIntersecting),
      { rootMargin: margin },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [margin]);

  return [ref, onScreen] as const;
}

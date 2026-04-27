import { useEffect } from "react";

const DEFAULTS = {
  selector: ".r",
  visibleClass: "on",
  threshold: 0.1,
  root: null,
  rootMargin: "0px",
};

export default function useReveal(options = {}) {
  const { selector, visibleClass, threshold, root, rootMargin, watch } = {
    ...DEFAULTS,
    ...options,
  };

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, root, rootMargin }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, visibleClass, threshold, root, rootMargin, watch]);
}

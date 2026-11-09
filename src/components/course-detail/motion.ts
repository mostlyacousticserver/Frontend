export const courseEase = [0.22, 1, 0.36, 1] as const;

export const courseFadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: courseEase },
};

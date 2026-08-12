export function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.45,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };
}

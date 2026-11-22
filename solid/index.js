// =====================================================================
// BOODOO — SolidJS Primitives & Headless Signals
// Reactive signals and state controllers for Solid applications
// =====================================================================

export function createDisclosure(options = {}) {
  let open = Boolean(options.defaultOpen);
  const listeners = new Set();

  function notify() {
    listeners.forEach((fn) => fn(open));
  }

  return {
    isOpen() {
      return open;
    },
    open() {
      open = true;
      notify();
    },
    close() {
      open = false;
      notify();
    },
    toggle() {
      open = !open;
      notify();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

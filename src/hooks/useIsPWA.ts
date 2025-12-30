import { useEffect, useState } from "react";

/**
 * Hook to detect if the app is running in PWA (standalone) mode
 * @returns {boolean} true if running in PWA mode, false otherwise
 */
export function useIsPWA(): boolean {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (PWA)
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    // iOS Safari specific check
    const isIOSStandalone =
      (window.navigator as any).standalone === true;

    setIsPWA(isStandalone || isIOSStandalone);
  }, []);

  return isPWA;
}

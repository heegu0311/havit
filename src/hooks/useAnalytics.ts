import { useEffect } from "react";
import ReactGA from "react-ga4";

export const useAnalytics = () => {
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;

    // Exclude development environment
    if (gaId && import.meta.env.MODE === "production") {
      ReactGA.initialize(gaId);
    }
  }, []);
};

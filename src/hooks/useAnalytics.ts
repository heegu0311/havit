import { useEffect } from "react";
import ReactGA from "react-ga4";

export const useAnalytics = () => {
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;

    // 개발 환경 제외
    if (gaId && import.meta.env.MODE === "production") {
      ReactGA.initialize(gaId);
    }
  }, []);
};

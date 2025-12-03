import { LinearCalendar2026 } from "./components/LinearCalendar2026";
import { useAnalytics } from "./hooks/useAnalytics.js";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ClarityInitializer from "./components/Clarity.js";

export default function App() {
  useAnalytics();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Havit - simple habit tracker</title>
        <meta name="description" content="Have your habit" />
        <meta property="og:title" content="havit - have your habit" />
        <meta
          property="og:description"
          content="Achieve your goals with habits 2026"
        />
      </Helmet>
      <ClarityInitializer />
      <div className="min-h-screen bg-[#FFF5F0] p-4 md:p-8">
        <LinearCalendar2026 />
      </div>
    </HelmetProvider>
  );
}

import { LinearCalendar2026 } from "./components/LinearCalendar2026";
import { useAnalytics } from "./hooks/useAnalytics.js";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function App() {
  useAnalytics();

  return (
    <HelmetProvider>
      <Helmet>
        <title>홈페이지 타이틀</title>
        <meta name="description" content="habit tracker" />
        <meta property="og:title" content="havit - have your habit" />
        <meta
          property="og:description"
          content="Achieve your goals with habits 2026"
        />
      </Helmet>
      <div className="min-h-screen bg-[#FFF5F0] p-4 md:p-8">
        <LinearCalendar2026 />
      </div>
    </HelmetProvider>
  );
}

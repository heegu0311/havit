import { LinearCalendar } from "./components/LinearCalendar.tsx";
import { useAnalytics } from "./hooks/useAnalytics.js";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ClarityInitializer from "./components/Clarity.js";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
      <AuthProvider>
        <ClarityInitializer />
        <ProtectedRoute>
          <div className="min-h-screen bg-[#FFF5F0] p-4 md:p-8">
            <LinearCalendar />
          </div>
        </ProtectedRoute>
      </AuthProvider>
    </HelmetProvider>
  );
}

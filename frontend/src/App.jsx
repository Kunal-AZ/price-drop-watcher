import React, { Suspense, lazy } from "react";
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const LandingPage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/Login"));
const RegisterPage = lazy(() => import("./pages/Register"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FeaturesPage = lazy(() => import("./pages/FeaturesPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));

const Loader = () => (
  <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
    <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-blue-500" />
  </div>
);

const PublicRoute = ({ children }) => children;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Route render crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const details =
        import.meta.env.DEV && this.state.error
          ? this.state.error.message
          : null;

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-red-900 px-6 text-center text-white">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          {details ? (
            <p className="mt-3 max-w-xl text-sm text-red-100">{details}</p>
          ) : null}
        </div>
      );
    }

    return this.props.children;
  }
}

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/help" element={<HelpPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function RoutedApp() {
  const location = useLocation();

  return (
    <ErrorBoundary key={location.pathname}>
      <AppRoutes />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutedApp />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#e2e8f0",
              backdropFilter: "blur(10px)",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

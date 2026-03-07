import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const CreateEventPage = lazy(() => import("../pages/CreateEventPage"));
const EventsListPage = lazy(() => import("../pages/EventsListPage"));
const EventDetailPage = lazy(() => import("../pages/EventDetailPage"));
const MatchFacePage = lazy(() => import("../pages/MatchFacePage"));
const FindPhotosPage = lazy(() => import("../pages/FindPhotosPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const Fallback = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute requireOrganizer>
              <EventsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute requireOrganizer>
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute requireOrganizer>
              <EventDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId/match"
          element={
            <ProtectedRoute>
              <MatchFacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-photos"
          element={
            <ProtectedRoute>
              <FindPhotosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

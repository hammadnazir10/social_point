import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AuthLayout = lazy(() => import('./layouts/AuthLayout'));

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));

// Main Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TopicDetailPage = lazy(() => import('./pages/TopicDetailPage'));
const CreateTopicPage = lazy(() => import('./pages/topic/CreateTopicPage'));
const EditTopicPage = lazy(() => import('./pages/topic/EditTopicPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EditProfilePage = lazy(() => import('./pages/profile/EditProfilePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const TrendingPage = lazy(() => import('./pages/TrendingPage'));

// Components
import AuthGuard from './components/auth/AuthGuard';
import Loader from './components/common/Loader';

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Main Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            
            {/* Topic Routes */}
            <Route path="/topic/:id" element={<TopicDetailPage />} />
            <Route element={<AuthGuard />}>
              <Route path="/topic/create" element={<CreateTopicPage />} />
              <Route path="/topic/edit/:id" element={<EditTopicPage />} />
            </Route>

            {/* Profile Routes */}
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route element={<AuthGuard />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
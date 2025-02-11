import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { getAnonymousUserId } from './hooks/anonymousUser';
import React from 'react';

// Layouts
const MainLayout = lazy(() => import('/src/layouts/MainLayout'));
const AuthLayout = lazy(() => import('/src/layouts/AuthLayout'));

// Pages
const HomePage = lazy(() => import('/src/pages/HomePage'));
const TopicDetailPage = lazy(() => import('/src/pages/TopicDetailPage'));
const CreateTopicPage = lazy(() => import('/src/pages/CreateTopicPage'));
const EditTopicPage = lazy(() => import('/src/pages/EditTopicPage'));
const ProfilePage = lazy(() => import('/src/pages/ProfilePage'));
const SearchPage = lazy(() => import('/src/pages/SearchPage'));

const App = () => {
  const userId = getAnonymousUserId();

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/topic/:id" element={<TopicDetailPage />} />
            <Route path="/topic/create" element={<CreateTopicPage />} />
            <Route path="/topic/edit/:id" element={<EditTopicPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
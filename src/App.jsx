import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/ui/PageTransition';

// Route-level code splitting — each page chunk loads on demand
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ReportIssue = React.lazy(() => import('./pages/ReportIssue'));
const GitCheatSheet = React.lazy(() => import('./pages/GitCheatSheet'));
const AiNewsroom = React.lazy(() => import('./pages/AiNewsroom'));
const Company = React.lazy(() => import('./pages/Company'));
const TrendingLanguages = React.lazy(() => import('./pages/TrendingLanguages'));
const InfoPage = React.lazy(() => import('./pages/InfoPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const ErrorPage = React.lazy(() => import('./pages/ErrorPage'));

/** Minimal page loader shown during route-level chunk loading */
const PageLoader = () => (
  <div
    role="status"
    aria-label="Loading"
    className="min-h-screen bg-[#0A0A0C] flex items-center justify-center"
  >
    <div className="four-dot-loader text-white">
      <span className="dot" aria-hidden="true" />
      <span className="dot" aria-hidden="true" />
      <span className="dot" aria-hidden="true" />
      <span className="dot" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  </div>
);

/** Dynamic InfoPage routes using the visual master renderer */
const DYNAMIC_INFO_ROUTES = ['changelog', 'docs', 'api', 'disclaimer', 'terms', 'privacy'];

function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />

          {/* Dashboard tabs share the same chunk */}
          <Route path="/dashboard" element={<PageTransition><Dashboard activeTab="explore" /></PageTransition>} />
          <Route path="/bookmarks" element={<PageTransition><Dashboard activeTab="bookmarks" /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Dashboard activeTab="profile" /></PageTransition>} />

          {/* Dedicated full-page routes */}
          <Route path="/languages" element={<PageTransition><TrendingLanguages /></PageTransition>} />
          <Route path="/report" element={<PageTransition><ReportIssue /></PageTransition>} />
          <Route path="/report-issue" element={<PageTransition><ReportIssue /></PageTransition>} />
          <Route path="/cheatsheet" element={<PageTransition><GitCheatSheet /></PageTransition>} />
          <Route path="/ai-news" element={<PageTransition><AiNewsroom /></PageTransition>} />
          <Route path="/company" element={<PageTransition><Company /></PageTransition>} />

          {/* Dynamic content InfoPage routes with high-end vision design */}
          {DYNAMIC_INFO_ROUTES.map((key) => (
            <Route
              key={key}
              path={`/${key}`}
              element={<PageTransition><InfoPage contentKey={key} /></PageTransition>}
            />
          ))}

          <Route path="/500" element={<PageTransition><ErrorPage /></PageTransition>} />
          <Route path="/error" element={<PageTransition><ErrorPage /></PageTransition>} />
          <Route path="/404" element={<PageTransition><NotFound /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;

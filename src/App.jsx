import React, { useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InfoPage from './pages/InfoPage';
import Resources from './pages/Resources';
import ReportIssue from './pages/ReportIssue';
import GitCheatSheet from './pages/GitCheatSheet';
import AiNewsroom from './pages/AiNewsroom';
import NotFound from './pages/NotFound';
import PageTransition from './components/ui/PageTransition';
import './styles/App.css';
import { getAvailableContentKeys } from './data/contentLoader';

function App() {
  const location = useLocation();

  // Memoize dynamic routes to avoid regeneration on every render
  const dynamicRoutes = useMemo(
    () => getAvailableContentKeys().filter(key => key !== 'resources').map(key => ({
      key,
      path: `/${key}`,
      contentKey: key
    })),
    []
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition key="home">
            <Home />
          </PageTransition>
        } />
        <Route path="/dashboard" element={
          <PageTransition key="dashboard">
            <Dashboard activeTab="explore" />
          </PageTransition>
        } />
        <Route path="/bookmarks" element={
          <PageTransition key="bookmarks">
            <Dashboard activeTab="bookmarks" />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition key="profile">
            <Dashboard activeTab="profile" />
          </PageTransition>
        } />
        <Route path="/resources" element={
          <PageTransition key="resources">
            <Resources />
          </PageTransition>
        } />
        <Route path="/report" element={
          <PageTransition key="report">
            <ReportIssue />
          </PageTransition>
        } />
        <Route path="/cheatsheet" element={
          <PageTransition key="cheatsheet">
            <GitCheatSheet />
          </PageTransition>
        } />
        <Route path="/ai-news" element={
          <PageTransition key="ai-news">
            <AiNewsroom />
          </PageTransition>
        } />

        {dynamicRoutes.map(route => (
          <Route key={route.key} path={route.path} element={
            <PageTransition key={`info-${route.key}`}>
              <InfoPage contentKey={route.contentKey} />
            </PageTransition>
          } />
        ))}

        <Route path="*" element={
          <PageTransition key="not-found">
            <NotFound />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default App;

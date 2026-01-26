import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InfoPage from './pages/InfoPage';
import NotFound from './pages/NotFound';
import PageTransition from './components/ui/PageTransition';
import './styles/App.css';
import { PAGES_CONTENT } from './data/content';

function App() {
  const location = useLocation();

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

        {Object.keys(PAGES_CONTENT).map(key => (
          <Route key={key} path={`/${key}`} element={
            <PageTransition key={`info-${key}`}>
              <InfoPage contentKey={key} />
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

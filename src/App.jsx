import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InfoPage from './pages/InfoPage';
import PageTransition from './components/ui/PageTransition';
import './styles/App.css';
import { PAGES_CONTENT } from './data/content';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/dashboard" element={
          <PageTransition>
            <Dashboard activeTab="explore" />
          </PageTransition>
        } />
        <Route path="/bookmarks" element={
          <PageTransition>
            <Dashboard activeTab="bookmarks" />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <Dashboard activeTab="profile" />
          </PageTransition>
        } />

        {Object.keys(PAGES_CONTENT).map(key => (
          <Route key={key} path={`/${key}`} element={
            <PageTransition>
              <InfoPage contentKey={key} />
            </PageTransition>
          } />
        ))}

        <Route path="*" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default App;

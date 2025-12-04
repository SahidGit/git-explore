import React, { useState } from 'react';
// import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InfoPage from './pages/InfoPage';
import PageTransition from './components/PageTransition';
import './styles/App.css';

import { PAGES_CONTENT } from './data/content';

function App() {
  const [view, setView] = useState('landing');
  const [activeInfoPage, setActiveInfoPage] = useState(null);
  const [dashboardTab, setDashboardTab] = useState('explore');

  const handleNavigate = (page) => {
    if (page === 'dashboard') {
      setDashboardTab('explore');
      setView('dashboard');
      setActiveInfoPage(null);
    } else if (page === 'landing') {
      setView(page);
      setActiveInfoPage(null);
    } else if (page === 'bookmarks') {
      setDashboardTab('bookmarks');
      setView('dashboard');
      setActiveInfoPage(null);
    } else if (PAGES_CONTENT[page]) {
      setActiveInfoPage(page);
      setView('info');
    }
  };

  const handleDashboardTabChange = (tab) => {
    setDashboardTab(tab);
    setView('dashboard');
  };

  return (
    // <AnimatePresence mode="wait">
    view === 'landing' ? (
      <PageTransition key="landing">
        <Home
          onExplore={() => handleDashboardTabChange('explore')}
          onNavigate={handleNavigate}
          onTabChange={handleDashboardTabChange}
        />
      </PageTransition>
    ) : view === 'dashboard' ? (
      <PageTransition key="dashboard">
        <Dashboard
          onBack={() => setView('landing')}
          initialTab={dashboardTab}
          onNavigate={handleNavigate}
        />
      </PageTransition>
    ) : (
      <PageTransition key="info">
        <InfoPage
          title={PAGES_CONTENT[activeInfoPage]?.title}
          subtitle={PAGES_CONTENT[activeInfoPage]?.subtitle}
          content={PAGES_CONTENT[activeInfoPage]?.content}
          onBack={() => setView('landing')}
        />
      </PageTransition>
    )
    // </AnimatePresence>
  );
}

export default App;

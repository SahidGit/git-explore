import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InfoPage from './pages/InfoPage';
import PageTransition from './components/ui/PageTransition';
import './styles/App.css';

import { PAGES_CONTENT } from './data/content';


function App() {
  const [view, setView] = useState('landing');
  const [activeInfoPage, setActiveInfoPage] = useState(null);
  const [dashboardTab, setDashboardTab] = useState('explore');

  // Handle browser back/forward
  React.useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state;
      if (state) {
        setView(state.view);
        setDashboardTab(state.dashboardTab || 'explore');
        setActiveInfoPage(state.activeInfoPage || null);
      } else {
        // Fallback to URL hash or default
        const hash = window.location.hash.slice(1);
        if (hash === 'dashboard') {
          setView('dashboard');
          setDashboardTab('explore');
        } else if (hash === 'bookmarks') {
          setView('dashboard');
          setDashboardTab('bookmarks');
        } else if (PAGES_CONTENT[hash]) {
          setView('info');
          setActiveInfoPage(hash);
        } else {
          setView('landing');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial load check
    handlePopState({ state: window.history.state });

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateHistory = (newView, newTab = 'explore', newInfoPage = null) => {
    const state = { view: newView, dashboardTab: newTab, activeInfoPage: newInfoPage };
    let url = '#';
    if (newView === 'dashboard') url = `#${newTab === 'explore' ? 'dashboard' : 'bookmarks'}`;
    if (newView === 'info') url = `#${newInfoPage}`;

    window.history.pushState(state, '', url);
  };

  const handleNavigate = (page) => {
    if (page === 'dashboard') {
      setDashboardTab('explore');
      setView('dashboard');
      setActiveInfoPage(null);
      updateHistory('dashboard', 'explore', null);
    } else if (page === 'landing') {
      setView(page);
      setActiveInfoPage(null);
      updateHistory('landing', 'explore', null);
    } else if (page === 'bookmarks') {
      setDashboardTab('bookmarks');
      setView('dashboard');
      setActiveInfoPage(null);
      updateHistory('dashboard', 'bookmarks', null);
    } else if (PAGES_CONTENT[page]) {
      setActiveInfoPage(page);
      setView('info');
      updateHistory('info', 'explore', page);
    }
  };

  const handleDashboardTabChange = (tab) => {
    setDashboardTab(tab);
    setView('dashboard');
    updateHistory('dashboard', tab, null);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
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
              onBack={() => window.history.back()}
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
              onBack={() => window.history.back()}
            />
          </PageTransition>
        )}
      </AnimatePresence>

    </>
  );
}

export default App;


import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIAnalysis from './components/AIAnalysis';
import NewsSection from './components/NewsSection';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Requirements specify: if user is not verified, block access
      if (currentUser && !currentUser.emailVerified) {
        // Enforce the block globally by signing out unverified users
        signOut(auth);
        setUser(null);
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    if (!user) {
      setShowAuth(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analysis':
        return <AIAnalysis />;
      case 'news':
        return <NewsSection />;
      case 'portfolio':
        return (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-6xl mb-4">💼</div>
            <h2 className="text-2xl font-bold mb-2">My Portfolio</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Welcome {user?.displayName || user?.email?.split('@')[0] || 'Investor'}. Your data is securely backed by Firebase Authentication. Manage your assets with institutional-grade intelligence.
            </p>
            <button className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Refresh Data
            </button>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-indigo-200 font-medium animate-pulse">Initializing SmartInvest AI...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!user) {
    return (
      <>
        <LandingPage onStart={handleStart} />
        {showAuth && <Auth onClose={() => setShowAuth(false)} />}
      </>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;

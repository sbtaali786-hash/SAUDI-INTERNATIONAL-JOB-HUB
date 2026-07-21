import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import JobsListingView from './components/JobsListingView';
import JobDetailsView from './components/JobDetailsView';
import ProfileView from './components/ProfileView';
import SavedJobsView from './components/SavedJobsView';
import AdminView from './components/AdminView';
import SEO from './components/SEO';

import { 
  getJobs, getCurrentUser, saveCurrentUser, getProfiles, saveProfiles, 
  getAdminSettings, initStorage 
} from './lib/storage';
import { UserProfile, Job } from './types';
import { Mail, Shield, User, Lock, X, Check, FileText, AlertTriangle } from 'lucide-react';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState<any>({});
  
  // Account sessions state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Auth Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'admin-login'>('login');
  
  // Auth Form Input States
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authError, setAuthError] = useState('');

  // Jobs state for immediate updates
  const [jobs, setJobs] = useState<Job[]>([]);

  // Initialize storage once on mount
  useEffect(() => {
    initStorage();
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user && user.email.toLowerCase() === 'sbtservices7@sbtcabins.com') {
      setIsAdmin(true);
    }
    setJobs(getJobs());
    
    // Simple hash-based router supporting shares
    const handleHashRoute = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#job-detail')) {
        const urlParams = new URLSearchParams(hash.split('?')[1] || '');
        const slug = urlParams.get('slug');
        if (slug) {
          const match = getJobs().find(j => j.slug === slug);
          if (match) {
            setCurrentView('job-detail');
            setViewParams({ slug });
            return;
          }
        }
      } else if (hash === '#jobs') {
        setCurrentView('jobs');
        setViewParams({});
        return;
      } else if (hash === '#admin') {
        setIsAdmin(true);
        setCurrentView('admin');
        setViewParams({});
        return;
      }
      // default
      setCurrentView('home');
      setViewParams({});
    };

    handleHashRoute();
    window.addEventListener('hashchange', handleHashRoute);
    setInitialized(true);

    return () => window.removeEventListener('hashchange', handleHashRoute);
  }, []);

  const handleNavigate = (view: string, params: any = {}) => {
    if (view === 'signin') {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    if (view === 'signup') {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

    if (view === 'admin') {
      setIsAdmin(true);
    }

    setCurrentView(view);
    setViewParams(params);

    // Sync address bar hash for details sharing
    if (view === 'job-detail' && params.slug) {
      window.location.hash = `#job-detail?slug=${params.slug}`;
    } else if (view === 'jobs') {
      window.location.hash = '#jobs';
    } else if (view === 'admin') {
      window.location.hash = '#admin';
    } else if (view === 'home') {
      window.location.hash = '';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefreshJobs = () => {
    setJobs(getJobs());
  };

  // Saved Jobs Toggler
  const handleToggleSaveJob = (jobId: string) => {
    if (!currentUser) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    const saved = [...currentUser.savedJobs];
    const index = saved.indexOf(jobId);
    if (index >= 0) {
      saved.splice(index, 1);
    } else {
      saved.push(jobId);
    }

    const updated: UserProfile = { ...currentUser, savedJobs: saved };
    setCurrentUser(updated);
    saveCurrentUser(updated);

    // Also update in profile listing
    const profiles = getProfiles();
    const pIdx = profiles.findIndex(p => p.uid === currentUser.uid);
    if (pIdx >= 0) {
      profiles[pIdx] = updated;
      saveProfiles(profiles);
    }
  };

  // Applied Logger
  const handleApplyLog = (jobId: string, optionUsed: 'WhatsApp' | 'Email' | 'Call') => {
    if (!currentUser) return; // Silent if guest, still opens trigger

    // Check if already logged for this option to avoid redundant counts
    const alreadyApplied = currentUser.appliedJobs.some(app => app.jobId === jobId && app.optionUsed === optionUsed);
    if (alreadyApplied) return;

    const newApp = {
      jobId,
      appliedAt: new Date().toISOString(),
      cvId: '',
      optionUsed
    };

    const updated: UserProfile = {
      ...currentUser,
      appliedJobs: [newApp, ...currentUser.appliedJobs]
    };

    setCurrentUser(updated);
    saveCurrentUser(updated);

    const profiles = getProfiles();
    const pIdx = profiles.findIndex(p => p.uid === currentUser.uid);
    if (pIdx >= 0) {
      profiles[pIdx] = updated;
      saveProfiles(profiles);
    }
  };

  // Auth Operations
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (authMode === 'login') {
      const profiles = getProfiles();
      const match = profiles.find(p => p.email.toLowerCase() === authEmail.toLowerCase() && p.password === authPassword);
      if (match) {
        setCurrentUser(match);
        saveCurrentUser(match);
        setAuthSuccess(`Welcome back, ${match.fullName}!`);
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthEmail('');
          setAuthPassword('');
          setAuthSuccess('');
        }, 1200);
      } else {
        setAuthError('Incorrect email or password details.');
      }
    } 
    else if (authMode === 'signup') {
      const profiles = getProfiles();
      const exists = profiles.some(p => p.email.toLowerCase() === authEmail.toLowerCase());
      if (exists) {
        setAuthError('An account with this email already exists.');
        return;
      }

      const newProfile: UserProfile = {
        uid: `usr-${Math.random().toString(36).substring(2, 9)}`,
        email: authEmail,
        password: authPassword,
        fullName: authName,
        phone: '',
        location: '',
        experienceLevel: '',
        cvs: [],
        skills: [],
        certifications: [],
        languages: ['English'],
        education: [],
        experience: [],
        savedJobs: [],
        appliedJobs: [],
        alerts: []
      };

      profiles.push(newProfile);
      saveProfiles(profiles);
      setCurrentUser(newProfile);
      saveCurrentUser(newProfile);

      setAuthSuccess('Account registered and logged in successfully!');
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
        setAuthSuccess('');
      }, 1200);
    } 
    else if (authMode === 'admin-login') {
      if (authEmail.toLowerCase() === 'sbtservices7@sbtcabins.com' && authPassword === 'admin123') {
        setIsAdmin(true);
        setAuthSuccess('Welcome website owner! Directing to cockpit...');
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthEmail('');
          setAuthPassword('');
          setAuthSuccess('');
          handleNavigate('admin');
        }, 1200);
      } else {
        setAuthError('Access Denied. Inaccurate credentials.');
      }
    }
    else if (authMode === 'forgot') {
      setAuthSuccess('Verification code sent to email. Check inbox.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    setIsAdmin(false);
    handleNavigate('home');
  };

  // Find job detail if viewing it
  const currentJobDetail = useMemo(() => {
    if (currentView === 'job-detail' && viewParams.slug) {
      return jobs.find(j => j.slug === viewParams.slug);
    }
    return null;
  }, [currentView, viewParams, jobs]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Synchronizing JOB TODAY KSA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Dynamic Structured Metadata Schema Injection */}
      <SEO job={currentJobDetail || undefined} />

      {/* Header element */}
      <Header 
        currentView={currentView}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
        onAdminClick={() => { setAuthMode('admin-login'); setShowAuthModal(true); }}
      />

      {/* Core main router switchboard views mapping */}
      <div className="flex-1">
        {currentView === 'home' && (
          <HomeView 
            jobs={jobs} 
            onNavigate={handleNavigate} 
            currentUser={currentUser}
            onToggleSaveJob={handleToggleSaveJob}
          />
        )}

        {currentView === 'jobs' && (
          <JobsListingView 
            jobs={jobs}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onToggleSaveJob={handleToggleSaveJob}
            initialFilters={viewParams}
          />
        )}

        {currentView === 'job-detail' && currentJobDetail && (
          <JobDetailsView 
            job={currentJobDetail}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onToggleSaveJob={handleToggleSaveJob}
            onApplyForJob={handleApplyLog}
          />
        )}

        {currentView === 'job-detail' && !currentJobDetail && (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h2 className="text-xl font-bold">Vacancy Not Found</h2>
            <p className="text-sm text-slate-500 mt-2">The requested job has expired or does not exist.</p>
            <button onClick={() => handleNavigate('home')} className="mt-4 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold">Back to Home</button>
          </div>
        )}

        {currentView === 'profile' && currentUser && (
          <ProfileView 
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'saved-jobs' && currentUser && (
          <SavedJobsView 
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onToggleSaveJob={handleToggleSaveJob}
          />
        )}

        {currentView === 'admin' && (
          <AdminView 
            onNavigate={handleNavigate}
            onRefreshJobs={handleRefreshJobs}
          />
        )}
      </div>

      {/* Footer Element */}
      <Footer onNavigate={handleNavigate} />

      {/* SECURE DYNAMIC AUTH MODAL (LOGIN / CANDIDATE SIGNUP / ADMIN CONSOLE) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setShowAuthModal(false)} />
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            {/* Modal Body */}
            <div className="inline-block align-bottom bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="relative p-6 sm:p-8">
                
                {/* Close Button */}
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header branding info */}
                <div className="text-center mb-6">
                  {authMode === 'admin-login' ? (
                    <div className="mx-auto bg-emerald-600 text-white w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                      <Shield className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="mx-auto bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                      <User className="w-5 h-5" />
                    </div>
                  )}

                  <h3 className="font-extrabold text-slate-950 dark:text-white text-lg">
                    {authMode === 'login' && 'Candidate Sign In'}
                    {authMode === 'signup' && 'Create Candidate Account'}
                    {authMode === 'forgot' && 'Reset My Password'}
                    {authMode === 'admin-login' && 'Website Owner Cockpit'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {authMode === 'admin-login' ? 'Strictly authorized administrators only.' : 'Access Saudi KSA jobs tracker and direct apply options.'}
                  </p>
                </div>

                {authSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 mb-5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {authError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 mb-5">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
                  
                  {authMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Abdullah Khan"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder={authMode === 'admin-login' ? 'sbtservices7@sbtcabins.com' : 'e.g. candidate@domain.com'}
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3"
                    />
                  </div>

                  {authMode !== 'forgot' && (
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3"
                      />
                    </div>
                  )}

                  {authMode === 'login' && (
                    <div className="flex justify-end text-[11px]">
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-emerald-600 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-emerald-650 hover:bg-emerald-750 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    {authMode === 'login' && 'Sign In'}
                    {authMode === 'signup' && 'Create Free Account'}
                    {authMode === 'forgot' && 'Send Code'}
                    {authMode === 'admin-login' && 'Authorize Owner Access'}
                  </button>

                </form>

                {/* Footer option switches */}
                <div className="mt-6 border-t border-slate-150 dark:border-slate-850 pt-4 text-center text-xs text-slate-500">
                  {authMode === 'login' && (
                    <p>
                      Don't have an account?{' '}
                      <button onClick={() => setAuthMode('signup')} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                        Register Free
                      </button>
                    </p>
                  )}
                  {authMode === 'signup' && (
                    <p>
                      Already have an account?{' '}
                      <button onClick={() => setAuthMode('login')} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                        Sign In Now
                      </button>
                    </p>
                  )}
                  {authMode === 'forgot' && (
                    <p>
                      Remembered credentials?{' '}
                      <button onClick={() => setAuthMode('login')} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                        Sign In
                      </button>
                    </p>
                  )}
                  {authMode === 'admin-login' && (
                    <p>
                      Candidate access?{' '}
                      <button onClick={() => setAuthMode('login')} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                        Candidate Login
                      </button>
                    </p>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

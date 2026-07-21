import { useState } from 'react';
import { Menu, X, Briefcase, User, LogOut, Settings, Heart } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  currentUser: UserProfile | null;
  isAdmin: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  onAdminClick?: () => void;
}

export default function Header({ currentView, onNavigate, currentUser, isAdmin, onLogout, onLoginClick, onAdminClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Search Jobs', view: 'jobs' },
    { label: 'Categories', view: 'home', hash: 'categories' },
    { label: 'Locations', view: 'home', hash: 'locations' },
  ];

  const handleNavItemClick = (item: { view: string; hash?: string }) => {
    setMobileMenuOpen(false);
    onNavigate(item.view);
    if (item.hash) {
      setTimeout(() => {
        const el = document.getElementById(item.hash!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-slate-900 dark:text-white cursor-pointer group"
          >
            <div className="bg-emerald-600 text-white p-2 rounded-lg group-hover:bg-emerald-700 transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight uppercase">
              Job Today <span className="text-emerald-600">KSA</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavItemClick(item)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  currentView === item.view && !item.hash
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop User Account/Admin Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center space-x-1 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : currentUser ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('saved-jobs')}
                  className="p-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors cursor-pointer relative"
                  title="Saved & Applied Jobs"
                >
                  <Heart className="w-5 h-5" />
                  {currentUser.savedJobs.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {currentUser.savedJobs.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{currentUser.fullName.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLoginClick}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onLoginClick}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            {currentUser && !isAdmin && (
              <button
                onClick={() => onNavigate('saved-jobs')}
                className="p-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors relative"
              >
                <Heart className="w-5 h-5" />
                {currentUser.savedJobs.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                    {currentUser.savedJobs.length}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-200 ease-in-out">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavItemClick(item)}
                className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {item.label}
              </button>
            ))}

            <div className="border-t border-slate-200 dark:border-slate-800 my-2 pt-2">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-slate-950 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <Settings className="w-5 h-5 text-emerald-500" />
                    <span>Admin Panel</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('profile');
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-slate-950 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <User className="w-5 h-5 text-emerald-500" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('saved-jobs');
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    <Heart className="w-5 h-5 text-emerald-500" />
                    <span>Saved & Applied Jobs</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-3 pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLoginClick();
                    }}
                    className="w-full text-center py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLoginClick();
                    }}
                    className="w-full text-center py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

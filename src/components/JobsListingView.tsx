import { useState, useMemo } from 'react';
import { Search, MapPin, Briefcase, Award, Sparkles, Filter, ChevronDown, RefreshCw, X, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Job, UserProfile } from '../types';
import JobCard from './JobCard';
import AdSpace from './AdSpace';
import { CATEGORIES, SAUDI_CITIES } from '../data/mockJobs';

interface JobsListingViewProps {
  jobs: Job[];
  onNavigate: (view: string, params?: any) => void;
  currentUser: UserProfile | null;
  onToggleSaveJob: (jobId: string) => void;
  initialFilters?: {
    keyword?: string;
    location?: string;
    category?: string;
    jobType?: string;
    experience?: string;
    featuredOnly?: boolean;
    urgentOnly?: boolean;
  };
}

export default function JobsListingView({ jobs, onNavigate, currentUser, onToggleSaveJob, initialFilters }: JobsListingViewProps) {
  // Filters State
  const [keyword, setKeyword] = useState(initialFilters?.keyword || '');
  const [selectedLocation, setSelectedLocation] = useState(initialFilters?.location || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || '');
  const [selectedJobType, setSelectedJobType] = useState(initialFilters?.jobType || '');
  const [selectedExperience, setSelectedExperience] = useState(initialFilters?.experience || '');
  const [selectedSalary, setSelectedSalary] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(initialFilters?.featuredOnly || false);
  const [urgentOnly, setUrgentOnly] = useState(initialFilters?.urgentOnly || false);

  // Sorting
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'salary-high'
  
  // Mobile drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    let result = jobs.filter(j => j.status === 'Active');

    if (keyword.trim()) {
      const query = keyword.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(query) ||
        j.companyName.toLowerCase().includes(query) ||
        j.description.toLowerCase().includes(query) ||
        j.skills.toLowerCase().includes(query)
      );
    }

    if (selectedLocation) {
      result = result.filter(j => j.location === selectedLocation);
    }

    if (selectedCategory) {
      result = result.filter(j => j.category === selectedCategory);
    }

    if (selectedJobType) {
      result = result.filter(j => j.jobType === selectedJobType);
    }

    if (selectedExperience) {
      result = result.filter(j => j.experience.toLowerCase().includes(selectedExperience.toLowerCase().split(' ')[0]));
    }

    if (featuredOnly) {
      result = result.filter(j => j.featured);
    }

    if (urgentOnly) {
      result = result.filter(j => j.urgent);
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'salary-high') {
      // Crude parsing for high-value sorting
      const getVal = (str: string) => {
        const numbers = str.match(/\d+,\d+|\d+/g);
        if (!numbers) return 0;
        return parseInt(numbers[numbers.length - 1].replace(/,/g, ''), 10);
      };
      result.sort((a, b) => getVal(b.salary) - getVal(a.salary));
    }

    return result;
  }, [jobs, keyword, selectedLocation, selectedCategory, selectedJobType, selectedExperience, featuredOnly, urgentOnly, sortBy]);

  // Paginated Results
  const paginatedJobs = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const resetAllFilters = () => {
    setKeyword('');
    setSelectedLocation('');
    setSelectedCategory('');
    setSelectedJobType('');
    setSelectedExperience('');
    setSelectedSalary('');
    setFeaturedOnly(false);
    setUrgentOnly(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (keyword) count++;
    if (selectedLocation) count++;
    if (selectedCategory) count++;
    if (selectedJobType) count++;
    if (selectedExperience) count++;
    if (featuredOnly) count++;
    if (urgentOnly) count++;
    return count;
  }, [keyword, selectedLocation, selectedCategory, selectedJobType, selectedExperience, featuredOnly, urgentOnly]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors pb-12">
      
      {/* Top Banner Ad Placements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdSpace position="jobs_listing" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title and Top Search Bar */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saudi Arabia Vacancies Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through {filteredJobs.length} matching jobs inside the Kingdom.
          </p>
        </div>

        {/* Filters and Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-500" />
                <span>Filter Jobs</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Keyword Search field */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Search Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
                placeholder="Title, Company, Skills..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            {/* Location Filter dropdown */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Saudi City</label>
              <select
                value={selectedLocation}
                onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value="">All Cities</option>
                {SAUDI_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category Filter dropdown */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Domain / Sector</label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value="">All Sectors</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Job Type selection */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Employment Type</label>
              <div className="space-y-2 mt-2">
                {['Full-time', 'Part-time', 'Contract', 'Temporary'].map(type => (
                  <label key={type} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedJobType === type}
                      onChange={() => { setSelectedJobType(selectedJobType === type ? '' : type); setCurrentPage(1); }}
                      className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Experience level</label>
              <select
                value={selectedExperience}
                onChange={(e) => { setSelectedExperience(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value="">Any Experience</option>
                <option value="0-2">Entry Level (0-2 Years)</option>
                <option value="3-5">Mid Level (3-5 Years)</option>
                <option value="5-10">Senior Level (5-10 Years)</option>
                <option value="10">Director Level (10+ Years)</option>
              </select>
            </div>

            {/* Badges Toggles */}
            <div className="border-t border-slate-150 dark:border-slate-800 pt-5 space-y-3">
              <label className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => { setFeaturedOnly(e.target.checked); setCurrentPage(1); }}
                  className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Featured Jobs Only</span>
                </span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => { setUrgentOnly(e.target.checked); setCurrentPage(1); }}
                  className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="flex items-center gap-1">
                  <X className="w-3.5 h-3.5 text-amber-500 rotate-45 shrink-0" />
                  <span>Urgent Vacancies Only</span>
                </span>
              </label>
            </div>

            {/* Sidebar Ad Slot */}
            <div className="mt-6 border-t border-slate-150 dark:border-slate-800 pt-6">
              <AdSpace position="sidebar" />
            </div>
          </aside>

          {/* Main Listings Grid */}
          <main className="lg:col-span-9">
            
            {/* Sort & Quick Filter Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Left: Active Indicators */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Filter className="w-4 h-4 text-emerald-500" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-900 dark:text-white">{filteredJobs.length}</span> active vacancies
                </div>
              </div>

              {/* Right: Sorting Select */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="salary-high">Sort: Highest Salary</option>
                </select>
              </div>

            </div>

            {/* Grid Listing */}
            {paginatedJobs.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center">
                <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Matching Positions Found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  We couldn't find any active vacancies matching your selected filters. Try clearing some options or broadening your keywords.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={(slug) => onNavigate('job-detail', { slug })}
                    isSaved={currentUser?.savedJobs.includes(job.id) || false}
                    onToggleSave={onToggleSaveJob}
                  />
                ))}
              </div>
            )}

            {/* Dynamic Ads inside listing */}
            {filteredJobs.length > 3 && (
              <div className="mt-8">
                <AdSpace position="between_cards" />
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800/80 mt-12 pt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50 text-slate-700 dark:text-slate-300 disabled:pointer-events-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <div className="sm:hidden text-xs text-slate-500 font-bold">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50 text-slate-700 dark:text-slate-300 disabled:pointer-events-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Drawer Filter Menu Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setMobileFiltersOpen(false)} />
          
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 flex flex-col h-full shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-950 dark:text-white uppercase text-sm tracking-wider">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Mobile fields */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Search Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
                  placeholder="Title, Company, Skills..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Saudi City</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="">All Cities</option>
                  {SAUDI_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Domain / Sector</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="">All Sectors</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Employment Type</label>
                <div className="space-y-2 mt-2">
                  {['Full-time', 'Part-time', 'Contract', 'Temporary'].map(type => (
                    <label key={type} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedJobType === type}
                        onChange={() => { setSelectedJobType(selectedJobType === type ? '' : type); setCurrentPage(1); }}
                        className="rounded border-slate-300 text-emerald-600 h-4 w-4"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Experience level</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => { setSelectedExperience(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="">Any Experience</option>
                  <option value="0-2">Entry Level (0-2 Years)</option>
                  <option value="3-5">Mid Level (3-5 Years)</option>
                  <option value="5-10">Senior Level (5-10 Years)</option>
                  <option value="10">Director Level (10+ Years)</option>
                </select>
              </div>

              <div className="border-t border-slate-150 dark:border-slate-800 pt-5 space-y-3">
                <label className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => { setFeaturedOnly(e.target.checked); setCurrentPage(1); }}
                    className="rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span>Featured Jobs</span>
                </label>

                <label className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={urgentOnly}
                    onChange={(e) => { setUrgentOnly(e.target.checked); setCurrentPage(1); }}
                    className="rounded border-slate-300 text-emerald-600 h-4 w-4"
                  />
                  <span>Urgent Vacancies</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2">
              <button
                onClick={() => { resetAllFilters(); setMobileFiltersOpen(false); }}
                className="flex-1 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

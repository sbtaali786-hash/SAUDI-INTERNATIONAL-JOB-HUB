import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Sparkles, Filter, ChevronDown, Award } from 'lucide-react';
import { SAUDI_CITIES, CATEGORIES } from '../data/mockJobs';

interface HeroProps {
  onSearch: (filters: {
    keyword: string;
    location: string;
    category: string;
    jobType: string;
    experience: string;
  }) => void;
  totalJobsCount: number;
}

export default function Hero({ onSearch, totalJobsCount }: HeroProps) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      keyword,
      location,
      category,
      jobType,
      experience
    });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setLocation('');
    setCategory('');
    setJobType('');
    setExperience('');
    onSearch({
      keyword: '',
      location: '',
      category: '',
      jobType: '',
      experience: ''
    });
  };

  return (
    <div className="relative bg-slate-900 overflow-hidden py-16 md:py-24 border-b border-slate-800">
      
      {/* Decorative Grid Patterns */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Premium Badge */}
        <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Leading Job Portal in Saudi Arabia</span>
        </div>

        {/* Headings */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto mb-4">
          Discover Your Next Career Step inside <span className="text-emerald-500">Saudi Arabia</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-10">
          Search thousands of verified vacancies from top employers in Riyadh, Jeddah, Dammam, and NEOM. No login required to browse.
        </p>

        {/* Search Console */}
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-2"
          >
            {/* Keyword Title field */}
            <div className="md:col-span-5 relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job Title, Keyword, or Company..."
                className="w-full bg-transparent pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-hidden placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Location dropdown field */}
            <div className="md:col-span-4 relative flex items-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/80 pt-2 md:pt-0">
              <MapPin className="absolute left-4 w-5 h-5 text-slate-400 shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent pl-12 pr-8 py-3 text-sm text-slate-900 dark:text-white appearance-none focus:outline-hidden cursor-pointer"
              >
                <option value="" className="text-slate-500 bg-white dark:bg-slate-950">All Saudi Cities</option>
                {SAUDI_CITIES.map((city) => (
                  <option key={city} value={city} className="bg-white dark:bg-slate-950">{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Actions: Search Button & Filters Trigger */}
            <div className="md:col-span-3 flex items-center gap-2 pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  showFilters || category || jobType || experience
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
                title="Toggle Advanced Filters"
              >
                <Filter className="w-5 h-5" />
              </button>

              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Jobs</span>
              </button>
            </div>
          </form>

          {/* Expanded Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 sm:p-5 bg-slate-900/50 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left animate-in fade-in slide-in-from-top-3 duration-200">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <div className="relative flex items-center bg-slate-950/60 border border-slate-800 rounded-xl">
                  <Briefcase className="absolute left-3 w-4 h-4 text-slate-500" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent pl-10 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-hidden cursor-pointer"
                  >
                    <option value="" className="bg-slate-950">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-950">{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Job Type selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Type</label>
                <div className="relative flex items-center bg-slate-950/60 border border-slate-800 rounded-xl">
                  <Briefcase className="absolute left-3 w-4 h-4 text-slate-500" />
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-transparent pl-10 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-hidden cursor-pointer"
                  >
                    <option value="" className="bg-slate-950">Any Type</option>
                    <option value="Full-time" className="bg-slate-950">Full-time</option>
                    <option value="Part-time" className="bg-slate-950">Part-time</option>
                    <option value="Contract" className="bg-slate-950">Contract</option>
                    <option value="Temporary" className="bg-slate-950">Temporary</option>
                  </select>
                  <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Experience selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experience Level</label>
                <div className="relative flex items-center bg-slate-950/60 border border-slate-800 rounded-xl">
                  <Award className="absolute left-3 w-4 h-4 text-slate-500" />
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-transparent pl-10 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-hidden cursor-pointer"
                  >
                    <option value="" className="bg-slate-950">Any Experience</option>
                    <option value="0-2 Years" className="bg-slate-950">Entry Level (0-2 Years)</option>
                    <option value="3-5 Years" className="bg-slate-950">Mid-Career (3-5 Years)</option>
                    <option value="5-10 Years" className="bg-slate-950">Senior Level (5-10 Years)</option>
                    <option value="10+ Years" className="bg-slate-950">Director / Executive (10+ Years)</option>
                  </select>
                  <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Filter helpers */}
              <div className="sm:col-span-3 flex justify-between items-center border-t border-slate-800 pt-3 mt-1">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFilters(false);
                    onSearch({ keyword, location, category, jobType, experience });
                  }}
                  className="bg-emerald-600/20 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-emerald-500/20 font-bold hover:bg-emerald-600/30 transition-colors cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Realtime stats ticker */}
        <div className="mt-10 flex justify-center items-center gap-8 text-slate-400 font-medium text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{totalJobsCount} Live Vacancies inside Saudi Arabia</span>
          </div>
        </div>

      </div>
    </div>
  );
}

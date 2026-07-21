import { MapPin, Briefcase, ChevronRight, Settings, Building, Zap, Sliders, ShieldCheck, Flame, CheckCircle, Wrench, Calendar, Compass, Fuel, Droplets, Laptop, ShieldAlert, Brain, Coins, Users, TrendingUp, ClipboardList, Truck, Activity, Soup, Package, Factory, Plane, Radio, HelpCircle, ArrowRight } from 'lucide-react';
import { Job, UserProfile } from '../types';
import JobCard from './JobCard';
import AdSpace from './AdSpace';
import { CATEGORIES, SAUDI_CITIES } from '../data/mockJobs';

interface HomeViewProps {
  jobs: Job[];
  onNavigate: (view: string, params?: any) => void;
  currentUser: UserProfile | null;
  onToggleSaveJob: (jobId: string) => void;
}

export default function HomeView({ jobs, onNavigate, currentUser, onToggleSaveJob }: HomeViewProps) {
  // Extract 6 newest active jobs
  const latestJobs = jobs
    .filter(j => j.status === 'Active')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Helper to map category names to Lucide icons
  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Mechanical': return <Settings className="w-5 h-5 text-indigo-500" />;
      case 'Civil': return <Building className="w-5 h-5 text-sky-500" />;
      case 'Electrical': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Instrumentation': return <Sliders className="w-5 h-5 text-pink-500" />;
      case 'HSE / Safety': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'QC Welding Inspector': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'QA/QC': return <CheckCircle className="w-5 h-5 text-teal-500" />;
      case 'Piping': return <Wrench className="w-5 h-5 text-indigo-400" />;
      case 'Planning': return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'Architecture': return <Compass className="w-5 h-5 text-rose-500" />;
      case 'Oil & Gas': return <Fuel className="w-5 h-5 text-amber-600" />;
      case 'Petrochemical': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'Construction': return <Building className="w-5 h-5 text-orange-600" />;
      case 'IT': return <Laptop className="w-5 h-5 text-sky-600" />;
      case 'Computer Science': return <Laptop className="w-5 h-5 text-violet-500" />;
      case 'Cybersecurity': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'Artificial Intelligence': return <Brain className="w-5 h-5 text-fuchsia-500" />;
      case 'Finance': return <Coins className="w-5 h-5 text-emerald-600" />;
      case 'HR': return <Users className="w-5 h-5 text-teal-600" />;
      case 'Sales': return <TrendingUp className="w-5 h-5 text-rose-600" />;
      case 'Administration': return <ClipboardList className="w-5 h-5 text-slate-500" />;
      case 'Driving': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'Healthcare': return <Activity className="w-5 h-5 text-rose-500" />;
      case 'Hospitality': return <Soup className="w-5 h-5 text-amber-500" />;
      case 'Logistics': return <Package className="w-5 h-5 text-blue-500" />;
      case 'Engineering': return <Wrench className="w-5 h-5 text-emerald-600" />;
      case 'Manufacturing': return <Factory className="w-5 h-5 text-purple-600" />;
      case 'Aviation': return <Plane className="w-5 h-5 text-indigo-500" />;
      case 'Telecom': return <Radio className="w-5 h-5 text-teal-500" />;
      default: return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleCategoryClick = (cat: string) => {
    onNavigate('jobs', { category: cat });
  };

  const handleCityClick = (city: string) => {
    onNavigate('jobs', { location: city });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Top Banner Ad Placements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <AdSpace position="homepage_top" />
      </div>

      {/* Latest Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-1">
              Fresh Openings
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Latest Jobs in Saudi Arabia
            </h2>
          </div>
          
          <button
            onClick={() => onNavigate('jobs')}
            className="group flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold text-sm transition-all cursor-pointer"
          >
            <span>View All Jobs</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {latestJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Active Jobs Found</h3>
            <p className="text-sm text-slate-500">Check back later or browse other categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
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

        {/* View All Jobs Bottom CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('jobs')}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/15 cursor-pointer"
          >
            <span>VIEW ALL ACTIVE JOBS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Inline Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSpace position="between_cards" />
      </div>

      {/* Job Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/80 dark:border-slate-800/50">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-1">
            Browse Industries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Job Categories
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Click on any sector to discover active, matching positions across the Kingdom of Saudi Arabia.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const activeJobsCount = jobs.filter(j => j.category === cat && j.status === 'Active').length;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xs rounded-xl p-4 text-left transition-all cursor-pointer flex flex-col items-start gap-3 group"
              >
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg group-hover:bg-emerald-500/10 transition-all">
                  {getCategoryIcon(cat)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {cat}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium font-mono">
                    {activeJobsCount} Active Jobs
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Saudi Arabia Locations Section */}
      <section id="locations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/80 dark:border-slate-800/50">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest block mb-1">
            Regional Focus
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saudi Arabia Locations
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Discover premier vacancies localized in the key corporate hubs, developments, and economic cities of Saudi Arabia.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SAUDI_CITIES.map((city) => {
            const activeJobsInCity = jobs.filter(j => j.location === city && j.status === 'Active').length;
            return (
              <button
                key={city}
                onClick={() => handleCityClick(city)}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 rounded-xl p-4 text-center transition-all hover:shadow-xs group cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-emerald-500/80 group-hover:scale-110 group-hover:text-emerald-500 transition-all mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {city}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">
                  {activeJobsInCity} Positions
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom Ad space */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AdSpace position="homepage_bottom" />
      </div>

    </div>
  );
}

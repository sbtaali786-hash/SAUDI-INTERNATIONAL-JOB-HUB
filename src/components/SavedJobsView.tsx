import { useState, useMemo } from 'react';
import { Bookmark, Send, Calendar, PhoneCall, Mail, MessageSquare, ExternalLink, Briefcase, Heart } from 'lucide-react';
import { Job, UserProfile } from '../types';
import JobCard from './JobCard';
import { getJobs } from '../lib/storage';

interface SavedJobsViewProps {
  currentUser: UserProfile;
  onNavigate: (view: string, params?: any) => void;
  onToggleSaveJob: (jobId: string) => void;
}

export default function SavedJobsView({ currentUser, onNavigate, onToggleSaveJob }: SavedJobsViewProps) {
  const [activeTab, setActiveTab] = useState<'saved' | 'applied'>('saved');

  const jobs = useMemo(() => getJobs(), []);

  // Filter saved jobs
  const savedJobsList = useMemo(() => {
    return jobs.filter(j => currentUser.savedJobs.includes(j.id));
  }, [jobs, currentUser.savedJobs]);

  // Filter applied jobs list with detailed log matching
  const appliedJobsList = useMemo(() => {
    return currentUser.appliedJobs.map(app => {
      const matchJob = jobs.find(j => j.id === app.jobId);
      return {
        ...app,
        job: matchJob
      };
    }).filter(app => app.job !== undefined);
  }, [jobs, currentUser.appliedJobs]);

  const getChannelIcon = (opt: string) => {
    switch (opt) {
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-sky-500 shrink-0" />;
      case 'Call':
        return <PhoneCall className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Send className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title Block */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Job Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep track of your bookmarked vacancies and active application history records.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-6 text-sm">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-4 font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Vacancies ({savedJobsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applied')}
            className={`pb-4 font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'applied'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Applied History ({appliedJobsList.length})</span>
          </button>
        </div>

        {/* Tab Contents: SAVED JOBS */}
        {activeTab === 'saved' && (
          <div>
            {savedJobsList.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center max-w-xl mx-auto">
                <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Saved Jobs</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Bookmark vacancies on the details page or from search lists to compare them here.
                </p>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Explore Jobs Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobsList.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={(slug) => onNavigate('job-detail', { slug })}
                    isSaved={true}
                    onToggleSave={onToggleSaveJob}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Contents: APPLIED HISTORY */}
        {activeTab === 'applied' && (
          <div className="max-w-4xl mx-auto">
            {appliedJobsList.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center">
                <Send className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Applications Made</h3>
                <p className="text-sm text-slate-500 mb-6">
                  You haven't initiated any applications yet. Browse vacancies and click WhatsApp, Email, or Call to start.
                </p>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Browse Vacancies
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appliedJobsList.map((app, i) => (
                  <div 
                    key={i} 
                    onClick={() => onNavigate('job-detail', { slug: app.job!.slug })}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    
                    <div className="flex items-start space-x-4 min-w-0">
                      <div className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/25 p-3 rounded-xl shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate hover:text-emerald-600 transition-colors">
                          {app.job!.title}
                        </h4>
                        <p className="text-xs font-bold text-slate-500 truncate mt-0.5">
                          {app.job!.companyName} • <span className="font-semibold text-slate-400">{app.job!.location}, KSA</span>
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-2 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Initiated on {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 shrink-0">
                      <span className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg">
                        {getChannelIcon(app.optionUsed)}
                        <span>Applied via {app.optionUsed}</span>
                      </span>
                      
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline-block">
                        Active Reference: #{app.job!.id}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

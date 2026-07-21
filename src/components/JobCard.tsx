import { MapPin, Calendar, Briefcase, Award, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  key?: string | number;
  job: Job;
  onViewDetails: (slug: string) => void;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  showSaveButton?: boolean;
}

export default function JobCard({ job, onViewDetails, isSaved = false, onToggleSave, showSaveButton = true }: JobCardProps) {
  // Format creation date to friendly text
  const getFriendlyTime = (dateStr: string) => {
    try {
      const created = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - created.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return '1 day ago';
      } else if (diffDays < 30) {
        return `${diffDays} days ago`;
      } else {
        return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'Recently';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`relative bg-white dark:bg-slate-900 border ${
      job.featured 
        ? 'border-emerald-500/40 dark:border-emerald-500/30 shadow-xs shadow-emerald-500/5 hover:border-emerald-500 bg-linear-to-b from-white to-emerald-50/10 dark:from-slate-900 dark:to-emerald-950/5' 
        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
    } rounded-xl p-5 md:p-6 transition-all duration-200 flex flex-col justify-between h-full group`}>
      
      {/* Save Job / Badges */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {job.featured && (
            <span className="inline-flex items-center space-x-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
          {job.urgent && (
            <span className="inline-flex items-center space-x-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-amber-500/20">
              <AlertCircle className="w-3 h-3 animate-pulse" />
              <span>Urgent</span>
            </span>
          )}
          <span className="inline-flex items-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
            {job.jobType}
          </span>
        </div>

        {showSaveButton && onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            title={isSaved ? 'Remove from Saved Jobs' : 'Save Job'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-emerald-600 dark:fill-emerald-400' : ''}`} />
          </button>
        )}
      </div>

      {/* Main Info */}
      <div className="flex items-start space-x-4 mb-4">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.companyName}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-lg object-cover bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center font-bold text-sm tracking-wider border border-emerald-500/15">
            {getInitials(job.companyName)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 
            onClick={() => onViewDetails(job.slug)}
            className="text-base font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {job.title}
          </h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
            {job.companyName}
          </p>
        </div>
      </div>

      {/* Grid Parameters */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-4 mb-5">
        <div className="flex items-center space-x-1.5 min-w-0">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate font-semibold text-slate-700 dark:text-slate-300">{job.location}, KSA</span>
        </div>
        <div className="flex items-center space-x-1.5 min-w-0">
          <Award className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{job.experience}</span>
        </div>
        <div className="flex items-center space-x-1.5 min-w-0">
          <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate text-slate-700 dark:text-slate-300">{job.category}</span>
        </div>
        <div className="flex items-center space-x-1.5 min-w-0">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">SAR</span>
          <span className="truncate font-bold text-slate-800 dark:text-slate-200">{job.salary}</span>
        </div>
      </div>

      {/* Button & Date */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{getFriendlyTime(job.createdAt)}</span>
        </span>

        <button
          onClick={() => onViewDetails(job.slug)}
          className="bg-emerald-600/10 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-400 dark:hover:text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer border border-emerald-500/20 hover:border-transparent"
        >
          View & Apply
        </button>
      </div>

    </div>
  );
}

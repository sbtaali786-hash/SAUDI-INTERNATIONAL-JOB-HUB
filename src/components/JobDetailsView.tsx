import React, { useState, useMemo } from 'react';
import { 
  MapPin, Calendar, Briefcase, Award, Shield, DollarSign, Clock, Users, Gift, FileText, 
  Share2, Heart, AlertTriangle, Link2, MessageSquare, Mail, PhoneCall, Check, Sparkles, ChevronRight 
} from 'lucide-react';
import { Job, UserProfile } from '../types';
import { getJobs, getAdminSettings } from '../lib/storage';
import AdSpace from './AdSpace';

interface JobDetailsViewProps {
  job: Job;
  onNavigate: (view: string, params?: any) => void;
  currentUser: UserProfile | null;
  onToggleSaveJob: (jobId: string) => void;
  onApplyForJob?: (jobId: string, optionUsed: 'WhatsApp' | 'Email' | 'Call') => void;
}

export default function JobDetailsView({ job, onNavigate, currentUser, onToggleSaveJob, onApplyForJob }: JobDetailsViewProps) {
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const adminSettings = useMemo(() => getAdminSettings(), []);

  // Fetch related jobs (same category, excluding current job)
  const relatedJobs = useMemo(() => {
    return getJobs()
      .filter(j => j.category === job.category && j.id !== job.id && j.status === 'Active')
      .slice(0, 3);
  }, [job]);

  // Apply endpoints
  const whatsappNum = job.whatsappNumber || adminSettings.whatsappNumber;
  const emailAddr = job.emailAddress || adminSettings.emailAddress;
  const phoneNum = job.phoneNumber || adminSettings.phoneNumber;

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/#job-detail?slug=${job.slug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    const fullUrl = `${window.location.origin}/#job-detail?slug=${job.slug}`;
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.companyName}`,
        text: `Check out this job vacancy in ${job.location}, Saudi Arabia!`,
        url: fullUrl,
      }).catch(console.error);
    } else {
      handleCopyLink();
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) return;
    
    // Save report to localStorage for Admin
    const reports = JSON.parse(localStorage.getItem('job_today_ksa_reports') || '[]');
    reports.push({
      id: Math.random().toString(36).substring(2, 9),
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      reason: reportReason,
      details: reportDetails,
      reportedAt: new Date().toISOString(),
      userEmail: currentUser?.email || 'Anonymous'
    });
    localStorage.setItem('job_today_ksa_reports', JSON.stringify(reports));

    setReported(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReported(false);
      setReportReason('');
      setReportDetails('');
    }, 2000);
  };

  // Pre-filled triggers
  const getWhatsAppLink = () => {
    const candidateName = currentUser ? currentUser.fullName : '';
    const namePart = candidateName ? `My name is ${candidateName}. ` : '';
    const text = encodeURIComponent(
      `Hello, I would like to apply for the "${job.title}" position at "${job.companyName}" (Ref ID: ${job.id}) advertised on Job Today KSA. ${namePart}Please guide me on the next steps. Thank you.`
    );
    // Standard format
    const formattedNum = whatsappNum.replace(/\+/g, '').replace(/\s+/g, '');
    return `https://wa.me/${formattedNum}?text=${text}`;
  };

  const getEmailLink = () => {
    const subject = encodeURIComponent(`Application for ${job.title} - Ref ID ${job.id}`);
    const candidateName = currentUser ? currentUser.fullName : 'Applicant';
    const emailBody = encodeURIComponent(
      `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${job.title} position at ${job.companyName} as advertised on Job Today KSA.\n\n` +
      `My Details:\n` +
      `- Name: ${candidateName}\n` +
      `- Position: ${job.title}\n` +
      `- Reference ID: ${job.id}\n\n` +
      `Please find my attached resume / professional information. I look forward to your response.\n\nBest regards,\n${candidateName}`
    );
    return `mailto:${emailAddr}?subject=${subject}&body=${emailBody}`;
  };

  const handleApplyClick = (option: 'WhatsApp' | 'Email' | 'Call') => {
    if (onApplyForJob) {
      onApplyForJob(job.id, option);
    }
  };

  const isSaved = currentUser?.savedJobs.includes(job.id) || false;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors pb-16">
      
      {/* Top Banner Ad Placements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdSpace position="job_detail_top" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back navigation indicator */}
        <button
          onClick={() => onNavigate('jobs')}
          className="flex items-center space-x-1 text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 font-bold uppercase tracking-wider mb-6 cursor-pointer"
        >
          <span>← Back to Search Directory</span>
        </button>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Job Body */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Main Header Information Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                
                <div className="flex items-start space-x-4">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center font-extrabold text-xl tracking-wider border border-emerald-500/15 shrink-0">
                      {job.companyName.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {job.title}
                    </h1>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                      {job.companyName}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{job.location}, Saudi Arabia</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-sm">
                        REF ID: {job.id}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Top Badges */}
                <div className="flex flex-wrap gap-2 sm:self-start">
                  {job.featured && (
                    <span className="inline-flex items-center space-x-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-emerald-500/20">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}
                  {job.urgent && (
                    <span className="inline-flex items-center space-x-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-amber-500/20">
                      <AlertTriangle className="w-3 h-3 animate-pulse" />
                      <span>Urgent</span>
                    </span>
                  )}
                </div>

              </div>

              {/* Action utilities bar */}
              <div className="flex flex-wrap items-center gap-3 border-t border-slate-150 dark:border-slate-800 pt-5 text-xs">
                <button
                  onClick={() => onToggleSaveJob(job.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-emerald-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-emerald-600 dark:fill-emerald-400' : ''}`} />
                  <span className="font-bold">{isSaved ? 'Job Saved' : 'Save Vacancy'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="font-bold">Share Job</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
                  <span className="font-bold">{copied ? 'Link Copied' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-transparent bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/15 text-rose-600 dark:text-rose-400 transition-all ml-auto cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold">Report Job</span>
                </button>
              </div>

            </div>

            {/* Mid Banner Ad Placements */}
            <AdSpace position="job_detail_middle" />

            {/* Sections: Job Description, Responsibilities, Requirements */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
              
              {/* Job Description section */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-3">
                  Job Description
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities section */}
              {job.responsibilities && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-4">
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                    {job.responsibilities.split('\n').filter(Boolean).map((resp, i) => (
                      <li key={i} className="flex items-start">
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-2 mr-3 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements / Specifications */}
              {job.requirements && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-4">
                    Candidate Requirements
                  </h3>
                  <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                    {job.requirements.split('\n').filter(Boolean).map((req, i) => (
                      <li key={i} className="flex items-start">
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mt-2 mr-3 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Skills */}
              {job.skills && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-3">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.split(',').map((skill, i) => (
                      <span 
                        key={i}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Specifications Table */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-4">
                  Job Information Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Domain / Sector:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.category}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Employment Type:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.jobType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Minimum Qualification:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.qualification}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Required Experience:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.experience}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Nationality Limits:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.nationality}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Gender Requirement:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.gender}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Available Vacancies:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.vacancies} Candidates</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Working Hours:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.workingHours}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Visa Status:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.visaStatus}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                    <span className="text-slate-400 font-medium">Application Deadline:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{job.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Extra Benefits Block */}
              {job.benefits && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-3">
                    Corporate Benefits & Allowances
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-xl">
                    {job.benefits}
                  </p>
                </div>
              )}

            </div>

            {/* THREE APPLICATION OPTIONS BAR AT BOTTOM (STICKY FOR MOBILE COMPLIANCE) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="text-center md:text-left mb-2">
                <h3 className="font-extrabold text-slate-950 dark:text-white tracking-tight text-lg">
                  Direct Apply Methods
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose your preferred contact channel below. No third-party registrations required.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. APPLY VIA WHATSAPP */}
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleApplyClick('WhatsApp')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-4 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/20 text-center flex items-center justify-center space-x-2 cursor-pointer border border-transparent"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>APPLY VIA WHATSAPP</span>
                </a>

                {/* 2. APPLY VIA EMAIL */}
                <a
                  href={getEmailLink()}
                  onClick={() => handleApplyClick('Email')}
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-sm py-4 px-6 rounded-xl transition-all shadow-md shadow-slate-950/20 text-center flex items-center justify-center space-x-2 cursor-pointer border border-slate-850"
                >
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <span>APPLY VIA EMAIL</span>
                </a>

                {/* 3. CALL NOW */}
                <a
                  href={`tel:${phoneNum}`}
                  onClick={() => handleApplyClick('Call')}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-sm py-4 px-6 rounded-xl transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>CALL DIRECT NOW</span>
                </a>
              </div>
            </div>

          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Summary parameters card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h3 className="font-extrabold text-slate-950 dark:text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                Job Overview
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Offered Salary:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{job.salary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Region Location:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{job.location}, KSA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Experience Needed:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{job.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Available Vacancies:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{job.vacancies} Seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Gender Required:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{job.gender}</span>
                </div>
              </div>

              {/* Quick Logistics parameters block */}
              <div className="mt-5 border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3.5 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Accommodation:</span>
                  <span className={`font-semibold ${job.accommodation.toLowerCase().includes('provided') || job.accommodation.toLowerCase() === 'yes' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-300'}`}>
                    {job.accommodation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Transportation:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-300">{job.transportation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Food / Messing:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-300">{job.food}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Medical Insurance:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-300">{job.medical}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Overtime options:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-300">{job.overtime}</span>
                </div>
              </div>

            </div>

            {/* Sidebar Ad Placement */}
            <AdSpace position="sidebar" />

          </aside>

        </div>

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <section className="mt-16 border-t border-slate-200 dark:border-slate-800/80 pt-12">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6">
              Related Vacancies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedJobs.map(rj => (
                <div 
                  key={rj.id}
                  onClick={() => onNavigate('job-detail', { slug: rj.slug })}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl hover:border-emerald-500/40 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{rj.category}</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-emerald-600">{rj.title}</h4>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{rj.companyName}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rj.location}, KSA</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-4 text-[11px]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{rj.salary}</span>
                    <span className="font-bold text-slate-400 flex items-center">View Details <ChevronRight className="w-3 h-3 ml-0.5" /></span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Report Job Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setShowReportModal(false)} />
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleReportSubmit} className="p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Report Inaccurate Vacancy</h3>
                    <p className="text-xs text-slate-400">We audit reported jobs within 12 hours of submission.</p>
                  </div>
                </div>

                {reported ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-4 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center text-xs font-semibold">
                    Thank you! Report submitted successfully. Checking state...
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Select Reason</label>
                      <select
                        required
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="">-- Choose reason --</option>
                        <option value="expired">This job has expired / closed</option>
                        <option value="fake">Inaccurate / Fake details or scam</option>
                        <option value="contact_broken">Contact numbers or email broken</option>
                        <option value="scam">Requesting processing fee (Scam)</option>
                        <option value="other">Other issue</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Elaborate Details (Optional)</label>
                      <textarea
                        value={reportDetails}
                        onChange={(e) => setReportDetails(e.target.value)}
                        placeholder="Please provide any extra context to help our administrators investigate..."
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setShowReportModal(false)}
                        className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
                      >
                        Submit Report
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Footer Ad Placement */}
      <AdSpace position="mobile_responsive" />

    </div>
  );
}

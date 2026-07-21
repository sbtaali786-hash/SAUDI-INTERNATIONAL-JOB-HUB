import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Award, Plus, Trash2, Calendar, FileText, UploadCloud, 
  Sparkles, Check, CheckCircle2, ShieldAlert, Key, Globe, BellRing 
} from 'lucide-react';
import { UserProfile, UserEducation, UserExperience, UserCV } from '../types';
import { updateProfile, saveCurrentUser, saveProfiles, getProfiles } from '../lib/storage';
import { SAUDI_CITIES, CATEGORIES } from '../data/mockJobs';

interface ProfileViewProps {
  currentUser: UserProfile;
  onLogout: () => void;
}

export default function ProfileView({ currentUser, onLogout }: ProfileViewProps) {
  const [profile, setProfile] = useState<UserProfile>({ ...currentUser });
  const [activeTab, setActiveTab] = useState<'personal' | 'resumes' | 'credentials' | 'alerts' | 'account'>('personal');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New item draft states
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newLang, setNewLang] = useState('');
  
  // Education form states
  const [eduSchool, setEduSchool] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduStart, setEduStart] = useState('');
  const [eduEnd, setEduEnd] = useState('');

  // Experience form states
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');

  // Password / Delete
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Alert drafts
  const [alertKeyword, setAlertKeyword] = useState('');
  const [alertLocation, setAlertLocation] = useState('');
  const [alertCategory, setAlertCategory] = useState('');

  const triggerSaveNotification = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    updateProfile(updated);
  };

  // Personal Info Form Submission
  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile(profile);
    triggerSaveNotification();
  };

  // Skill, Certification, Language management
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (profile.skills.includes(newSkill.trim())) return;
    const updated = { ...profile, skills: [...profile.skills, newSkill.trim()] };
    handleUpdateProfile(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = { ...profile, skills: profile.skills.filter(s => s !== skill) };
    handleUpdateProfile(updated);
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.trim()) return;
    if (profile.certifications.includes(newCert.trim())) return;
    const updated = { ...profile, certifications: [...profile.certifications, newCert.trim()] };
    handleUpdateProfile(updated);
    setNewCert('');
  };

  const handleRemoveCert = (cert: string) => {
    const updated = { ...profile, certifications: profile.certifications.filter(c => c !== cert) };
    handleUpdateProfile(updated);
  };

  const handleAddLang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLang.trim()) return;
    if (profile.languages.includes(newLang.trim())) return;
    const updated = { ...profile, languages: [...profile.languages, newLang.trim()] };
    handleUpdateProfile(updated);
    setNewLang('');
  };

  const handleRemoveLang = (lang: string) => {
    const updated = { ...profile, languages: profile.languages.filter(l => l !== lang) };
    handleUpdateProfile(updated);
  };

  // Education management
  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduSchool || !eduDegree) return;
    const newEdu: UserEducation = {
      id: Math.random().toString(36).substring(2, 9),
      school: eduSchool,
      degree: eduDegree,
      fieldOfStudy: eduField,
      startYear: eduStart,
      endYear: eduEnd
    };
    const updated = { ...profile, education: [...profile.education, newEdu] };
    handleUpdateProfile(updated);
    // Reset Form
    setEduSchool(''); setEduDegree(''); setEduField(''); setEduStart(''); setEduEnd('');
  };

  const handleRemoveEducation = (id: string) => {
    const updated = { ...profile, education: profile.education.filter(e => e.id !== id) };
    handleUpdateProfile(updated);
  };

  // Experience management
  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCompany || !expRole) return;
    const newExp: UserExperience = {
      id: Math.random().toString(36).substring(2, 9),
      company: expCompany,
      role: expRole,
      description: expDesc,
      startYear: expStart,
      endYear: expEnd
    };
    const updated = { ...profile, experience: [...profile.experience, newExp] };
    handleUpdateProfile(updated);
    // Reset Form
    setExpCompany(''); setExpRole(''); setExpDesc(''); setExpStart(''); setExpEnd('');
  };

  const handleRemoveExperience = (id: string) => {
    const updated = { ...profile, experience: profile.experience.filter(e => e.id !== id) };
    handleUpdateProfile(updated);
  };

  // File Upload (Resume) Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorText('File size exceeds the 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newCv: UserCV = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        url: dataUrl,
        uploadedAt: new Date().toISOString()
      };
      const updated = { ...profile, cvs: [...profile.cvs, newCv] };
      handleUpdateProfile(updated);
      setErrorText('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCv = (id: string) => {
    const updated = { ...profile, cvs: profile.cvs.filter(c => c.id !== id) };
    handleUpdateProfile(updated);
  };

  // Account Operations
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    // Just mock password change locally
    setPasswordChangeSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordChangeSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    const profiles = getProfiles();
    const filtered = profiles.filter(p => p.uid !== currentUser.uid);
    saveProfiles(filtered);
    onLogout();
  };

  // Alert setup
  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertKeyword && !alertLocation && !alertCategory) return;
    const newAlert = {
      id: Math.random().toString(36).substring(2, 9),
      keyword: alertKeyword,
      location: alertLocation,
      category: alertCategory,
      createdAt: new Date().toISOString()
    };
    const updated = { ...profile, alerts: [...profile.alerts, newAlert] };
    handleUpdateProfile(updated);
    setAlertKeyword(''); setAlertLocation(''); setAlertCategory('');
  };

  const handleRemoveAlert = (id: string) => {
    const updated = { ...profile, alerts: profile.alerts.filter(a => a.id !== id) };
    handleUpdateProfile(updated);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Head */}
        <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Professional Profile
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Maintain your career details, education, resume files, and alerts to simplify jobs search.
            </p>
          </div>
          
          <div className="flex justify-center">
            {savedSuccess && (
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes saved successfully</span>
              </span>
            )}
          </div>
        </div>

        {/* Outer Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation left column tabs */}
          <nav className="lg:col-span-3 space-y-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="p-2 mb-4 border-b border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Hub</p>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1">{profile.fullName}</h3>
              <p className="text-xs text-slate-500 truncate">{profile.email}</p>
            </div>

            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'personal'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab('resumes')}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'resumes'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Uploaded Resumes ({profile.cvs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'credentials'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Credentials & Work</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>Job Alerts & Prefs</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Account Controls</span>
            </button>
          </nav>

          {/* Core Settings Right Panel */}
          <main className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
            
            {/* 1. PERSONAL DETAILS TAB */}
            {activeTab === 'personal' && (
              <form onSubmit={handlePersonalSubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-5">
                    Personal Information Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                      <input
                        type="email"
                        required
                        disabled
                        value={profile.email}
                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. +966500000000"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Saudi Arabia City</label>
                      <select
                        value={profile.location || ''}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                      >
                        <option value="">-- Choose city --</option>
                        {SAUDI_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Experience Level</label>
                      <select
                        value={profile.experienceLevel || ''}
                        onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                      >
                        <option value="">-- Choose option --</option>
                        <option value="Entry Level (0-2 Years)">Entry Level (0-2 Years)</option>
                        <option value="Mid-Career (3-5 Years)">Mid-Career (3-5 Years)</option>
                        <option value="Senior Professional (5-10 Years)">Senior Professional (5-10 Years)</option>
                        <option value="Director / Executive (10+ Years)">Director / Executive (10+ Years)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Auxiliary items (Skills, Certs, Languages) */}
                <div className="border-t border-slate-150 dark:border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Skills Section */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">My Skills</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Add skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                      />
                      <button 
                        type="button" 
                        onClick={handleAddSkill}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 p-2 rounded-lg text-emerald-600 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                      {profile.skills.map(skill => (
                        <span key={skill} className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-sm flex items-center gap-1">
                          <span>{skill}</span>
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Section */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Certifications</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Add cert..."
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                      />
                      <button 
                        type="button" 
                        onClick={handleAddCert}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 p-2 rounded-lg text-emerald-600 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                      {profile.certifications.map(cert => (
                        <span key={cert} className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-sm flex items-center gap-1">
                          <span>{cert}</span>
                          <button type="button" onClick={() => handleRemoveCert(cert)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages Section */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Languages</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Add lang..."
                        value={newLang}
                        onChange={(e) => setNewLang(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                      />
                      <button 
                        type="button" 
                        onClick={handleAddLang}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 p-2 rounded-lg text-emerald-600 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                      {profile.languages?.map(lang => (
                        <span key={lang} className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-1 rounded-sm flex items-center gap-1">
                          <span>{lang}</span>
                          <button type="button" onClick={() => handleRemoveLang(lang)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="border-t border-slate-150 dark:border-slate-800 pt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* 2. UPLOADED RESUMES TAB */}
            {activeTab === 'resumes' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-2">
                    Professional CVs / Resumes
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload and manage multiple resumes. When applying, you can specify which version you wish to present.
                  </p>
                </div>

                {/* Drag-and-drop file upload target box */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group bg-slate-50/50 dark:bg-slate-950/20"
                >
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 transition-colors mx-auto mb-3" />
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 block">Drag & Drop Resume, or Browse files</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Supports PDF, DOC, DOCX files (Max size: 10MB)</span>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                </div>

                {errorText && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-lg">
                    {errorText}
                  </div>
                )}

                {/* List of uploaded resumes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">My Resumes ({profile.cvs.length})</h4>
                  {profile.cvs.length === 0 ? (
                    <div className="text-xs text-slate-400 italic p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No CVs uploaded yet. Feel free to upload one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.cvs.map(cv => (
                        <div key={cv.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between bg-white dark:bg-slate-900/50">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="bg-red-500/10 p-2.5 rounded-lg text-red-500">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={cv.name}>{cv.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Uploaded {new Date(cv.uploadedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveCv(cv.id)}
                            className="p-1.5 rounded-lg border border-transparent bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 transition-colors shrink-0"
                            title="Delete resume"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 3. CREDENTIALS & WORK TAB */}
            {activeTab === 'credentials' && (
              <div className="space-y-8">
                
                {/* Work Experience segment */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3">
                      Work Experience History
                    </h3>
                  </div>

                  {/* Add Experience form */}
                  <form onSubmit={handleAddExperience} className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl space-y-4 text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Record New Employment Position</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Company Name (e.g. Saudi Aramco)"
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Job Title / Role (e.g. QC Inspector)"
                        value={expRole}
                        onChange={(e) => setExpRole(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Start Year (e.g. 2021)"
                        value={expStart}
                        onChange={(e) => setExpStart(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="End Year (e.g. Present)"
                        value={expEnd}
                        onChange={(e) => setExpEnd(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <textarea
                      placeholder="Brief description of duties and key milestones..."
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer"
                      >
                        Add Entry
                      </button>
                    </div>
                  </form>

                  {/* Experience List */}
                  <div className="space-y-3 pt-2">
                    {profile.experience.length === 0 ? (
                      <div className="text-xs text-slate-400 italic p-3 text-center border border-slate-100 dark:border-slate-800 rounded-lg">
                        No work experience registered yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {profile.experience.map(exp => (
                          <div key={exp.id} className="border border-slate-150 dark:border-slate-800/80 rounded-xl p-4 flex justify-between bg-white dark:bg-slate-900/40">
                            <div>
                              <p className="font-extrabold text-sm text-slate-900 dark:text-white">{exp.role}</p>
                              <p className="text-xs font-bold text-slate-500 mt-0.5">{exp.company} • <span className="font-mono text-[11px]">{exp.startYear} - {exp.endYear}</span></p>
                              {exp.description && <p className="text-xs text-slate-400 mt-2 whitespace-pre-line leading-relaxed">{exp.description}</p>}
                            </div>
                            <button
                              onClick={() => handleRemoveExperience(exp.id)}
                              className="self-start p-1 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Education segment */}
                <div className="space-y-4 border-t border-slate-150 dark:border-slate-800 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3">
                    Education Qualifications
                  </h3>

                  {/* Add Education form */}
                  <form onSubmit={handleAddEducation} className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl space-y-4 text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Register Academic Degree</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="School or University (e.g. King Saud University)"
                        value={eduSchool}
                        onChange={(e) => setEduSchool(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Degree / Certificate (e.g. Bachelor of Science)"
                        value={eduDegree}
                        onChange={(e) => setEduDegree(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study (e.g. Electrical Engineering)"
                        value={eduField}
                        onChange={(e) => setEduField(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Start Year"
                          value={eduStart}
                          onChange={(e) => setEduStart(e.target.value)}
                          className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Graduation Year"
                          value={eduEnd}
                          onChange={(e) => setEduEnd(e.target.value)}
                          className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer"
                      >
                        Add Entry
                      </button>
                    </div>
                  </form>

                  {/* Education list */}
                  <div className="space-y-3 pt-2">
                    {profile.education.length === 0 ? (
                      <div className="text-xs text-slate-400 italic p-3 text-center border border-slate-100 dark:border-slate-800 rounded-lg">
                        No education history registered yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {profile.education.map(edu => (
                          <div key={edu.id} className="border border-slate-150 dark:border-slate-800/80 rounded-xl p-4 flex justify-between bg-white dark:bg-slate-900/40">
                            <div>
                              <p className="font-extrabold text-sm text-slate-900 dark:text-white">{edu.degree} in {edu.fieldOfStudy}</p>
                              <p className="text-xs font-bold text-slate-500 mt-0.5">{edu.school} • <span className="font-mono text-[11px]">{edu.startYear} - {edu.endYear}</span></p>
                            </div>
                            <button
                              onClick={() => handleRemoveEducation(edu.id)}
                              className="self-start p-1 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 4. JOB ALERTS TAB */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-2">
                    Job Alerts & Custom Preferences
                  </h3>
                  <p className="text-xs text-slate-400">
                    Get instantly matched whenever the Admin publishes new opportunities. Define your filter criteria below.
                  </p>
                </div>

                <form onSubmit={handleAddAlert} className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keyword / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Inspector, Civil"
                      value={alertKeyword}
                      onChange={(e) => setAlertKeyword(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">KSA Location</label>
                    <select
                      value={alertLocation}
                      onChange={(e) => setAlertLocation(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="">All Locations</option>
                      {SAUDI_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                    <select
                      value={alertCategory}
                      onChange={(e) => setAlertCategory(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 cursor-pointer h-[38px] flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Alert</span>
                  </button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Alerts ({profile.alerts?.length || 0})</h4>
                  {!profile.alerts || profile.alerts.length === 0 ? (
                    <div className="text-xs text-slate-400 italic p-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No active job alerts configured yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {profile.alerts.map(alert => (
                        <div key={alert.id} className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between bg-white dark:bg-slate-900/50 text-xs">
                          <div className="flex flex-wrap items-center gap-3">
                            {alert.keyword && (
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                Keyword: <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-semibold">{alert.keyword}</span>
                              </span>
                            )}
                            {alert.location && (
                              <span className="text-slate-500">
                                Location: <span className="font-bold text-slate-700 dark:text-slate-300">{alert.location}</span>
                              </span>
                            )}
                            {alert.category && (
                              <span className="text-slate-500">
                                Category: <span className="font-bold text-slate-700 dark:text-slate-300">{alert.category}</span>
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveAlert(alert.id)}
                            className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 5. ACCOUNT CONTROLS TAB */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                
                {/* Password modification */}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-emerald-500 pl-3 mb-2">
                      Change Profile Password
                    </h3>
                    <p className="text-xs text-slate-400">
                      Keep your account secure by modifying your login credentials periodically.
                    </p>
                  </div>

                  {passwordChangeSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Password updated successfully.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                {/* Account Removal section */}
                <div className="border-t border-rose-150 pt-8 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-rose-600 uppercase tracking-widest border-l-2 border-rose-500 pl-3 mb-2">
                      Danger Zone: Delete Account
                    </h3>
                    <p className="text-xs text-slate-400">
                      Permanently erase your entire candidate profile, uploaded resumes, saved preferences, and application histories. This action is irreversible.
                    </p>
                  </div>

                  {confirmDelete ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-4">
                      <p className="text-xs text-rose-700 font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-5 h-5" />
                        <span>Are you absolutely certain? This will immediately delete your record.</span>
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-50 cursor-pointer"
                        >
                          No, Keep Profile
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
                        >
                          Yes, Delete Permanently
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer border border-rose-200/50"
                      >
                        Delete My Candidate Account
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}

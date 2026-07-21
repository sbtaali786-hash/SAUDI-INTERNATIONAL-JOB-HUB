import React, { useState, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Briefcase, Plus, UploadCloud, FileSpreadsheet, Megaphone, 
  Settings, Users, Eye, Edit2, Trash2, CheckCircle2, AlertTriangle, Download, 
  ArrowUpRight, RefreshCw, Sparkles, AlertCircle, EyeOff, Save, Check 
} from 'lucide-react';
import { Job, AdPlacement, AdminSettings, AdPosition } from '../types';
import { 
  getJobs, saveJobs, getAdPlacements, saveAdPlacements, 
  getAdminSettings, saveAdminSettings 
} from '../lib/storage';
import { SAUDI_CITIES, CATEGORIES } from '../data/mockJobs';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface AdminViewProps {
  onNavigate: (view: string, params?: any) => void;
  onRefreshJobs: () => void;
}

export default function AdminView({ onNavigate, onRefreshJobs }: AdminViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'manual' | 'bulk' | 'ads' | 'settings' | 'reports'>('dashboard');
  
  // Storage hooks
  const jobs = useMemo(() => getJobs(), [activeSubTab]);
  const adPlacements = useMemo(() => getAdPlacements(), [activeSubTab]);
  const adminSettings = useMemo(() => getAdminSettings(), [activeSubTab]);
  
  // Reports storage
  const reports = useMemo(() => {
    return JSON.parse(localStorage.getItem('job_today_ksa_reports') || '[]');
  }, [activeSubTab]);

  // Form states (Manual Upload)
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLogo, setFormLogo] = useState('');
  const [formLocation, setFormLocation] = useState('Riyadh');
  const [formCategory, setFormCategory] = useState('Mechanical');
  const [formSalary, setFormSalary] = useState('SAR 8,000 - 10,000');
  const [formExperience, setFormExperience] = useState('3 - 5 Years');
  const [formQualification, setFormQualification] = useState("Bachelor's Degree");
  const [formJobType, setFormJobType] = useState('Full-time');
  const [formNationality, setFormNationality] = useState('Any');
  const [formGender, setFormGender] = useState('Any');
  const [formVacancies, setFormVacancies] = useState(1);
  const [formWorkingHours, setFormWorkingHours] = useState('8 Hours / Day');
  const [formBenefits, setFormBenefits] = useState('Medical Insurance, Annual Flight Ticket');
  const [formVisa, setFormVisa] = useState('Transferable Iqama');
  const [formAccommodation, setFormAccommodation] = useState('Provided');
  const [formTransportation, setFormTransportation] = useState('Provided');
  const [formFood, setFormFood] = useState('Not Provided');
  const [formMedical, setFormMedical] = useState('Provided');
  const [formOvertime, setFormOvertime] = useState('As per labor law');
  const [formDescription, setFormDescription] = useState('');
  const [formResponsibilities, setFormResponsibilities] = useState('');
  const [formRequirements, setFormRequirements] = useState('');
  const [formSkills, setFormSkills] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDeadline, setFormDeadline] = useState('2026-12-31');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formUrgent, setFormUrgent] = useState(false);
  const [formStatus, setFormStatus] = useState<'Active' | 'Expired' | 'Draft'>('Active');
  
  // Preview Drawer Toggle
  const [showFormPreview, setShowFormPreview] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  // Bulk Upload state
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkJobsPreview, setBulkJobsPreview] = useState<Partial<Job>[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // General settings state
  const [settWhatsapp, setSettWhatsapp] = useState(adminSettings.whatsappNumber);
  const [settEmail, setSettEmail] = useState(adminSettings.emailAddress);
  const [settPhone, setSettPhone] = useState(adminSettings.phoneNumber);
  const [settSuccessMsg, setSettSuccessMsg] = useState('');

  // Ad Placement states
  const [adsList, setAdsList] = useState<AdPlacement[]>([...adPlacements]);
  const [adsSuccessMsg, setAdsSuccessMsg] = useState('');

  // Statistics memo
  const stats = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter(j => j.status === 'Active').length;
    const expired = jobs.filter(j => j.status === 'Expired').length;
    const featured = jobs.filter(j => j.featured).length;
    const urgent = jobs.filter(j => j.urgent).length;
    const profiles = JSON.parse(localStorage.getItem('job_today_ksa_profiles') || '[]');
    const totalUsers = profiles.length;
    
    // Sum total applications
    let totalApps = 0;
    profiles.forEach((p: any) => {
      totalApps += (p.appliedJobs?.length || 0);
    });

    return { total, active, expired, featured, urgent, totalUsers, totalApps };
  }, [jobs]);

  // Handle Manual Job Save (Create or Update)
  const handleSaveManualJob = (e: React.FormEvent) => {
    e.preventDefault();

    const slug = `${formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${formCompany.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;

    const finalJob: Job = {
      id: editingJobId || `job-${Math.random().toString(36).substring(2, 9)}`,
      title: formTitle,
      companyName: formCompany,
      companyLogo: formLogo,
      location: formLocation,
      category: formCategory,
      salary: formSalary,
      experience: formExperience,
      qualification: formQualification,
      jobType: formJobType,
      nationality: formNationality,
      gender: formGender,
      vacancies: Number(formVacancies) || 1,
      workingHours: formWorkingHours,
      benefits: formBenefits,
      visaStatus: formVisa,
      accommodation: formAccommodation,
      transportation: formTransportation,
      food: formFood,
      medical: formMedical,
      overtime: formOvertime,
      description: formDescription,
      responsibilities: formResponsibilities,
      requirements: formRequirements,
      skills: formSkills,
      whatsappNumber: formWhatsapp || adminSettings.whatsappNumber,
      emailAddress: formEmail || adminSettings.emailAddress,
      phoneNumber: formPhone || adminSettings.phoneNumber,
      deadline: formDeadline,
      featured: formFeatured,
      urgent: formUrgent,
      status: formStatus,
      createdAt: editingJobId ? (jobs.find(j => j.id === editingJobId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      slug: slug
    };

    const currentJobs = getJobs();
    if (editingJobId) {
      const idx = currentJobs.findIndex(j => j.id === editingJobId);
      if (idx >= 0) currentJobs[idx] = finalJob;
    } else {
      currentJobs.unshift(finalJob);
    }

    saveJobs(currentJobs);
    onRefreshJobs();

    setManualSuccessMsg(editingJobId ? 'Vacancy updated successfully!' : 'Vacancy published successfully!');
    setTimeout(() => {
      setManualSuccessMsg('');
      resetManualForm();
      setActiveSubTab('dashboard');
    }, 1500);
  };

  const resetManualForm = () => {
    setEditingJobId(null);
    setFormTitle('');
    setFormCompany('');
    setFormLogo('');
    setFormLocation('Riyadh');
    setFormCategory('Mechanical');
    setFormSalary('SAR 8,000 - 10,000');
    setFormExperience('3 - 5 Years');
    setFormQualification("Bachelor's Degree");
    setFormJobType('Full-time');
    setFormNationality('Any');
    setFormGender('Any');
    setFormVacancies(1);
    setFormWorkingHours('8 Hours / Day');
    setFormBenefits('Medical Insurance, Annual Flight Ticket');
    setFormVisa('Transferable Iqama');
    setFormAccommodation('Provided');
    setFormTransportation('Provided');
    setFormFood('Not Provided');
    setFormMedical('Provided');
    setFormOvertime('As per labor law');
    setFormDescription('');
    setFormResponsibilities('');
    setFormRequirements('');
    setFormSkills('');
    setFormWhatsapp('');
    setFormEmail('');
    setFormPhone('');
    setFormDeadline('2026-12-31');
    setFormFeatured(false);
    setFormUrgent(false);
    setFormStatus('Active');
    setShowFormPreview(false);
  };

  const handleEditJob = (job: Job) => {
    setEditingJobId(job.id);
    setFormTitle(job.title);
    setFormCompany(job.companyName);
    setFormLogo(job.companyLogo);
    setFormLocation(job.location);
    setFormCategory(job.category);
    setFormSalary(job.salary);
    setFormExperience(job.experience);
    setFormQualification(job.qualification);
    setFormJobType(job.jobType);
    setFormNationality(job.nationality);
    setFormGender(job.gender);
    setFormVacancies(job.vacancies);
    setFormWorkingHours(job.workingHours);
    setFormBenefits(job.benefits);
    setFormVisa(job.visaStatus);
    setFormAccommodation(job.accommodation);
    setFormTransportation(job.transportation);
    setFormFood(job.food);
    setFormMedical(job.medical);
    setFormOvertime(job.overtime);
    setFormDescription(job.description);
    setFormResponsibilities(job.responsibilities);
    setFormRequirements(job.requirements);
    setFormSkills(job.skills);
    setFormWhatsapp(job.whatsappNumber);
    setFormEmail(job.emailAddress);
    setFormPhone(job.phoneNumber);
    setFormDeadline(job.deadline);
    setFormFeatured(job.featured);
    setFormUrgent(job.urgent);
    setFormStatus(job.status);
    setActiveSubTab('manual');
  };

  const handleDeleteJobClick = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this job?')) {
      const current = getJobs();
      const filtered = current.filter(j => j.id !== id);
      saveJobs(filtered);
      onRefreshJobs();
    }
  };

  // Bulk Upload File Handler
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFile(file);
    setBulkErrors([]);

    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (Array.isArray(parsed)) {
            setBulkJobsPreview(parsed);
          } else {
            setBulkErrors(['JSON file must be an array of jobs.']);
          }
        } catch {
          setBulkErrors(['Invalid JSON file syntax.']);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setBulkJobsPreview(results.data as any[]);
          } else {
            setBulkErrors(['The CSV file appears to be empty.']);
          }
        },
        error: (err) => {
          setBulkErrors([`CSV parsing error: ${err.message}`]);
        }
      });
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          if (jsonData && jsonData.length > 0) {
            setBulkJobsPreview(jsonData as any[]);
          } else {
            setBulkErrors(['The Excel sheet appears to be empty.']);
          }
        } catch (err: any) {
          setBulkErrors([`Excel parsing error: ${err.message || err}`]);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setBulkErrors(['Unsupported file format. Please upload an Excel (.xlsx, .xls), CSV, or JSON file.']);
    }
  };

  // Execute Bulk Import
  const handleExecuteBulkImport = () => {
    if (bulkJobsPreview.length === 0) return;

    const currentJobs = getJobs();
    let importCount = 0;
    let duplicateCount = 0;

    const validatedJobs: Job[] = [];

    bulkJobsPreview.forEach(raw => {
      // Validate core parameters
      if (!raw.title || !raw.companyName) {
        return; // skip rows missing title/company
      }

      // Check if duplicate of an existing title + company
      const isDupe = currentJobs.some(j => 
        j.title.toLowerCase() === raw.title!.toLowerCase() && 
        j.companyName.toLowerCase() === raw.companyName!.toLowerCase()
      );

      if (isDupe) {
        duplicateCount++;
        return; // skip duplicates
      }

      const cleanTitle = String(raw.title);
      const cleanCompany = String(raw.companyName);
      const randomID = `job-bulk-${Math.random().toString(36).substring(2, 9)}`;
      const slug = `${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${cleanCompany.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;

      const newJob: Job = {
        id: randomID,
        title: cleanTitle,
        companyName: cleanCompany,
        companyLogo: String(raw.companyLogo || ''),
        location: String(raw.location || 'Riyadh'),
        category: String(raw.category || 'Mechanical'),
        salary: String(raw.salary || 'SAR 8,000 - 10,000'),
        experience: String(raw.experience || '3 - 5 Years'),
        qualification: String(raw.qualification || "Bachelor's Degree"),
        jobType: String(raw.jobType || 'Full-time'),
        nationality: String(raw.nationality || 'Any'),
        gender: String(raw.gender || 'Any'),
        vacancies: Number(raw.vacancies) || 1,
        workingHours: String(raw.workingHours || '8 Hours / Day'),
        benefits: String(raw.benefits || 'Medical Insurance, Accommodation'),
        visaStatus: String(raw.visaStatus || 'Transferable Iqama'),
        accommodation: String(raw.accommodation || 'Provided'),
        transportation: String(raw.transportation || 'Provided'),
        food: String(raw.food || 'Not Provided'),
        medical: String(raw.medical || 'Provided'),
        overtime: String(raw.overtime || 'As per labor law'),
        description: String(raw.description || `We are hiring for the position of ${cleanTitle}.`),
        responsibilities: String(raw.responsibilities || 'To be discussed in interview.'),
        requirements: String(raw.requirements || 'Relevant experience and qualification required.'),
        skills: String(raw.skills || ''),
        whatsappNumber: String(raw.whatsappNumber || adminSettings.whatsappNumber),
        emailAddress: String(raw.emailAddress || adminSettings.emailAddress),
        phoneNumber: String(raw.phoneNumber || adminSettings.phoneNumber),
        deadline: String(raw.deadline || '2026-12-31'),
        featured: raw.featured === true || String(raw.featured).toLowerCase() === 'true',
        urgent: raw.urgent === true || String(raw.urgent).toLowerCase() === 'true',
        status: 'Active',
        createdAt: new Date().toISOString(),
        slug: slug
      };

      validatedJobs.push(newJob);
      importCount++;
    });

    const combined = [...validatedJobs, ...currentJobs];
    saveJobs(combined);
    onRefreshJobs();

    setBulkSuccessMsg(`Successfully imported ${importCount} jobs! Skiped ${duplicateCount} duplicate vacancies.`);
    setBulkFile(null);
    setBulkJobsPreview([]);
    
    setTimeout(() => {
      setBulkSuccessMsg('');
      setActiveSubTab('dashboard');
    }, 2500);
  };

  // Download official CSV Excel bulk template
  const handleDownloadTemplate = () => {
    const headers = [
      'title', 'companyName', 'companyLogo', 'location', 'category', 'salary', 
      'experience', 'qualification', 'jobType', 'nationality', 'gender', 
      'vacancies', 'workingHours', 'benefits', 'visaStatus', 'accommodation', 
      'transportation', 'food', 'medical', 'overtime', 'description', 
      'responsibilities', 'requirements', 'skills', 'whatsappNumber', 
      'emailAddress', 'phoneNumber', 'deadline', 'featured', 'urgent'
    ];

    const sampleRow = [
      'QC Welding Inspector', 'Saudi Projects Co.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', 
      'Jubail', 'QC Welding Inspector', 'SAR 9,000 - 11,000', '5 Years', 'Diploma', 
      'Contract', 'Any', 'Male', '3', '10 Hours', 'Medical & Food Allowance', 
      'Transferable Iqama', 'Provided', 'Provided', 'SAR 300 Allowance', 'Class A', 
      'Overtime applicable', 'We require experienced Welding Inspectors for shutdown.', 
      'Visual inspection of joints\nPrepare QC reports', 'AWS CWI or CSWIP 3.1 Certified', 
      'Welding, NDT, QC, Inspection', '+966501234567', 'hr@saudiprojects.sa', 
      '+966133004000', '2026-12-31', 'TRUE', 'TRUE'
    ];

    const csvContent = Papa.unparse({
      fields: headers,
      data: [sampleRow]
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'job_today_ksa_bulk_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save General Default Contact settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminSettings({
      whatsappNumber: settWhatsapp,
      emailAddress: settEmail,
      phoneNumber: settPhone
    });
    setSettSuccessMsg('Default contact settings updated!');
    setTimeout(() => setSettSuccessMsg(''), 2000);
  };

  // Toggle & Edit Ads Code
  const handleUpdateAdPlacement = (id: AdPosition, enabled: boolean, code: string) => {
    const updated = adsList.map(ad => {
      if (ad.id === id) {
        return { ...ad, enabled, code };
      }
      return ad;
    });
    setAdsList(updated);
  };

  const handleSaveAds = () => {
    saveAdPlacements(adsList);
    setAdsSuccessMsg('Advertisement codes synchronized successfully!');
    setTimeout(() => setAdsSuccessMsg(''), 2500);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Head branding header */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-sm uppercase tracking-wider">
              Secure Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              JOB TODAY KSA CONTROL PANEL
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="bg-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Back to Live Portal
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-extrabold uppercase tracking-wider mb-8">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`pb-3 border-b-2 cursor-pointer ${activeSubTab === 'dashboard' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSubTab('manual')}
            className={`pb-3 border-b-2 cursor-pointer ${activeSubTab === 'manual' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {editingJobId ? 'Edit Vacancy' : 'Manual Upload'}
          </button>
          <button
            onClick={() => setActiveSubTab('bulk')}
            className={`pb-3 border-b-2 cursor-pointer ${activeSubTab === 'bulk' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Bulk Excel / CSV
          </button>
          <button
            onClick={() => setActiveSubTab('ads')}
            className={`pb-3 border-b-2 cursor-pointer ${activeSubTab === 'ads' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Advertisement Ads
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`pb-3 border-b-2 cursor-pointer ${activeSubTab === 'settings' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Default Settings
          </button>
          <button
            onClick={() => setActiveSubTab('reports')}
            className={`pb-3 border-b-2 cursor-pointer relative ${activeSubTab === 'reports' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <span>User Reports</span>
            {reports.length > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        {/* 1. DASHBOARD SUBTAB */}
        {activeSubTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Statistics Row Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Vacancies</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{stats.total}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Jobs</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{stats.active}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Registered Candidates</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">{stats.totalUsers}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Applications Logs</span>
                <span className="text-2xl font-black text-amber-500 mt-1 block">{stats.totalApps}</span>
              </div>
            </div>

            {/* Jobs Management List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-slate-950 dark:text-white text-base">All Published Jobs ({jobs.length})</h3>
                <button
                  onClick={() => { resetManualForm(); setActiveSubTab('manual'); }}
                  className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manually Post Job</span>
                </button>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No jobs currently uploaded. Go to manual or bulk upload to insert vacancies.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 uppercase tracking-widest font-bold text-[10px]">
                        <th className="py-3 px-4">Title / Company</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Salary</th>
                        <th className="py-3 px-4">Type / Featured</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 dark:text-white block">{job.title}</span>
                            <span className="text-[10px] text-slate-500">{job.companyName} • {job.category}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{job.location}</td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{job.salary}</td>
                          <td className="py-3.5 px-4 space-x-1.5">
                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-bold">{job.jobType}</span>
                            {job.featured && <span className="bg-emerald-500/15 text-emerald-600 text-[9px] font-bold px-1 py-0.5 rounded">Featured</span>}
                            {job.urgent && <span className="bg-amber-500/15 text-amber-600 text-[9px] font-bold px-1 py-0.5 rounded">Urgent</span>}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => handleEditJob(job)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-600 cursor-pointer"
                              title="Edit Job"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteJobClick(job.id)}
                              className="p-1.5 rounded-lg border border-transparent bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                              title="Delete Job"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. MANUAL UPLOAD SUBTAB */}
        {activeSubTab === 'manual' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingJobId ? 'Edit Vacancy details' : 'Post Manual Vacancy'}
                </h3>
                <p className="text-xs text-slate-400">Fill in the comprehensive thirty parameters to launch a premium job listing on JOB TODAY KSA.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormPreview(!showFormPreview)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showFormPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetManualForm}
                  className="text-xs text-slate-400 hover:text-rose-500 font-bold px-3 py-2 cursor-pointer"
                >
                  Reset Form
                </button>
              </div>
            </div>

            {manualSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{manualSuccessMsg}</span>
              </div>
            )}

            {/* Manual Form + Preview Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form container */}
              <form onSubmit={handleSaveManualJob} className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 ${showFormPreview ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
                
                {/* 1. Core Info */}
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Core Vacancy Info</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Title *</label>
                      <input
                        type="text" required placeholder="e.g. Mechanical QC Inspector"
                        value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Name *</label>
                      <input
                        type="text" required placeholder="e.g. Al-Falak Contracting"
                        value={formCompany} onChange={(e) => setFormCompany(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Logo URL (Optional)</label>
                      <input
                        type="text" placeholder="e.g. https://images.unsplash.com/photo-..."
                        value={formLogo} onChange={(e) => setFormLogo(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location *</label>
                        <select
                          value={formLocation} onChange={(e) => setFormLocation(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white cursor-pointer"
                        >
                          {SAUDI_CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category *</label>
                        <select
                          value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white cursor-pointer"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Core specs */}
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Salary & Requirements</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Salary Range (SAR) *</label>
                      <input
                        type="text" required placeholder="e.g. SAR 7,000 - 9,500"
                        value={formSalary} onChange={(e) => setFormSalary(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience Range *</label>
                      <input
                        type="text" required placeholder="e.g. 5 - 8 Years"
                        value={formExperience} onChange={(e) => setFormExperience(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min Qualification *</label>
                      <input
                        type="text" required placeholder="e.g. Diploma / Degree in Mech"
                        value={formQualification} onChange={(e) => setFormQualification(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employment Type *</label>
                      <select
                        value={formJobType} onChange={(e) => setFormJobType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white cursor-pointer"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nationality *</label>
                      <input
                        type="text" placeholder="e.g. Any or Saudi National Only"
                        value={formNationality} onChange={(e) => setFormNationality(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender *</label>
                        <select
                          value={formGender} onChange={(e) => setFormGender(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white cursor-pointer"
                        >
                          <option value="Any">Any</option>
                          <option value="Male">Male Only</option>
                          <option value="Female">Female Only</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vacancies *</label>
                        <input
                          type="number" required
                          value={formVacancies} onChange={(e) => setFormVacancies(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Logistics */}
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Logistics & Allowances</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Working Hours</label>
                      <input type="text" value={formWorkingHours} onChange={(e) => setFormWorkingHours(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accommodation</label>
                      <input type="text" value={formAccommodation} onChange={(e) => setFormAccommodation(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transportation</label>
                      <input type="text" value={formTransportation} onChange={(e) => setFormTransportation(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Food / Messing</label>
                      <input type="text" value={formFood} onChange={(e) => setFormFood(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                    </div>
                  </div>
                </div>

                {/* 4. Contact details */}
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Direct Apply Channels</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apply WhatsApp Number</label>
                      <input
                        type="text" placeholder="e.g. +966501234567"
                        value={formWhatsapp} onChange={(e) => setFormWhatsapp(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apply Email Address</label>
                      <input
                        type="email" placeholder="e.g. apply@company.sa"
                        value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Call Now Phone Number</label>
                      <input
                        type="text" placeholder="e.g. +966114002000"
                        value={formPhone} onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Descriptions */}
                <div className="space-y-4">
                  <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Detailed Paragraphs</div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Description Summary *</label>
                    <textarea
                      required rows={3} placeholder="Provide a detailed, professional synopsis of the role..."
                      value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responsibilities (One per line)</label>
                      <textarea
                        rows={3} placeholder="e.g. Perform fit-up checks\nCoordinate visual inspections"
                        value={formResponsibilities} onChange={(e) => setFormResponsibilities(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requirements (One per line)</label>
                      <textarea
                        rows={3} placeholder="e.g. Certified CSWIP 3.1\nFluency in English"
                        value={formRequirements} onChange={(e) => setFormRequirements(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Skills (Comma separated)</label>
                      <input
                        type="text" placeholder="Welding, QC Inspection, SCE"
                        value={formSkills} onChange={(e) => setFormSkills(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Benefits & Allowances List</label>
                      <input
                        type="text" placeholder="GOSI, Medical Class A, Accommodation provided"
                        value={formBenefits} onChange={(e) => setFormBenefits(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Deadline *</label>
                      <input
                        type="date" required
                        value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</label>
                        <select
                          value={formStatus} onChange={(e) => setFormStatus(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-lg px-2.5 py-2 text-xs"
                        >
                          <option value="Active">Active</option>
                          <option value="Expired">Expired</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1 pt-5">
                        <input
                          type="checkbox" id="featured"
                          checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)}
                          className="rounded text-emerald-600 h-4 w-4"
                        />
                        <label htmlFor="featured" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Featured</label>
                      </div>
                      <div className="flex items-center gap-1 pt-5">
                        <input
                          type="checkbox" id="urgent"
                          checked={formUrgent} onChange={(e) => setFormUrgent(e.target.checked)}
                          className="rounded text-emerald-600 h-4 w-4"
                        />
                        <label htmlFor="urgent" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Urgent</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-150 dark:border-slate-800 pt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={resetManualForm}
                    className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    {editingJobId ? 'SAVE VACANCY EDITS' : 'PUBLISH LIVE VACANCY'}
                  </button>
                </div>

              </form>

              {/* Form Live Preview Column */}
              {showFormPreview && (
                <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 sticky top-24 max-h-[85vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Eye className="w-4.5 h-4.5 text-emerald-500" />
                      <span>Live Candidate View Preview</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">PREVIEW</span>
                  </div>

                  <div className="space-y-5 text-white text-xs">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {formCompany ? formCompany.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : 'CO'}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{formTitle || 'Job Title Placeholder'}</h4>
                          <p className="text-slate-400 font-bold">{formCompany || 'Company Name'}</p>
                          <p className="text-slate-500 font-semibold text-[10px] mt-1">🇸🇦 {formLocation} • {formCategory}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
                      <div className="font-bold border-b border-slate-800 pb-2">Description Summary</div>
                      <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-line">{formDescription || 'Please start typing description details to preview.'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col">
                        <span className="text-slate-500 font-bold">SALARY OFFERED</span>
                        <span className="font-extrabold text-white mt-1 text-xs">{formSalary}</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-col">
                        <span className="text-slate-500 font-bold">REQUIRED EXPERIENCE</span>
                        <span className="font-extrabold text-white mt-1 text-xs">{formExperience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* 3. BULK UPLOAD SUBTAB */}
        {activeSubTab === 'bulk' && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Bulk Job Importer (Spreadsheet Upload)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload hundreds or thousands of vacancies inside Saudi Arabia in seconds using standard CSV or JSON sheets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Excel/CSV Template</span>
                </button>
              </div>

              {bulkSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{bulkSuccessMsg}</span>
                </div>
              )}

              {/* Upload Drag zone */}
              <div 
                onClick={() => bulkFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-950/20"
              >
                <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <span className="font-extrabold text-slate-800 dark:text-slate-200 block">Upload Excel spreadsheet or JSON database</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Accepts Microsoft Excel (.xlsx, .xls), CSV (.csv), or raw database .json files</span>
                
                <input
                  type="file"
                  ref={bulkFileInputRef}
                  onChange={handleBulkFileChange}
                  accept=".csv,.json,.xlsx,.xls"
                  className="hidden"
                />
              </div>

              {/* Excel Spreadsheet Format Template Column Guide */}
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800/85 pt-6">
                <div className="bg-slate-50 dark:bg-slate-950/40 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800/60 space-y-4">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />
                    <h4 className="text-xs font-black uppercase tracking-wider">Excel / CSV Format Column Reference Guide</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    When creating or editing your jobs list, ensure your spreadsheet contains the following exact column header names. You can directly upload your standard Microsoft Excel spreadsheet (<span className="font-bold text-slate-700 dark:text-slate-300">.xlsx, .xls</span>) or CSV files!
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">title</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Required • Role name</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">e.g. QC Inspector / Mechanical Engineer</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">companyName</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Required • Employer name</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">e.g. Saudi Aramco Subcontractor Co.</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">location</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Optional • KSA City</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">e.g. Jubail / Dammam / Riyadh</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">category</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Optional • Filter Sector</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">e.g. QC Welding Inspector / Civil / Electrical</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">salary</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Optional • Salary Range</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">e.g. SAR 8,000 - 11,000</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">whatsappNumber</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Optional • Direct Chat Apply</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">e.g. +966501234567</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">emailAddress</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Optional • Direct Email Apply</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">e.g. jobs@saudiprojects.sa</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">visaStatus</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Optional • Iqama status</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">e.g. Transferable Iqama</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold block">featured / urgent</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Optional • Homepage Promo</span>
                      <span className="text-slate-600 dark:text-slate-300 italic mt-1 block">Value must be TRUE or FALSE</span>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 text-amber-800 dark:text-amber-400 p-3.5 rounded-lg border border-amber-500/20 text-[11px] leading-relaxed">
                    <span className="font-extrabold block mb-0.5">💡 Pro Tip for Website Owner:</span>
                    When you click the <span className="font-bold">"Download Excel/CSV Template"</span> button above, it will instantly generate an Excel-ready template prefilled with a complete sample job so you can easily replicate the format.
                  </div>
                </div>
              </div>

              {/* File details & previews */}
              {bulkFile && (
                <div className="mt-6 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Selected File: {bulkFile.name}</span>
                    <span className="text-slate-400">Detected {bulkJobsPreview.length} entries to validate.</span>
                  </div>
                  <button
                    onClick={() => { setBulkFile(null); setBulkJobsPreview([]); }}
                    className="text-rose-500 hover:text-rose-600 font-bold"
                  >
                    Remove File
                  </button>
                </div>
              )}

              {bulkErrors.length > 0 && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-xl space-y-1">
                  {bulkErrors.map((err, i) => <div key={i} className="flex items-center gap-1"><AlertTriangle className="w-4 h-4" /><span>{err}</span></div>)}
                </div>
              )}

              {/* Preview Entries Grid */}
              {bulkJobsPreview.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Import Preview List (First 5 Rows Shown)</h4>
                    <button
                      onClick={handleExecuteBulkImport}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/15 cursor-pointer"
                    >
                      EXECUTE BATCH IMPORT ({bulkJobsPreview.length} JOBS)
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <th className="p-3">Job Title</th>
                          <th className="p-3">Company Name</th>
                          <th className="p-3">Location KSA</th>
                          <th className="p-3">Salary Range</th>
                          <th className="p-3">Domain</th>
                          <th className="p-3">Job Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {bulkJobsPreview.slice(0, 5).map((bj, i) => (
                          <tr key={i} className="hover:bg-slate-50/20">
                            <td className="p-3 font-bold text-slate-900 dark:text-white">{bj.title || <span className="text-rose-500 font-normal italic">Missing title</span>}</td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">{bj.companyName || <span className="text-rose-500 font-normal italic">Missing company</span>}</td>
                            <td className="p-3">{bj.location || 'Riyadh'}</td>
                            <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">{bj.salary || 'SAR 8000'}</td>
                            <td className="p-3 text-indigo-500 font-semibold">{bj.category || 'Mechanical'}</td>
                            <td className="p-3"><span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-[10px]">{bj.jobType || 'Full-time'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {bulkJobsPreview.length > 5 && (
                    <p className="text-[11px] text-slate-400 italic text-center mt-2">
                      ... and {bulkJobsPreview.length - 5} more rows waiting to be published securely.
                    </p>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

        {/* 4. ADS MANAGEMENT SUBTAB */}
        {activeSubTab === 'ads' && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Advertisement script management Console
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Control ten distinct responsive ad placements without touching source code. Compatible with Google AdSense and Adsterra code scripts.
                  </p>
                </div>

                <button
                  onClick={handleSaveAds}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/15 cursor-pointer"
                >
                  SAVE AD SLOTS SYNC
                </button>
              </div>

              {adsSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{adsSuccessMsg}</span>
                </div>
              )}

              {/* Placements listing */}
              <div className="space-y-6">
                {adsList.map((ad) => (
                  <div key={ad.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-950/40 space-y-3">
                    
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">{ad.label}</span>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ad.enabled}
                          onChange={(e) => handleUpdateAdPlacement(ad.id, e.target.checked, ad.code)}
                          className="rounded text-emerald-600 h-4 w-4"
                        />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Enable Ad Placement</span>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <textarea
                        disabled={!ad.enabled}
                        value={ad.code}
                        onChange={(e) => handleUpdateAdPlacement(ad.id, ad.enabled, e.target.value)}
                        rows={3}
                        placeholder="Paste arbitrary HTML banner block, Javascript script loader, or Adsterra scripts here..."
                        className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl p-3 font-mono text-[10px] ${
                          !ad.enabled ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-800 dark:text-emerald-400'
                        }`}
                      />
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* 5. DEFAULT SETTINGS SUBTAB */}
        {activeSubTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Global Default Contacts
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure default values that populate automatically when manually publishing jobs if specific info is omitted.
              </p>
            </div>

            {settSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{settSuccessMsg}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default WhatsApp Number</label>
                <input
                  type="text" required
                  value={settWhatsapp} onChange={(e) => setSettWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-4 py-3"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default Apply Email</label>
                <input
                  type="email" required
                  value={settEmail} onChange={(e) => setSettEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-4 py-3"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Default Phone Number</label>
                <input
                  type="text" required
                  value={settPhone} onChange={(e) => setSettPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer"
              >
                Save Defaults
              </button>
            </div>

          </form>
        )}

        {/* 6. USER REPORTS TAB */}
        {activeSubTab === 'reports' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              Inaccurate Vacancy Reports List ({reports.length})
            </h3>

            {reports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No user report flags currently logged. Excellent portal synchronization!
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {reports.map((rep: any) => (
                  <div key={rep.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/40">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block">{rep.jobTitle}</span>
                        <span className="text-[10px] text-slate-500">Company: {rep.companyName} • Reported by: {rep.userEmail}</span>
                      </div>
                      <span className="bg-rose-50 text-rose-700 dark:bg-rose-950/20 text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">
                        {rep.reason}
                      </span>
                    </div>
                    {rep.details && (
                      <p className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50 leading-relaxed text-[11px]">
                        {rep.details}
                      </p>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-150/40 text-[10px] text-slate-400">
                      <span>Report Logged: {new Date(rep.reportedAt).toLocaleString()}</span>
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            // Delete flag
                            const updated = reports.filter((r: any) => r.id !== rep.id);
                            localStorage.setItem('job_today_ksa_reports', JSON.stringify(updated));
                            onRefreshJobs();
                          }}
                          className="text-emerald-600 font-bold hover:underline"
                        >
                          Resolve & Dismiss
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => {
                            const matchJob = jobs.find(j => j.id === rep.jobId);
                            if (matchJob) handleEditJob(matchJob);
                          }}
                          className="text-indigo-600 font-bold hover:underline"
                        >
                          Edit Matching Job
                        </button>
                      </div>
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

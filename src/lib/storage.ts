import { Job, UserProfile, AdPlacement, AdminSettings, AdPosition } from '../types';
import { INITIAL_JOBS } from '../data/mockJobs';

const JOBS_KEY = 'job_today_ksa_jobs';
const PROFILES_KEY = 'job_today_ksa_profiles';
const CURRENT_USER_KEY = 'job_today_ksa_curr_user';
const ADMIN_LOGGED_IN_KEY = 'job_today_ksa_admin_logged';
const AD_PLACEMENTS_KEY = 'job_today_ksa_ads';
const SETTINGS_KEY = 'job_today_ksa_settings';

const DEFAULT_ADS: AdPlacement[] = [
  {
    id: 'homepage_top',
    label: 'Homepage Top Banner (Full Width)',
    enabled: true,
    code: '<div class="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 text-center text-slate-400 font-mono text-xs flex flex-col md:flex-row items-center justify-between gap-4"><div class="text-left"><span class="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mr-2 border border-amber-500/30">ADVERTISEMENT</span><p class="text-white font-sans text-sm font-semibold mt-1">Upgrade your career with Job Today KSA Premium Services</p></div><a href="#search" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-sans font-bold text-xs px-4 py-2 rounded-lg transition-colors">Learn More</a></div>'
  },
  {
    id: 'below_search',
    label: 'Below Homepage Search Bar',
    enabled: true,
    code: '<div class="w-full bg-linear-to-r from-emerald-950 to-teal-950 border border-emerald-900/50 rounded-xl p-4 text-center text-emerald-300 font-sans text-xs flex items-center justify-center gap-2"><span class="bg-emerald-500/20 text-emerald-300 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">PROMO</span> <span>Get free VIP Interview preparation and resume optimization with our expert consultants. Contact Admin today!</span></div>'
  },
  {
    id: 'between_cards',
    label: 'Between Latest Job Cards',
    enabled: true,
    code: '<div class="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center"><span class="text-[9px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Sponsored Ad</span><p class="text-slate-700 dark:text-slate-300 font-medium text-sm">Need certified safety courses? Enroll in Saudi Safety Institute NEBOSH batch.</p><p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Special 15% discount code: JOBTODAY15</p></div>'
  },
  {
    id: 'homepage_middle',
    label: 'Homepage Middle Section',
    enabled: false,
    code: '<div class="w-full bg-slate-800 text-white p-6 text-center rounded-lg">Homepage Middle Ad Space</div>'
  },
  {
    id: 'homepage_bottom',
    label: 'Homepage Bottom Banner',
    enabled: false,
    code: '<div class="w-full bg-slate-800 text-white p-6 text-center rounded-lg">Homepage Bottom Ad Space</div>'
  },
  {
    id: 'jobs_listing',
    label: 'Jobs Listing Top Banner',
    enabled: false,
    code: '<div class="w-full bg-slate-800 text-white p-6 text-center rounded-lg">Jobs Listing Ad Space</div>'
  },
  {
    id: 'sidebar',
    label: 'Sidebar Banner (Job Detail & Listing)',
    enabled: true,
    code: '<div class="bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 text-center"><span class="text-[9px] text-slate-500 font-bold block mb-2 uppercase">ADVERTISING PARTNER</span><img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=280&h=150&fit=crop" class="w-full h-32 object-cover rounded-lg mb-3" /><p class="text-white text-xs font-semibold">Join the 2026 Riyadh Executive MBA Program</p><p class="text-[10px] text-slate-400 mt-1">Accredited by top European universities. Apply now.</p></div>'
  },
  {
    id: 'job_detail_top',
    label: 'Job Details Top Banner',
    enabled: false,
    code: '<div class="w-full bg-slate-800 text-white p-4 text-center rounded-lg">Job Detail Top Ad Space</div>'
  },
  {
    id: 'job_detail_middle',
    label: 'Job Details Middle Section',
    enabled: false,
    code: '<div class="w-full bg-slate-800 text-white p-4 text-center rounded-lg">Job Detail Middle Ad Space</div>'
  },
  {
    id: 'job_detail_bottom',
    label: 'Job Details Bottom Banner',
    enabled: false,
    code: '<div class="w-full bg-slate-800 text-white p-4 text-center rounded-lg">Job Detail Bottom Ad Space</div>'
  },
  {
    id: 'mobile_responsive',
    label: 'Mobile Responsive Sticky Ad',
    enabled: false,
    code: '<div class="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2 text-center text-xs text-white z-50">Mobile Footer Banner</div>'
  }
];

const DEFAULT_SETTINGS: AdminSettings = {
  whatsappNumber: '+966501234567',
  emailAddress: 'apply@jobtodayksa.com',
  phoneNumber: '+966114002000'
};

// Initialize Storage with sensible defaults
export function initStorage() {
  if (!localStorage.getItem(JOBS_KEY)) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(INITIAL_JOBS));
  }
  if (!localStorage.getItem(PROFILES_KEY)) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(AD_PLACEMENTS_KEY)) {
    localStorage.setItem(AD_PLACEMENTS_KEY, JSON.stringify(DEFAULT_ADS));
  }
  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }
}

// Job Operations
export function getJobs(): Job[] {
  initStorage();
  const data = localStorage.getItem(JOBS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveJobs(jobs: Job[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getJobById(id: string): Job | undefined {
  return getJobs().find(j => j.id === id);
}

export function getJobBySlug(slug: string): Job | undefined {
  return getJobs().find(j => j.slug === slug);
}

export function addOrUpdateJob(job: Job): void {
  const jobs = getJobs();
  const index = jobs.findIndex(j => j.id === job.id);
  if (index >= 0) {
    jobs[index] = job;
  } else {
    jobs.unshift(job); // Add new to top
  }
  saveJobs(jobs);
}

export function deleteJob(id: string): void {
  const jobs = getJobs();
  const filtered = jobs.filter(j => j.id !== id);
  saveJobs(filtered);
}

// User Profile Operations
export function getProfiles(): UserProfile[] {
  initStorage();
  const data = localStorage.getItem(PROFILES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveProfiles(profiles: UserProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function registerUserProfile(profile: UserProfile): void {
  const profiles = getProfiles();
  if (!profiles.some(p => p.email.toLowerCase() === profile.email.toLowerCase())) {
    profiles.push(profile);
    saveProfiles(profiles);
  }
}

export function updateProfile(profile: UserProfile): void {
  const profiles = getProfiles();
  const index = profiles.findIndex(p => p.uid === profile.uid);
  if (index >= 0) {
    profiles[index] = profile;
    saveProfiles(profiles);
  }
  // If editing current user, keep current user in sync
  const curr = getCurrentUser();
  if (curr && curr.uid === profile.uid) {
    saveCurrentUser(profile);
  }
}

export function getCurrentUser(): UserProfile | null {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveCurrentUser(profile: UserProfile | null) {
  if (profile) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// Admin Session
export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(ADMIN_LOGGED_IN_KEY) === 'true';
}

export function setAdminLoggedIn(loggedIn: boolean) {
  if (loggedIn) {
    localStorage.setItem(ADMIN_LOGGED_IN_KEY, 'true');
    // Log out regular user when admin logs in
    saveCurrentUser(null);
  } else {
    localStorage.removeItem(ADMIN_LOGGED_IN_KEY);
  }
}

// Ad Placements
export function getAdPlacements(): AdPlacement[] {
  initStorage();
  const data = localStorage.getItem(AD_PLACEMENTS_KEY);
  return data ? JSON.parse(data) : DEFAULT_ADS;
}

export function saveAdPlacements(ads: AdPlacement[]) {
  localStorage.setItem(AD_PLACEMENTS_KEY, JSON.stringify(ads));
}

export function getAdPlacement(id: AdPosition): AdPlacement | undefined {
  return getAdPlacements().find(ad => ad.id === id);
}

// Admin Settings
export function getAdminSettings(): AdminSettings {
  initStorage();
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
}

export function saveAdminSettings(settings: AdminSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

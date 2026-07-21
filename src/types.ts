export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  category: string;
  salary: string;
  experience: string;
  qualification: string;
  jobType: string;
  nationality: string;
  gender: string;
  vacancies: number;
  workingHours: string;
  benefits: string;
  visaStatus: string;
  accommodation: string;
  transportation: string;
  food: string;
  medical: string;
  overtime: string;
  description: string;
  responsibilities: string; // Stored as multiline text / list
  requirements: string; // Stored as multiline text / list
  skills: string; // Stored as comma-separated or list
  whatsappNumber: string;
  emailAddress: string;
  phoneNumber: string;
  deadline: string;
  featured: boolean;
  urgent: boolean;
  status: 'Active' | 'Expired' | 'Draft';
  createdAt: string;
  slug: string;
}

export interface UserCV {
  id: string;
  name: string;
  url: string; // Data URL or storage link
  uploadedAt: string;
}

export interface UserEducation {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

export interface UserExperience {
  id: string;
  company: string;
  role: string;
  description: string;
  startYear: string;
  endYear: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  location?: string;
  experienceLevel?: string;
  skills: string[];
  certifications: string[];
  languages: string[];
  cvs: UserCV[];
  education: UserEducation[];
  experience: UserExperience[];
  savedJobs: string[]; // Job IDs
  appliedJobs: {
    jobId: string;
    appliedAt: string;
    cvId: string;
    optionUsed: 'WhatsApp' | 'Email' | 'Call' | 'Portal';
  }[];
  alerts: {
    id: string;
    keyword: string;
    location: string;
    category: string;
    createdAt: string;
  }[];
}

export type AdPosition =
  | 'homepage_top'
  | 'below_search'
  | 'between_cards'
  | 'homepage_middle'
  | 'homepage_bottom'
  | 'jobs_listing'
  | 'sidebar'
  | 'job_detail_top'
  | 'job_detail_middle'
  | 'job_detail_bottom'
  | 'mobile_responsive';

export interface AdPlacement {
  id: AdPosition;
  label: string;
  enabled: boolean;
  code: string;
}

export interface AdminSettings {
  whatsappNumber: string;
  emailAddress: string;
  phoneNumber: string;
}

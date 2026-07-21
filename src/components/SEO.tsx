import { useEffect } from 'react';
import { Job } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  job?: Job;
}

export default function SEO({ 
  title = 'Saudi Arabia Job Search Portal', 
  description = 'Help people in Saudi Arabia quickly search, discover, and apply for jobs with the least possible effort.', 
  canonicalUrl, 
  job 
}: SEOProps) {
  useEffect(() => {
    // Update Document Title
    document.title = `${title} | JOB TODAY KSA`;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // Inject JSON-LD Schema
    const existingScript = document.getElementById('seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'JOB TODAY KSA',
        'url': window.location.origin,
        'logo': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
        'sameAs': [
          'https://twitter.com/jobtodayksa',
          'https://linkedin.com/company/jobtodayksa'
        ]
      }
    ];

    if (job) {
      const jobPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        'title': job.title,
        'description': `${job.description}\n\nRequirements:\n${job.requirements}\n\nResponsibilities:\n${job.responsibilities}`,
        'datePosted': job.createdAt,
        'validThrough': job.deadline,
        'employmentType': job.jobType === 'Full-time' ? 'FULL_TIME' : job.jobType === 'Part-time' ? 'PART_TIME' : 'CONTRACTOR',
        'hiringOrganization': {
          '@type': 'Organization',
          'name': job.companyName,
          'sameAs': ''
        },
        'jobLocation': {
          '@type': 'Place',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': job.location,
            'addressCountry': 'SA'
          }
        },
        'baseSalary': job.salary !== 'Negotiable' ? {
          '@type': 'MonetaryAmount',
          'currency': 'SAR',
          'value': {
            '@type': 'QuantitativeValue',
            'value': job.salary,
            'unitText': 'MONTH'
          }
        } : undefined
      };
      schemas.push(jobPostingSchema);
    }

    const script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemas);
    document.head.appendChild(script);

    return () => {
      const cleanupScript = document.getElementById('seo-jsonld');
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };
  }, [title, description, job]);

  return null;
}

import { Briefcase, Mail, Phone, MapPin, ExternalLink, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Search Jobs', view: 'jobs' },
    { label: 'Featured Jobs', view: 'jobs', params: { featuredOnly: true } },
    { label: 'Urgent Vacancies', view: 'jobs', params: { urgentOnly: true } },
    { label: 'My Profile', view: 'profile' },
  ];

  const popularCities = [
    { name: 'Riyadh', count: '1,200+ Jobs' },
    { name: 'Jeddah', count: '850+ Jobs' },
    { name: 'Dammam', count: '640+ Jobs' },
    { name: 'Jubail', count: '480+ Jobs' },
    { name: 'NEOM', count: '310+ Jobs' },
  ];

  const categories = [
    { name: 'Engineering', count: '420+ Active' },
    { name: 'QC / Inspectors', count: '350+ Active' },
    { name: 'Construction', count: '510+ Active' },
    { name: 'IT & Software', count: '290+ Active' },
    { name: 'Administration', count: '180+ Active' },
  ];

  const handleCityClick = (city: string) => {
    onNavigate('jobs', { location: city });
  };

  const handleCategoryClick = (category: string) => {
    onNavigate('jobs', { category: category });
  };

  return (
    <footer id="app-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Logo & Platform Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="bg-emerald-600 text-white p-1.5 rounded-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight uppercase">
                Job Today <span className="text-emerald-500">KSA</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The premier job search engine for candidates across the Kingdom of Saudi Arabia. We aggregate, categorize, and deliver high-intent career options straight to your fingertip.
            </p>
            <div className="pt-2 flex space-x-4">
              <span className="bg-slate-800/80 text-emerald-400 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-700/50">
                🇸🇦 100% SAUDI JOBS
              </span>
              <span className="bg-slate-800/80 text-amber-400 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-700/50">
                ⚡ INSTANT APPLY
              </span>
            </div>
          </div>

          {/* Quick Nav & Site Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Sitemap Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.view, link.params)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left w-full flex items-center gap-1 group"
                  >
                    <span className="h-1.5 w-1.5 bg-slate-700 group-hover:bg-emerald-400 rounded-full transition-colors" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Cities in Saudi Arabia */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Saudi Cities
            </h4>
            <ul className="space-y-2 text-sm">
              {popularCities.map((city) => (
                <li key={city.name} className="flex justify-between items-center text-slate-400">
                  <button
                    onClick={() => handleCityClick(city.name)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {city.name}
                  </button>
                  <span className="text-xs text-slate-600 dark:text-slate-500 font-mono">{city.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Popular Sectors
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.name} className="flex justify-between items-center text-slate-400">
                  <button
                    onClick={() => handleCategoryClick(cat.name === 'QC / Inspectors' ? 'QC Welding Inspector' : cat.name === 'IT & Software' ? 'IT' : cat.name)}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                  <span className="text-xs text-slate-600 dark:text-slate-500 font-mono">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Disclaimer / Advertising Disclosures & Footer Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 leading-relaxed">
              © {currentYear} JOB TODAY KSA. All rights reserved. Registered under Saudi HR guidelines.<br />
              All logo assets and corporate materials are trademarks of their respective entities. We are an independent career connector.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-500">
            <a href="#app-header" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#app-header" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <span>•</span>
            <span className="text-slate-600">Google AdSense Ready</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 bg-emerald-950/45 px-2.5 py-1 rounded-md border border-emerald-800/40 hover:border-emerald-600/50 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

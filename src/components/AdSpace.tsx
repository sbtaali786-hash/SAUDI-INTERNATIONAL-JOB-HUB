import { getAdPlacement } from '../lib/storage';
import { AdPosition } from '../types';

interface AdSpaceProps {
  position: AdPosition;
  className?: string;
}

export default function AdSpace({ position, className = '' }: AdSpaceProps) {
  const ad = getAdPlacement(position);

  if (!ad || !ad.enabled || !ad.code.trim()) {
    return null;
  }

  // Robust parsing to execute any potential <script> tags within the ad codes
  const handleScriptInjection = (el: HTMLDivElement | null) => {
    if (!el) return;
    
    // Clear previous elements
    el.innerHTML = ad.code;
    
    // Extract and execute scripts
    const scripts = Array.from(el.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.async = false;
      if (oldScript.innerHTML) {
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      }
      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    });
  };

  return (
    <div 
      id={`ad-placement-${position}`}
      ref={handleScriptInjection}
      className={`w-full overflow-hidden my-6 flex justify-center items-center ${className}`}
    />
  );
}

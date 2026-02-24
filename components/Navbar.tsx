import React from 'react';

const Navbar: React.FC = () => {
  const links = ['Products', 'Solutions', 'Explore', 'Support', 'Company'];

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
      {/* Logo Area */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
             {/* Abstract Logo mark */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
             </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-gray-900 text-lg tracking-tight">Binary</span>
          <span className="font-semibold text-gray-600 text-sm -mt-1">Semantics<sup className="text-[0.6em]">®</sup></span>
        </div>
      </div>

      {/* Center Links - Hidden on mobile, visible on lg */}
      <div className="hidden lg:flex items-center gap-8">
        {links.map((link) => (
          <a 
            key={link} 
            href={`#${link.toLowerCase()}`}
            className="text-gray-700 font-medium hover:text-purple-700 transition-colors text-sm xl:text-base"
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA Button */}
      <div>
        <a 
          href="https://binarysemantics.com/contact-us"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#B91C83] hover:bg-[#9d156e] text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-purple-200 transform hover:-translate-y-0.5"
        >
          Contact Us ›
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
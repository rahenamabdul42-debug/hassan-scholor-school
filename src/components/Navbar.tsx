import React, { useState } from 'react';
import { Menu, X, Phone, GraduationCap, Calendar, Sparkles } from 'lucide-react';
import { SCHOOL_DETAILS } from '../data/schoolData';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'news', label: 'News & Events' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      {/* Top Notification Strip */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[11px] tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" /> Admissions Open 2026–2027
            </span>
            <span className="hidden md:inline text-blue-200">|</span>
            <span className="text-slate-200 hidden sm:inline">Playgroup to Matriculation (Science & Computer Science)</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-blue-200">
            <span className="hidden lg:inline text-slate-300">Zafarwal, Punjab, Pakistan</span>
            <a
              href={`tel:${SCHOOL_DETAILS.phonePrimary.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{SCHOOL_DETAILS.phonePrimary}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          {/* School Crest / Monogram */}
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center text-amber-400 shadow-md border border-amber-400/30 group-hover:border-amber-400/60 transition-colors shrink-0">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[9px] font-bold text-blue-950">★</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-crest text-lg sm:text-xl font-bold tracking-tight text-blue-950 leading-tight">
              Hassan Scholars
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <span className="text-amber-700 font-semibold tracking-wide uppercase">Public School</span>
              <span>·</span>
              <span className="text-slate-600">Zafarwal</span>
            </div>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-700">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-1 cursor-pointer transition-colors whitespace-nowrap text-[13.5px] font-medium ${
                  isActive
                    ? 'text-blue-900 font-semibold'
                    : 'text-slate-600 hover:text-blue-950'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleLinkClick('admissions')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-lg shadow-sm hover:shadow-md hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Apply For Admission</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-blue-950 hover:bg-slate-100 rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  activeSection === link.id
                    ? 'bg-blue-50 text-blue-900 font-semibold border-l-2 border-amber-500'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('admissions')}
              className="w-full text-center py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-blue-950 bg-amber-400 hover:bg-amber-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Online Admission Form
            </button>
            <a
              href={`https://wa.me/923007548921?text=${encodeURIComponent('Assalam-o-Alaikum, I am inquiring regarding admission at Hassan Scholars Public School Zafarwal.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-2 px-4 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              Direct WhatsApp Desk: +92 300 7548921
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

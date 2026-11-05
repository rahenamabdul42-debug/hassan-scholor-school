import React from 'react';
import { 
  GraduationCap, Phone, Mail, MapPin, Clock, 
  Heart, ArrowUp, ShieldCheck, Award, MessageCircle 
} from 'lucide-react';
import { SCHOOL_DETAILS } from '../data/schoolData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenFeeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenFeeModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-blue-950 text-slate-300 border-t-2 border-amber-500/60 relative">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-blue-950 flex items-center justify-center font-crest font-bold text-xl shadow-md border border-white/20 shrink-0">
                <GraduationCap className="w-6 h-6 text-blue-950" />
              </div>
              <div>
                <span className="font-crest text-lg font-bold text-white tracking-wide block">
                  {SCHOOL_DETAILS.name}
                </span>
                <span className="text-xs text-amber-300 font-medium">
                  {SCHOOL_DETAILS.urduName}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              &ldquo;{SCHOOL_DETAILS.tagline}&rdquo; — An established center of academic distinctions, moral Tarbiyah, and modern scientific inquiry in Zafarwal, Punjab, Pakistan since {SCHOOL_DETAILS.establishedYear}.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{SCHOOL_DETAILS.affiliation}</span>
              </p>
              <p className="text-[11px] text-slate-400 pl-5">
                School Registration & Examination Code: HSPS-BISE-GRW
              </p>
            </div>
          </div>

          {/* Quick Nav Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-crest">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  About Our School & Leadership
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Academic Programs (Playgroup to Grade 10)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admissions')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-amber-300 font-semibold"
                >
                  Online Admission Application Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('facilities')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Campus Facilities & RO Water Plant
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Photo Gallery & Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faculty')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Qualified Faculty Directory
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFeeModal}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-amber-300"
                >
                  Fee Calculator & Prospectus
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-crest">
              Zafarwal Campus Desk
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{SCHOOL_DETAILS.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{SCHOOL_DETAILS.phonePrimary}</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">WhatsApp: {SCHOOL_DETAILS.phoneWhatsApp}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{SCHOOL_DETAILS.email}</span>
              </p>
              <p className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{SCHOOL_DETAILS.hours.regular}</span>
              </p>
            </div>
          </div>

          {/* Direct Actions (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 font-crest">
              Admissions
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Registration forms for Session 2026–2027 are available both online and at campus gate.
            </p>
            <button
              onClick={() => onNavigate('admissions')}
              className="w-full py-2.5 px-3 text-center text-xs font-bold uppercase tracking-wider text-blue-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Apply Online
            </button>
            <button
              onClick={scrollToTop}
              className="w-full py-2 px-3 text-center text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-blue-900/80 bg-blue-950/95 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Hassan Scholars Public School, Zafarwal. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Zafarwal, Punjab, Pakistan</span>
            <span>·</span>
            <span>Regulated under Punjab School Education Dept</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

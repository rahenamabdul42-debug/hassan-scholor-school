import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Award, BookOpen, Compass } from 'lucide-react';
import { SCHOOL_DETAILS } from '../data/schoolData';

interface HeroProps {
  onApplyClick: () => void;
  onExploreClick: () => void;
  onOpenFeeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onApplyClick, onExploreClick, onOpenFeeModal }) => {
  return (
    <section className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white overflow-hidden">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Hero Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Admission Open Announcement Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-medium shadow-inner backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              <span>Admissions Open for Session 2026–2027</span>
              <span className="hidden sm:inline text-amber-200/60">|</span>
              <span className="hidden sm:inline text-amber-200 font-normal">Playgroup to Matriculation</span>
            </div>

            {/* School Welcome & Main Headline */}
            <div className="space-y-3">
              <p className="text-amber-400 font-crest uppercase tracking-widest text-xs sm:text-sm font-semibold">
                Welcome to Hassan Scholars Public School · Zafarwal
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold font-serif-school tracking-tight leading-[1.15] text-white">
                Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">Bright Futures</span> Through Quality Education
              </h1>
            </div>

            {/* Short Introduction */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Located in the heart of Zafarwal, Hassan Scholars Public School is committed to academic brilliance, moral tarbiyah, and modern scientific discovery. We empower your child to excel in board examinations and emerge as confident, compassionate leaders of tomorrow.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 pb-2 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>BISE Registered Campus</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Qualified & Caring Faculty</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Modern Science & IT Labs</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onApplyClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-blue-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Apply For Admission</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl transition-all cursor-pointer backdrop-blur-xs"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Explore Our School</span>
              </button>

              <button
                onClick={onOpenFeeModal}
                className="inline-flex items-center gap-1.5 px-4 py-3.5 text-xs sm:text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors cursor-pointer underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300"
              >
                <BookOpen className="w-4 h-4" />
                <span>Fee Structure & Prospectus</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero High-Res Student & Campus Image with Polish */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative golden border frame */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-amber-500/30 via-blue-500/20 to-amber-300/30 blur-sm" />
              
              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/30 shadow-2xl bg-blue-900/50">
                <img
                  src="/src/assets/images/hero_school_students_1793852515659.jpg"
                  alt="Hassan Scholars Public School Students on campus in Zafarwal, Pakistan"
                  className="w-full h-[360px] sm:h-[420px] object-cover object-top hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Overlay gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent" />

                {/* Floating Institutional Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-blue-950/85 backdrop-blur-md border border-amber-400/30 text-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center shrink-0 font-bold">
                      <Award className="w-6 h-6 text-blue-950" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                        Excellence in Education
                      </p>
                      <p className="text-sm font-medium text-slate-100">
                        Nurturing Confident Scholars in Zafarwal Since 2012
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Chip (Top Right) */}
              <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 bg-white text-blue-950 py-2 px-3.5 rounded-xl shadow-xl border border-amber-300 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Matric Result Track</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Institutional Statistics Strip */}
      <div className="relative border-t border-blue-900/80 bg-blue-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {SCHOOL_DETAILS.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-school text-amber-400 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-400">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

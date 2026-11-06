import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, Check, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { ACADEMIC_PROGRAMS, AcademicProgram } from '../data/schoolData';
import { SchoolImage } from './SchoolImage';

interface ProgramsSectionProps {
  onSelectProgramForAdmission: (programName: string) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ onSelectProgramForAdmission }) => {
  const [selectedId, setSelectedId] = useState<string>('secondary');

  const activeProgram = ACADEMIC_PROGRAMS.find((p) => p.id === selectedId) || ACADEMIC_PROGRAMS[0];

  return (
    <section id="academics" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 font-crest">
            Academic Excellence
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-school text-blue-950 tracking-tight">
            Comprehensive Programs from Playgroup to Matriculation
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed pt-2">
            Structured pedagogical pathways tailored to every developmental milestone, blending foundational curiosity with BISE board examination mastery.
          </p>
        </div>

        {/* Program Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 p-1.5 bg-slate-100 rounded-xl max-w-4xl mx-auto">
          {ACADEMIC_PROGRAMS.map((prog) => {
            const isActive = prog.id === selectedId;
            return (
              <button
                key={prog.id}
                onClick={() => setSelectedId(prog.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-950 text-amber-400 shadow-sm'
                    : 'text-slate-600 hover:text-blue-950 hover:bg-slate-200/60'
                }`}
              >
                {prog.name}
              </button>
            );
          })}
        </div>

        {/* Active Program Detailed Showcase */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>{activeProgram.category} Division</span>
                  <span>·</span>
                  <span>Age: {activeProgram.ageGroup}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-school text-blue-950">
                  {activeProgram.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1 italic">
                  &ldquo;{activeProgram.tagline}&rdquo;
                </p>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {activeProgram.description}
              </p>

              {/* Key Subjects */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Key Curricular Focus & Subjects</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProgram.keySubjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-xs font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Program Features */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Program Distinctions</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeProgram.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectProgramForAdmission(activeProgram.name)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span>Apply For {activeProgram.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-500">
                  Assessments ongoing at Zafarwal campus
                </span>
              </div>
            </div>

            {/* Right Column: Operational Info Card */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-xl border border-slate-200 space-y-5">
              <h4 className="text-base font-bold font-serif-school text-blue-950 border-b border-slate-100 pb-3">
                Class Snapshot & Enrollment
              </h4>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Eligible Age Bracket</p>
                    <p className="font-semibold text-slate-800">{activeProgram.ageGroup}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activeProgram.eligibility}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Daily School Timing</p>
                    <p className="font-semibold text-slate-800">{activeProgram.timing}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Prompt attendance required</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Monthly Tuition Fee (Estimate)</p>
                    <p className="font-bold text-blue-950 text-base">{activeProgram.monthlyFeeEst}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Need-based scholarships & sibling discounts available</p>
                  </div>
                </div>
              </div>

              {/* Classroom Photo Thumbnail */}
              <div className="rounded-lg overflow-hidden border border-slate-100 mt-4 relative">
                <SchoolImage
                  src="/images/classroom.jpg"
                  alt="Students in classroom"
                  className="w-full h-40 object-cover"
                  fallbackTitle="Interactive Smart Classrooms"
                  fallbackCategory="Academic Campus"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-blue-950/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded">
                  Active interactive smart classroom at Zafarwal campus
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* All Grade Cards Overview */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACADEMIC_PROGRAMS.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                p.id === selectedId
                  ? 'bg-blue-50/70 border-amber-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                  {p.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {p.ageGroup}
                </span>
              </div>
              <h4 className="text-base font-bold text-blue-950 mt-1">
                {p.name}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                {p.tagline}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{p.monthlyFeeEst}/mo</span>
                <span className="font-semibold text-blue-900 flex items-center gap-1">
                  View Details &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

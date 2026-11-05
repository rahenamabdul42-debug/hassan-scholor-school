import React, { useState } from 'react';
import { GraduationCap, Award, BookOpen, Quote, Sparkles } from 'lucide-react';
import { TEACHERS_LIST, TeacherProfile } from '../data/schoolData';

export const FacultySection: React.FC = () => {
  const [filterSubject, setFilterSubject] = useState<string>('All');

  const subjectOptions = ['All', 'Mathematics', 'Biology & Chemistry', 'Physics', 'English', 'Computer Science', 'Early Childhood'];

  const filteredTeachers = filterSubject === 'All'
    ? TEACHERS_LIST
    : TEACHERS_LIST.filter((t) => t.subject.toLowerCase().includes(filterSubject.toLowerCase()) || (filterSubject === 'Early Childhood' && t.designation.includes('Early Childhood')));

  return (
    <section id="faculty" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 font-crest">
            Distinguished Faculty
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-school text-blue-950 tracking-tight">
            Mentors Dedicated to Every Scholar's Potential
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed pt-2">
            Our educators combine advanced academic credentials with genuine compassion, guiding children toward conceptual mastery and personal integrity.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {subjectOptions.map((subj) => {
            const isActive = filterSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setFilterSubject(subj)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-950 text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-blue-950 hover:bg-slate-200'
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Profile with Monogram & Badge */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${teacher.avatarColor} text-amber-300 font-crest font-bold text-lg flex items-center justify-center shadow-md border border-amber-400/30 shrink-0`}>
                    {teacher.name.split(' ').slice(-2).map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-serif-school text-blue-950">
                      {teacher.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-700">
                      {teacher.designation}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <BookOpen className="w-3 h-3" />
                      <span>{teacher.subject}</span>
                    </p>
                  </div>
                </div>

                {/* Qualification & Experience */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-700">
                    <GraduationCap className="w-4 h-4 text-blue-900 shrink-0" />
                    <span className="font-medium truncate">{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{teacher.experience}</span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs text-slate-600 italic leading-relaxed border-l-2 border-amber-400 pl-3 py-1">
                  &ldquo;{teacher.quote}&rdquo;
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Hassan Scholars Faculty</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Available for PTM
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Join Faculty Callout */}
        <div className="mt-14 text-center p-6 rounded-2xl bg-slate-100 border border-slate-200 max-w-2xl mx-auto">
          <h4 className="text-sm font-bold text-blue-950">
            Are You a Dedicated Educator in District Narowal / Zafarwal?
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            We continually invite visionary subject teachers and Montessori specialists to join our faculty family. Send your CV to <a href="mailto:careers@hassanscholars.edu.pk" className="text-blue-900 font-semibold underline">careers@hassanscholars.edu.pk</a>.
          </p>
        </div>

      </div>
    </section>
  );
};

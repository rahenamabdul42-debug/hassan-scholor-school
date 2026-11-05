import React from 'react';
import { Target, Compass, Award, Heart, CheckCircle2, Quote, BookOpen, Users, Shield } from 'lucide-react';
import { SCHOOL_DETAILS } from '../data/schoolData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 font-crest">
            About Our Institution
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-school text-blue-950 tracking-tight">
            Cultivating Intellect, Character & Leadership in Zafarwal
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed pt-2">
            Hassan Scholars Public School was founded with a singular conviction: every child in Zafarwal deserves access to world-class education that stimulates the mind while grounding the soul in moral integrity.
          </p>
        </div>

        {/* Narrative & Principal Message Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          
          {/* Main Story & Philosophy */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold font-serif-school text-blue-950">
                A Legacy of Scholastic & Ethical Commitment
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Established in {SCHOOL_DETAILS.establishedYear}, Hassan Scholars Public School has grown to become one of the premier educational institutions in District Narowal. We bridge traditional Pakistani cultural and ethical values with progressive STEM curriculum, interactive pedagogical tools, and child-centered care.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Our educational philosophy rejects passive rote memorization. We believe education should inspire active questioning, creative expression, empirical experimentation, and empathy for community well-being.
              </p>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <BookOpen className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">Academic Rigor</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Syllabus mastery aligned with BISE Board distinctions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Heart className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">Character & Tarbiyah</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Islamic ethics, truthfulness, and social responsibility.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Users className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">Individual Attention</h4>
                    <p className="text-xs text-slate-500 mt-0.5">15:1 student-to-teacher ratio ensuring no child is left behind.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Shield className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">Safe & Secure Campus</h4>
                    <p className="text-xs text-slate-500 mt-0.5">CCTV monitored, disciplined, clean drinking water facility.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>Affiliated with BISE Gujranwala</span>
              <span className="font-semibold text-blue-950">Registration No: HSPS-ZFW-2012</span>
            </div>
          </div>

          {/* Principal's Note Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-8 sm:p-10 rounded-2xl border border-amber-400/20 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-crest tracking-wider uppercase">
                <Quote className="w-4 h-4 text-amber-400" />
                <span>Message From The Principal</span>
              </div>

              <blockquote className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
                &ldquo;Welcome to Hassan Scholars Public School. When you entrust your child to our care, you entrust them to educators who regard teaching not merely as a profession, but as a sacred trust. Our aim is to build resilient minds, honest hearts, and ambitious visionaries who will serve their families, community, and Pakistan with honor.&rdquo;
              </blockquote>
            </div>

            <div className="pt-6 border-t border-blue-800/80 mt-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-blue-950 flex items-center justify-center font-serif font-bold text-lg border-2 border-white shadow-sm shrink-0">
                NH
              </div>
              <div>
                <p className="text-sm font-bold text-white font-serif-school">
                  Sir Muhammad Naveed Hassan
                </p>
                <p className="text-xs text-amber-300">
                  Principal & Founder, M.Sc. Math, M.Ed.
                </p>
                <p className="text-[11px] text-blue-200">
                  Hassan Scholars Public School, Zafarwal
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Vision, Mission & Why Choose Our School */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Vision */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6 text-blue-900" />
            </div>
            <h3 className="text-lg font-bold font-serif-school text-blue-950 mb-2">
              Our Vision
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be recognized as a benchmark institution of holistic learning in Punjab, graduating youth who stand at the forefront of science, humanities, ethical leadership, and global readiness.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-lg font-bold font-serif-school text-blue-950 mb-2">
              Our Mission
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To deliver accessible, world-standard education through qualified educators, modern technology, active co-curriculars, and character development in a safe, inspiring environment.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
              <Award className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold font-serif-school text-blue-950 mb-2">
              Why Choose Our School?
            </h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Matriculation board pass record</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Modern interactive smart board teaching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated science labs & computer studio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Moral Tarbiyah & daily Quranic Nazra</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

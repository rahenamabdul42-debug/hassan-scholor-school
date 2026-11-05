import React, { useState } from 'react';
import { 
  School, GraduationCap, Laptop, FlaskConical, BookOpen, 
  Trophy, ShieldCheck, HeartHandshake, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { SCHOOL_FACILITIES, Facility } from '../data/schoolData';

const getFacilityIcon = (iconName: string) => {
  switch (iconName) {
    case 'School': return <School className="w-5 h-5" />;
    case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
    case 'Laptop': return <Laptop className="w-5 h-5" />;
    case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5" />;
    case 'Trophy': return <Trophy className="w-5 h-5" />;
    case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
    case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
    default: return <School className="w-5 h-5" />;
  }
};

export const FacilitiesSection: React.FC = () => {
  const [activeFacility, setActiveFacility] = useState<Facility>(SCHOOL_FACILITIES[0]);

  return (
    <section id="facilities" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 font-crest">
            World-Class Campus
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-school text-blue-950 tracking-tight">
            Facilities Engineered for Discovery & Well-Being
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed pt-2">
            Every square foot of our Zafarwal campus is purposefully designed to foster curiosity, intellectual vitality, physical health, and moral uprightness.
          </p>
        </div>

        {/* 8 Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCHOOL_FACILITIES.map((fac) => (
            <div
              key={fac.id}
              onClick={() => setActiveFacility(fac)}
              className="group bg-slate-50 border border-slate-200/90 rounded-2xl overflow-hidden hover:border-amber-400 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image Container with Fallback and Aspect Ratio */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
                
                {/* Category Tag */}
                <div className="absolute top-3 left-3 bg-blue-950/80 backdrop-blur-xs text-amber-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-amber-400/30">
                  {fac.category}
                </div>

                {/* Icon in Bottom-Right */}
                <div className="absolute bottom-3 right-3 w-9 h-9 rounded-lg bg-white text-blue-950 flex items-center justify-center shadow-md">
                  {getFacilityIcon(fac.iconName)}
                </div>
              </div>

              {/* Text Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold font-serif-school text-blue-950 group-hover:text-amber-800 transition-colors">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                    {fac.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-2 border-t border-slate-200/70 space-y-1">
                  {fac.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Spotlight Callout Box: Campus Safety & Health Guarantee */}
        <div className="mt-14 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-amber-400/30 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Our Uncompromising Safety Commitment in Zafarwal</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-school text-white">
                Clean Mineral RO Water, 24/7 Monitored Campus & Medical First-Aid
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Parents entrust us with what is most precious to them. We operate an on-site multi-stage Reverse Osmosis (RO) water purification plant, monitored boundary security guards, backup power generation during load shedding, and dedicated sanitization teams.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xs text-xs">
                <span className="font-bold text-amber-300 block">RO Water Plant:</span>
                <span className="text-slate-200">Certified chemical & biological purity test passed monthly.</span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xs text-xs">
                <span className="font-bold text-amber-300 block">High Definition CCTV:</span>
                <span className="text-slate-200">Corridors, entry checkpoints, and play grounds monitored 24/7.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

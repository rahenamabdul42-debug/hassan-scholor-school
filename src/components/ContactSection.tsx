import React from 'react';
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  ExternalLink, ShieldCheck, CheckCircle2, Car, Compass 
} from 'lucide-react';
import { SCHOOL_DETAILS } from '../data/schoolData';

export const ContactSection: React.FC = () => {
  const whatsappUrl = `https://wa.me/923007548921?text=${encodeURIComponent(
    'Assalam-o-Alaikum, I am inquiring regarding Hassan Scholars Public School Zafarwal.'
  )}`;

  return (
    <section id="contact" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 font-crest">
            Get In Touch
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-school text-blue-950 tracking-tight">
            Visit Our Campus or Contact Admissions Desk
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed pt-2">
            Located on Main Circular Road in Zafarwal, Punjab. Our administrative officers and admissions staff are available daily to welcome parents and prospective scholars.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: School Information & Timings */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs flex-1">
              <div>
                <h3 className="font-crest text-xl font-bold text-blue-950">
                  {SCHOOL_DETAILS.name}
                </h3>
                <p className="text-xs text-amber-800 font-medium mt-0.5">
                  {SCHOOL_DETAILS.urduName}
                </p>
              </div>

              {/* Contact Details List */}
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-950 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Campus Location</p>
                    <p className="font-semibold text-slate-900 leading-snug">
                      {SCHOOL_DETAILS.fullAddress}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Zafarwal, District Narowal, Punjab, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-amber-800" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Phone Numbers (Landline & Mobile)</p>
                    <p className="font-semibold text-slate-900 font-mono">
                      {SCHOOL_DETAILS.phonePrimary}
                    </p>
                    <p className="font-medium text-slate-700 font-mono text-xs">
                      Mobile: {SCHOOL_DETAILS.phoneMobile}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-900 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Official Email</p>
                    <p className="font-semibold text-slate-900 font-mono text-xs sm:text-sm">
                      {SCHOOL_DETAILS.email}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {SCHOOL_DETAILS.admissionsEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100/70 text-indigo-900 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-indigo-800" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">School & Office Opening Hours</p>
                    <p className="font-semibold text-slate-900 text-xs">
                      {SCHOOL_DETAILS.hours.regular}
                    </p>
                    <p className="text-xs text-slate-700 mt-0.5">
                      {SCHOOL_DETAILS.hours.friday}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {SCHOOL_DETAILS.hours.saturdayOffice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Transport & Van Service info */}
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
              <Car className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-950 text-sm">Transport & Van Network Across Zafarwal</p>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                  Dedicated school vans provide monitored pick-and-drop services covering Zafarwal city, Pasrur road, Degree College chowk, and neighboring rural centers.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Google Maps & Visiting Information */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            
            {/* Campus Visiting Highlights */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-xl font-bold font-serif-school text-blue-950">
                Visitor & Parent Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Parents wishing to tour classrooms, observe science lab facilities, or discuss student placement may visit during administrative hours (08:30 AM to 01:00 PM).
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Principal consultation appointments available Mon – Thu</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Entrance assessments conducted on-campus every working morning</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct phone line open during school hours: {SCHOOL_DETAILS.phonePrimary}</span>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps Location of Zafarwal, Punjab, Pakistan */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs flex-1 flex flex-col">
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                    Campus Location: Zafarwal, Punjab, Pakistan
                  </span>
                </div>
                <a
                  href="https://www.google.com/maps/search/Zafarwal+Punjab+Pakistan"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Iframe */}
              <div className="relative h-64 sm:h-72 w-full bg-slate-200 flex-1">
                <iframe
                  title="Hassan Scholars Public School Zafarwal Location"
                  src="https://maps.google.com/maps?q=Zafarwal%20Punjab%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

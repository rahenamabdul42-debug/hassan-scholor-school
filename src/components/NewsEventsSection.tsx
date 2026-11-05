import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SCHOOL_EVENTS, SchoolEvent } from '../data/schoolData';

export const NewsEventsSection: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Admission', 'Event', 'Examination', 'Meeting'];

  const filteredEvents = filterCategory === 'All'
    ? SCHOOL_EVENTS
    : SCHOOL_EVENTS.filter((e) => e.category === filterCategory);

  return (
    <section id="news" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 font-crest">
            School Bulletin
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-school text-blue-950 tracking-tight">
            News, Circulars & Upcoming Events
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed pt-2">
            Stay informed with the latest academic notifications, board examination dates, sports fixtures, and parent consultations at our Zafarwal campus.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-950 text-amber-400 shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-blue-950'
                }`}
              >
                {cat === 'All' ? 'All Updates' : cat}
              </button>
            );
          })}
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Meta info header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 uppercase tracking-wider text-[10px]">
                    {event.category}
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      event.status === 'Ongoing'
                        ? 'text-emerald-700'
                        : event.status === 'Upcoming'
                        ? 'text-blue-900'
                        : 'text-slate-400'
                    }`}
                  >
                    ● {event.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold font-serif-school text-blue-950 leading-snug">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {event.description}
                </p>

                {/* Details (Date, Time, Venue) */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">Notice ID: {event.id.toUpperCase()}</span>
                <span className="text-blue-900 font-semibold flex items-center gap-1">
                  School Circular
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Board SMS & WhatsApp Reminder Banner */}
        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-950">
                Instant SMS & WhatsApp Notification Service for Parents
              </p>
              <p className="text-xs text-slate-500">
                Registered parents receive automatic timetable changes, weather announcements, and fee reminders directly on mobile.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/923007548921?text=Please%20add%20my%20number%20to%20Hassan%20Scholars%20School%20Broadcast%20List"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 whitespace-nowrap"
          >
            Join School Broadcast
          </a>
        </div>

      </div>
    </section>
  );
};

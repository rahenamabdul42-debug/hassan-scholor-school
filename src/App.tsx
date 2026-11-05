import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProgramsSection } from './components/ProgramsSection';
import { AdmissionSection } from './components/AdmissionSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { GallerySection } from './components/GallerySection';
import { FacultySection } from './components/FacultySection';
import { NewsEventsSection } from './components/NewsEventsSection';
import { ContactSection } from './components/ContactSection';
import { FeeCalculatorModal } from './components/FeeCalculatorModal';
import { Footer } from './components/Footer';
import { SCHOOL_DETAILS } from './data/schoolData';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [preselectedGrade, setPreselectedGrade] = useState<string>('');
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for active section & scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sections = ['hero', 'about', 'academics', 'admissions', 'facilities', 'gallery', 'faculty', 'news', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyClick = () => {
    handleNavigate('admissions');
  };

  const handleExploreClick = () => {
    handleNavigate('about');
  };

  const handleSelectProgramForAdmission = (gradeName: string) => {
    setPreselectedGrade(gradeName);
    handleNavigate('admissions');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-blue-950">
      
      {/* Top Navbar */}
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 1: Hero */}
        <div id="hero">
          <Hero
            onApplyClick={handleApplyClick}
            onExploreClick={handleExploreClick}
            onOpenFeeModal={() => setIsFeeModalOpen(true)}
          />
        </div>

        {/* Section 2: About Us */}
        <AboutSection />

        {/* Section 3: Academic Programs */}
        <ProgramsSection onSelectProgramForAdmission={handleSelectProgramForAdmission} />

        {/* Section 4: Online Admission System */}
        <AdmissionSection preselectedClass={preselectedGrade} />

        {/* Section 5: Facilities */}
        <FacilitiesSection />

        {/* Section 6: Photo Gallery */}
        <GallerySection />

        {/* Section 7: Faculty / Teachers */}
        <FacultySection />

        {/* Section 8: News and Events */}
        <NewsEventsSection />

        {/* Section 9: Contact Us */}
        <ContactSection />
      </main>

      {/* Institutional Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenFeeModal={() => setIsFeeModalOpen(true)}
      />

      {/* Fee Structure / Prospectus Modal */}
      <FeeCalculatorModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        onProceedToAdmission={handleSelectProgramForAdmission}
      />

      {/* Floating Action: Direct WhatsApp Admissions Desk & Scroll to Top */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-blue-950 text-white shadow-lg hover:bg-blue-900 flex items-center justify-center transition-all cursor-pointer border border-white/20"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <a
          href={`https://wa.me/923007548921?text=${encodeURIComponent(
            'Assalam-o-Alaikum, I am inquiring regarding admission at Hassan Scholars Public School Zafarwal.'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all font-semibold text-xs border border-white/30 cursor-pointer"
          aria-label="WhatsApp Contact"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="hidden sm:inline">Admissions WhatsApp</span>
        </a>
      </div>

    </div>
  );
}

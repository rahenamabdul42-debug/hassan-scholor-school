import React, { useState, useEffect } from 'react';
import { 
  Send, CheckCircle, AlertCircle, Printer, Download, 
  Copy, RefreshCw, User, Phone, MapPin, GraduationCap, Check, ShieldCheck, Database
} from 'lucide-react';
import { SCHOOL_DETAILS, AdmissionApplication, INITIAL_ADMISSIONS_DATA } from '../data/schoolData';
import { 
  saveAdmissionRecord, 
  isSupabaseConfigured,
  SUPABASE_RLS_FIX_SQL,
  SupabaseSaveResult 
} from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'hsps_zafarwal_admissions';

interface AdmissionSectionProps {
  preselectedClass?: string;
}

export const AdmissionSection: React.FC<AdmissionSectionProps> = ({ preselectedClass }) => {
  // 5 Admission Form Fields:
  // 1. Student Name
  // 2. Father Name
  // 3. Class
  // 4. Phone Number
  // 5. Address
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [selectedClass, setSelectedClass] = useState('Playgroup');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // UI & Submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSlip, setSubmittedSlip] = useState<AdmissionApplication | null>(null);

  // Status feedback (Success or Error message)
  const [submissionResult, setSubmissionResult] = useState<SupabaseSaveResult | null>(null);

  // Admin / RLS guide modal (for website administrator)
  const [showRlsModal, setShowRlsModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Local storage backup for records
  const [applications, setApplications] = useState<AdmissionApplication[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ADMISSIONS_DATA;
  });

  const [activeTab, setActiveTab] = useState<'form' | 'records'>('form');

  // Sync preselected class if passed from Academics section
  useEffect(() => {
    if (preselectedClass) {
      setSelectedClass(preselectedClass);
    }
  }, [preselectedClass]);

  // Persist local backup
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.warn('Local storage write error:', e);
    }
  }, [applications]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!studentName.trim()) newErrors.studentName = 'Student Name is required';
    if (!fatherName.trim()) newErrors.fatherName = "Father Name is required";
    if (!selectedClass.trim()) newErrors.selectedClass = 'Please select a Class';
    if (!phone.trim() || phone.length < 10) {
      newErrors.phone = 'Valid Phone Number is required (min 10 digits)';
    }
    if (!address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionResult(null);

    // Save automatically to Supabase admissions table using central client
    const result = await saveAdmissionRecord({
      student_name: studentName.trim(),
      father_name: fatherName.trim(),
      grade: selectedClass.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    setSubmissionResult(result);

    // Generate slip and tracking record
    const trackingId = `HSPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: AdmissionApplication = {
      id: `adm-${Date.now()}`,
      trackingId,
      submissionDate: new Date().toISOString().split('T')[0],
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      grade: selectedClass.trim(),
      parentPhone: phone.trim(),
      address: address.trim(),
      dob: 'As per B-Form',
      gender: 'Registered',
      previousSchool: 'As recorded',
      status: result.isSavedInSupabase ? 'Admission Offered' : 'Received',
    };

    setApplications((prev) => [newRecord, ...prev]);

    if (result.isSavedInSupabase) {
      setSubmittedSlip(newRecord);
      // Reset form fields on success
      setStudentName('');
      setFatherName('');
      setPhone('');
      setAddress('');
    }

    setIsSubmitting(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_RLS_FIX_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <section id="admissions" className="py-20 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 font-crest">
            Hassan Scholars Public School · Zafarwal
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-school text-blue-950 tracking-tight">
            Online Admission Form
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed pt-2">
            Fill in the 5 fields below to submit an admission application. Applications are registered automatically in our admissions database.
          </p>
        </div>

        {/* Tab switch between Form and Records */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-950'
              }`}
            >
              Admission Form (5 Fields)
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'records'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-950'
              }`}
            >
              View Admissions ({applications.length})
            </button>
          </div>
        </div>

        {/* TAB 1: 5-FIELD ADMISSION FORM */}
        {activeTab === 'form' && (
          <div className="max-w-3xl mx-auto">
            
            {/* Submission Status Message (Success or Error) */}
            {submissionResult && (
              <div className={`mb-6 p-5 rounded-2xl border transition-all ${
                submissionResult.isSavedInSupabase
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                <div className="flex items-start gap-3">
                  {submissionResult.isSavedInSupabase ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-base tracking-tight">
                      {submissionResult.isSavedInSupabase
                        ? 'Admission Application Submitted and Saved in Supabase Successfully!'
                        : 'Submission Failed to Save in Supabase'}
                    </h4>
                    <p className="text-xs opacity-90 leading-relaxed">
                      {submissionResult.details || (submissionResult.isSavedInSupabase 
                        ? 'Record successfully stored in your Supabase admissions table.' 
                        : 'Please verify Supabase environment variables or Row Level Security policies.')}
                    </p>
                    {!submissionResult.isSavedInSupabase && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setShowRlsModal(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-950 bg-rose-200 hover:bg-rose-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>View Supabase RLS Fix Script</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* If submission succeeded, show official slip */}
            {submittedSlip ? (
              <div id="printable-admission-slip" className="bg-white rounded-2xl border-2 border-amber-400 p-6 sm:p-8 shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center font-crest font-bold text-xl border border-amber-400">
                      HS
                    </div>
                    <div>
                      <h3 className="font-crest text-lg font-bold text-blue-950">
                        {SCHOOL_DETAILS.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Zafarwal, Punjab, Pakistan · Official Admission Registration Slip
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-lg">
                      Saved in Supabase: {submittedSlip.trackingId}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Date: {submittedSlip.submissionDate}</p>
                  </div>
                </div>

                {/* 5 Submitted Fields Summary */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">1. Student Name</span>
                    <p className="font-bold text-slate-900 mt-0.5">{submittedSlip.studentName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">2. Father Name</span>
                    <p className="font-bold text-slate-900 mt-0.5">{submittedSlip.fatherName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">3. Class</span>
                    <p className="font-bold text-amber-800 mt-0.5">{submittedSlip.grade}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">4. Phone Number</span>
                    <p className="font-mono font-medium text-slate-900 mt-0.5">{submittedSlip.parentPhone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 uppercase font-semibold">5. Address</span>
                    <p className="font-medium text-slate-900 mt-0.5">{submittedSlip.address}</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-blue-950">Next Step for Zafarwal Campus Verification:</p>
                  <p>
                    Please visit the school administration office on Main Circular Road, Zafarwal between 08:30 AM and 01:00 PM with your child’s B-Form copy and this tracking reference.
                  </p>
                </div>

                {/* Slip Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-blue-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Slip</span>
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(submittedSlip, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Admission_${submittedSlip.trackingId}.json`;
                        a.click();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Receipt</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSubmittedSlip(null);
                      setSubmissionResult(null);
                    }}
                    className="text-xs font-semibold text-blue-950 hover:underline cursor-pointer"
                  >
                    + Submit Another Admission
                  </button>
                </div>
              </div>
            ) : (
              /* THE 5-FIELD ADMISSION FORM */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold font-serif-school text-blue-950">
                      Admission Application
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Please enter the 5 details below. Submissions are stored directly in our admissions database.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Session 2026–27
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Field 1: Student Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      1. Student Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Muhammad Abdullah"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-colors ${
                          errors.studentName ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-300 focus:border-blue-900'
                        }`}
                      />
                    </div>
                    {errors.studentName && (
                      <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.studentName}
                      </p>
                    )}
                  </div>

                  {/* Field 2: Father Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      2. Father Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="e.g. Tariq Mehmood"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-colors ${
                          errors.fatherName ? 'border-rose-400 focus:ring-1 focus:ring-rose-400' : 'border-slate-300 focus:border-blue-900'
                        }`}
                      />
                    </div>
                    {errors.fatherName && (
                      <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fatherName}
                      </p>
                    )}
                  </div>

                  {/* Field 3: Class */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      3. Class <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-900 focus:outline-none font-medium text-slate-900"
                      >
                        <optgroup label="Early Childhood Education">
                          <option value="Playgroup">Playgroup (Age 2.5–3.5 yrs)</option>
                          <option value="Nursery">Nursery (Age 3.5–4.5 yrs)</option>
                          <option value="Kindergarten (Prep)">Kindergarten (Prep) (Age 4.5–5.5 yrs)</option>
                        </optgroup>
                        <optgroup label="Primary Wing">
                          <option value="Grade 1">Grade 1</option>
                          <option value="Grade 2">Grade 2</option>
                          <option value="Grade 3">Grade 3</option>
                          <option value="Grade 4">Grade 4</option>
                          <option value="Grade 5">Grade 5</option>
                        </optgroup>
                        <optgroup label="Middle Wing">
                          <option value="Grade 6">Grade 6</option>
                          <option value="Grade 7">Grade 7</option>
                          <option value="Grade 8">Grade 8</option>
                        </optgroup>
                        <optgroup label="Secondary Wing (BISE Matriculation)">
                          <option value="Grade 9 (Science - Biology)">Grade 9 (Science - Biology)</option>
                          <option value="Grade 9 (Science - Computer)">Grade 9 (Science - Computer)</option>
                          <option value="Grade 10 (Science - Biology)">Grade 10 (Science - Biology)</option>
                          <option value="Grade 10 (Science - Computer)">Grade 10 (Science - Computer)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Field 4: Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      4. Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-colors ${
                          errors.phone ? 'border-rose-400' : 'border-slate-300 focus:border-blue-900'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Field 5: Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      5. Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Street / Mohallah in Zafarwal, Punjab"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-colors ${
                          errors.address ? 'border-rose-400' : 'border-slate-300 focus:border-blue-900'
                        }`}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                      Submissions are registered immediately in our school admissions database.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-blue-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Admission</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECORDS LEDGER */}
        {activeTab === 'records' && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif-school text-blue-950">
                  Admission Form Submissions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Saved records with all 5 fields.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRlsModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-amber-700" />
                  <span>Supabase RLS Policy</span>
                </button>

                <button
                  onClick={() => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(applications, null, 2));
                    const dl = document.createElement('a');
                    dl.setAttribute('href', dataStr);
                    dl.setAttribute('download', 'HSPS_Admissions_Records.json');
                    dl.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Tracking ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Father Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Phone Number</th>
                    <th className="py-3 px-3">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono font-bold text-blue-950">{app.trackingId}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{app.studentName}</td>
                      <td className="py-3 px-3">{app.fatherName}</td>
                      <td className="py-3 px-3 font-medium text-amber-800">{app.grade}</td>
                      <td className="py-3 px-3 font-mono">{app.parentPhone}</td>
                      <td className="py-3 px-3 text-slate-500 truncate max-w-[200px]">{app.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADMIN RLS POLICY MODAL */}
        {showRlsModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowRlsModal(false)}
          >
            <div 
              className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5 text-blue-950" />
                  </div>
                  <div>
                    <h3 className="font-crest text-lg font-bold">
                      Supabase Row Level Security (RLS) Policy
                    </h3>
                    <p className="text-xs text-amber-300">
                      Allows anonymous visitors to safely INSERT admission applications
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRlsModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 overflow-y-auto text-sm text-slate-700">
                <p className="text-xs text-slate-600 leading-relaxed">
                  To ensure anonymous public visitors can submit admission forms without receiving permission errors, copy and run this SQL query once in your <strong>Supabase Dashboard &rarr; SQL Editor</strong>:
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                    SQL Script for Anonymous Public Insert:
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                  <pre>{SUPABASE_RLS_FIX_SQL}</pre>
                </div>

                <div className="p-3 bg-blue-50 text-xs text-slate-700 rounded-lg space-y-1">
                  <p className="font-bold text-blue-950">Vercel Environment Variables Setup:</p>
                  <p>In your Vercel Project &rarr; <strong>Settings &rarr; Environment Variables</strong>, add:</p>
                  <ul className="list-disc list-inside font-mono text-[11px] text-blue-900 space-y-0.5 mt-1">
                    <li>VITE_SUPABASE_URL = (your project URL)</li>
                    <li>VITE_SUPABASE_ANON_KEY = (your public anon / publishable key)</li>
                  </ul>
                  <p className="text-slate-500 mt-1">Note: Never use the service_role key on the frontend.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                <button
                  onClick={() => setShowRlsModal(false)}
                  className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

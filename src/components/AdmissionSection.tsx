import React, { useState, useEffect } from 'react';
import { 
  Send, CheckCircle, AlertCircle, Printer, Download, 
  Copy, RefreshCw, User, Phone, MapPin, GraduationCap, Check, ShieldCheck, Database,
  Link2, Key, Sparkles
} from 'lucide-react';
import { SCHOOL_DETAILS, AdmissionApplication, INITIAL_ADMISSIONS_DATA } from '../data/schoolData';
import { 
  saveAdmissionRecord, 
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
  checkSupabaseConnection,
  SUPABASE_RLS_FIX_SQL,
  SupabaseSaveResult,
  SupabaseConnectionStatus 
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

  // Supabase live connection state
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConnectionStatus>({
    isConnected: false,
    statusText: 'Checking connection...',
    url: '',
    hasKey: false,
    source: 'none',
  });
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // Admin / Link modal state
  const [showRlsModal, setShowRlsModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkKey, setLinkKey] = useState('');
  const [linkMessage, setLinkMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);

  const checkConnection = async () => {
    setIsCheckingDb(true);
    try {
      const status = await checkSupabaseConnection();
      setSupabaseStatus(status);
    } catch {
      setSupabaseStatus({
        isConnected: false,
        statusText: 'Unable to reach database',
        url: '',
        hasKey: false,
        source: 'none',
      });
    } finally {
      setIsCheckingDb(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const cfg = getSupabaseConfig();
    setLinkUrl(cfg.url || '');
    setLinkKey(cfg.anonKey || '');
  }, []);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(linkUrl.trim(), linkKey.trim());
    setLinkMessage({ text: 'Verifying connection to admissions table...', isSuccess: true });
    
    setIsCheckingDb(true);
    const newStatus = await checkSupabaseConnection();
    setSupabaseStatus(newStatus);
    setIsCheckingDb(false);

    if (newStatus.isConnected) {
      setLinkMessage({ text: 'Connected successfully! The form is now linked to your Supabase admissions table.', isSuccess: true });
    } else {
      setLinkMessage({ text: `Credentials saved, but verification reported: ${newStatus.statusText}`, isSuccess: false });
    }
    setTimeout(() => setLinkMessage(null), 5000);
  };

  const handleResetToEnv = async () => {
    saveSupabaseConfig('', '');
    const cfg = getSupabaseConfig();
    setLinkUrl(cfg.url || '');
    setLinkKey(cfg.anonKey || '');
    const status = await checkSupabaseConnection();
    setSupabaseStatus(status);
    setLinkMessage({ text: 'Reset to environment variables.', isSuccess: true });
    setTimeout(() => setLinkMessage(null), 3000);
  };

  const handleFillSample = () => {
    setStudentName('Muhammad Hamza Tariq');
    setFatherName('Tariq Mehmood');
    setSelectedClass('Grade 9 (Science - Computer)');
    setPhone('0300-7548921');
    setAddress('Main Circular Road, Zafarwal, District Narowal, Punjab');
    setErrors({});
  };

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
    if (result.isSavedInSupabase) {
      setSupabaseStatus(prev => ({ ...prev, isConnected: true }));
    }

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

    // Always set submitted slip and save in ledger so applicant receives their tracking reference
    setSubmittedSlip(newRecord);

    // Reset form fields
    setStudentName('');
    setFatherName('');
    setPhone('');
    setAddress('');

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
            
            {/* Submission Status Message (Success or Informative) */}
            {submissionResult && (
              <div className={`mb-6 p-5 rounded-2xl border transition-all ${
                submissionResult.isSavedInSupabase
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-start gap-3">
                  {submissionResult.isSavedInSupabase ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-base tracking-tight">
                      {submissionResult.isSavedInSupabase
                        ? 'Saved in Supabase Successfully'
                        : 'Not Saved in Supabase Yet'}
                    </h4>
                    <p className="text-xs opacity-90 leading-relaxed">
                      {submissionResult.details || (submissionResult.isSavedInSupabase 
                        ? 'Record successfully stored in your Supabase admissions table.' 
                        : 'Your admission application has been registered safely in the school admissions ledger. Remote cloud sync will automatically proceed once Supabase credentials are configured.')}
                    </p>
                    {!submissionResult.isSavedInSupabase && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setShowRlsModal(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-950 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>View Supabase Setup & RLS Script</span>
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
                    <span className={`inline-block border text-xs font-mono font-bold px-3 py-1 rounded-lg ${
                      submissionResult?.isSavedInSupabase
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-900 border-amber-300'
                    }`}>
                      {submissionResult?.isSavedInSupabase ? 'Saved in Supabase: ' : 'Registration Ref: '}
                      {submittedSlip.trackingId}
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
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFillSample}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 transition-colors cursor-pointer"
                      title="Fill sample details for quick testing"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Fill Sample</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRlsModal(true)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                        supabaseStatus.isConnected
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                      }`}
                      title="View Supabase connection status & SQL table script"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>{supabaseStatus.isConnected ? 'Supabase Linked' : 'Link Supabase'}</span>
                    </button>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      Session 2026–27
                    </span>
                  </div>
                </div>

                {/* Live Supabase Connection Banner */}
                {supabaseStatus.isConnected ? (
                  <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 text-xs text-emerald-950">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <div>
                        <span className="font-bold">Linked to Supabase Table:</span> All submissions save directly to your <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">admissions</code> table.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRlsModal(true)}
                      className="font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer text-[11px]"
                    >
                      Manage Connection
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 via-amber-100/40 to-blue-50/50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-800">
                    <div className="flex items-start gap-2.5">
                      <Database className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-blue-950 text-sm">
                          SQL Table Created! Now Link Your Project
                        </p>
                        <p className="text-slate-600 text-xs mt-0.5">
                          Enter your Supabase Project URL & Anon Key so this form writes directly into your <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-300">admissions</code> table.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRlsModal(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shrink-0 shadow-xs cursor-pointer transition-colors"
                    >
                      <Link2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Link Supabase Now</span>
                    </button>
                  </div>
                )}

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
              <div className={`p-6 text-white flex items-center justify-between shrink-0 ${
                supabaseStatus.isConnected
                  ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950'
                  : 'bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    supabaseStatus.isConnected ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-blue-950'
                  }`}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-crest text-lg font-bold">
                      Link Supabase Admissions Table
                    </h3>
                    <p className="text-xs text-amber-300">
                      {supabaseStatus.isConnected 
                        ? '🟢 Form is actively linked and ready to insert' 
                        : 'Enter your project credentials to link table'}
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
              <div className="p-6 space-y-5 overflow-y-auto text-sm text-slate-700">
                
                {/* Real-time Status Card */}
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  supabaseStatus.isConnected
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}>
                  <div className="flex items-center gap-3">
                    {supabaseStatus.isConnected ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-xs">
                        {supabaseStatus.isConnected ? 'Connected to admissions table' : 'Not linked to Supabase yet'}
                      </p>
                      <p className="text-[11px] opacity-90 mt-0.5">{supabaseStatus.statusText}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={checkConnection}
                    disabled={isCheckingDb}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin text-blue-950' : ''}`} />
                    <span>{isCheckingDb ? 'Checking...' : 'Check'}</span>
                  </button>
                </div>

                {/* Direct Link Form */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-blue-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>Link Your Supabase Project (Project URL & Anon Key)</span>
                    </h4>
                    {linkMessage && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        linkMessage.isSuccess 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {linkMessage.text}
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveCredentials} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        1. Supabase Project URL:
                      </label>
                      <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://your-project-id.supabase.co"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:outline-none focus:border-blue-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        2. Supabase Anon / Public Key:
                      </label>
                      <input
                        type="text"
                        value={linkKey}
                        onChange={(e) => setLinkKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:outline-none focus:border-blue-900"
                        required
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        From your Supabase Dashboard &rarr; Project Settings &rarr; API &rarr; Project API keys (anon public).
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleResetToEnv}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Reset to Vercel env defaults
                      </button>

                      <button
                        type="submit"
                        disabled={isCheckingDb}
                        className="px-5 py-2 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Link2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Link & Verify Table</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* SQL Table & RLS Script */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                      SQL Table & Public Insert RLS Policy:
                    </span>
                    <button
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-36 border border-slate-800">
                    <pre>{SUPABASE_RLS_FIX_SQL}</pre>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-xs text-slate-700 rounded-lg space-y-1">
                  <p className="font-bold text-blue-950">For Production / Vercel Deployments:</p>
                  <p>In your Vercel Project &rarr; <strong>Settings &rarr; Environment Variables</strong>, add:</p>
                  <ul className="list-disc list-inside font-mono text-[11px] text-blue-900 space-y-0.5 mt-1">
                    <li>VITE_SUPABASE_URL = (your project URL)</li>
                    <li>VITE_SUPABASE_ANON_KEY = (your public anon key)</li>
                  </ul>
                  <p className="text-slate-500 mt-1">This allows all external visitors to submit directly without manual setup.</p>
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

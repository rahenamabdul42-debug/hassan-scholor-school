import React, { useState, useEffect } from 'react';
import { 
  Send, CheckCircle, AlertCircle, Printer, Download, Search, 
  Copy, Database, Key, ExternalLink, RefreshCw, User, Phone, MapPin, GraduationCap, Check
} from 'lucide-react';
import { SCHOOL_DETAILS, AdmissionApplication, INITIAL_ADMISSIONS_DATA } from '../data/schoolData';
import { 
  saveAdmissionRecord, 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  getSupabaseClient, 
  SUPABASE_SQL_SCRIPT,
  SupabaseSaveResult 
} from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'hsps_zafarwal_admissions';

interface AdmissionSectionProps {
  preselectedClass?: string;
}

export const AdmissionSection: React.FC<AdmissionSectionProps> = ({ preselectedClass }) => {
  // Exactly 5 form fields as requested:
  // 1. Student Full Name
  // 2. Father's Name
  // 3. Class Applying For
  // 4. Parent Phone Number
  // 5. Home Address
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [grade, setGrade] = useState('Playgroup');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // UI & Submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSlip, setSubmittedSlip] = useState<AdmissionApplication | null>(null);

  // Status message for Supabase (Must show "Saved in Supabase Successfully" or "Not saved yet in Supabase")
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSaveResult | null>(null);

  // Supabase Settings & SQL Prompt Modal/Drawer
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(() => getSupabaseConfig().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => getSupabaseConfig().anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testConnStatus, setTestConnStatus] = useState<string | null>(null);
  const [isTestingConn, setIsTestingConn] = useState(false);

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

  // Sync preselected class if passed from Academics
  useEffect(() => {
    if (preselectedClass) {
      setGrade(preselectedClass);
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
    if (!studentName.trim()) newErrors.studentName = 'Student full name is required';
    if (!fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!grade.trim()) newErrors.grade = 'Please select class applying for';
    if (!phone.trim() || phone.length < 10) {
      newErrors.phone = 'Valid parent phone number is required (min 10 digits)';
    }
    if (!address.trim()) newErrors.address = 'Home address in/around Zafarwal is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSupabaseStatus(null);

    // 1. Attempt save to Supabase
    const supabaseResult = await saveAdmissionRecord({
      student_name: studentName.trim(),
      father_name: fatherName.trim(),
      grade: grade.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    setSupabaseStatus(supabaseResult);

    // 2. Create structured record for local slip generation
    const trackingId = `HSPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: AdmissionApplication = {
      id: `adm-${Date.now()}`,
      trackingId,
      submissionDate: new Date().toISOString().split('T')[0],
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      grade: grade.trim(),
      parentPhone: phone.trim(),
      address: address.trim(),
      dob: 'As per B-Form',
      gender: 'Registered',
      previousSchool: 'As recorded',
      status: supabaseResult.isSavedInSupabase ? 'Admission Offered' : 'Received',
    };

    setApplications((prev) => [newRecord, ...prev]);
    setSubmittedSlip(newRecord);
    setIsSubmitting(false);

    // Reset 5 form fields
    setStudentName('');
    setFatherName('');
    setPhone('');
    setAddress('');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSaveConfig = () => {
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    handleTestConnection();
  };

  const handleTestConnection = async () => {
    setIsTestingConn(true);
    setTestConnStatus(null);

    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    const client = getSupabaseClient();

    if (!client) {
      setTestConnStatus('Error: Supabase URL or Anon Key is missing.');
      setIsTestingConn(false);
      return;
    }

    try {
      const { error } = await client.from('admissions').select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          setTestConnStatus('Connected to Supabase, but "admissions" table does not exist yet. Please paste the SQL prompt in Supabase SQL editor.');
        } else {
          setTestConnStatus(`Supabase response: ${error.message}`);
        }
      } else {
        setTestConnStatus('Connection Successful! Supabase "admissions" table is ready and connected.');
      }
    } catch (err: any) {
      setTestConnStatus(`Connection failed: ${err?.message || 'Check network or credentials'}`);
    } finally {
      setIsTestingConn(false);
    }
  };

  const isConnected = !!(getSupabaseConfig().url && getSupabaseConfig().anonKey);

  return (
    <section id="admissions" className="py-20 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-amber-700 font-crest">
            Official Admission System
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-school text-blue-950 tracking-tight">
            Online Admission Application Form
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed pt-2">
            Apply online with 5 essential details. Submissions are synced with our Supabase database and issue an official registration slip for campus verification in Zafarwal.
          </p>
        </div>

        {/* Supabase Status Banner & Action Button */}
        <div className="max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 flex items-center gap-2">
                <span>Supabase Database Status:</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isConnected ? 'Connected' : 'Not Connected Yet'}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                {isConnected
                  ? 'Ready to save admission records directly into your Supabase table.'
                  : 'Click "Supabase Setup & SQL" to connect your Supabase project.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSupabaseModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Setup & SQL Prompt</span>
          </button>
        </div>

        {/* Tab switch between 5-field Form and Local Record Ledger */}
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
              Submitted Records ({applications.length})
            </button>
          </div>
        </div>

        {/* TAB 1: 5-FIELD ADMISSION FORM */}
        {activeTab === 'form' && (
          <div className="max-w-3xl mx-auto">
            
            {/* Supabase Status Message Display (Always shown whenever submitted) */}
            {supabaseStatus && (
              <div className={`mb-6 p-5 rounded-2xl border transition-all ${
                supabaseStatus.isSavedInSupabase
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-start gap-3">
                  {supabaseStatus.isSavedInSupabase ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-base tracking-tight">
                      {supabaseStatus.message}
                    </h4>
                    {supabaseStatus.details && (
                      <p className="text-xs opacity-90 leading-relaxed">
                        {supabaseStatus.details}
                      </p>
                    )}
                    {!supabaseStatus.isSavedInSupabase && (
                      <div className="pt-2">
                        <button
                          onClick={() => setShowSupabaseModal(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Configure Supabase Keys & SQL Table</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Generated Registration Slip (If submitted) */}
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
                        Zafarwal, Punjab, Pakistan · Admission Registration Slip
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="inline-block bg-blue-50 text-blue-900 border border-blue-200 text-xs font-mono font-bold px-3 py-1 rounded-lg">
                      Tracking ID: {submittedSlip.trackingId}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Date: {submittedSlip.submissionDate}</p>
                  </div>
                </div>

                {/* 5 Submitted Fields Summary */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">1. Student Full Name</span>
                    <p className="font-bold text-slate-900 mt-0.5">{submittedSlip.studentName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">2. Father's Name</span>
                    <p className="font-bold text-slate-900 mt-0.5">{submittedSlip.fatherName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">3. Class Applying For</span>
                    <p className="font-bold text-amber-800 mt-0.5">{submittedSlip.grade}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">4. Parent Phone Number</span>
                    <p className="font-mono font-medium text-slate-900 mt-0.5">{submittedSlip.parentPhone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 uppercase font-semibold">5. Home Address</span>
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
                      <span>Print Admission Slip</span>
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
                      setSupabaseStatus(null);
                    }}
                    className="text-xs font-semibold text-blue-950 hover:underline cursor-pointer"
                  >
                    + Submit Another Form
                  </button>
                </div>
              </div>
            ) : (
              /* THE 5-FIELD ADMISSION FORM */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold font-serif-school text-blue-950">
                      Admission Form (5 Essential Fields)
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter the 5 required details to register for Session 2026–2027.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    5 Fields Only
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Field 1: Student Full Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      1. Student Full Name <span className="text-rose-500">*</span>
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

                  {/* Field 2: Father's Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      2. Father's Name <span className="text-rose-500">*</span>
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

                  {/* Field 3: Class Applying For */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      3. Class Applying For <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-900 focus:outline-none font-medium text-slate-900"
                      >
                        <optgroup label="Early Childhood">
                          <option value="Playgroup">Playgroup</option>
                          <option value="Nursery">Nursery</option>
                          <option value="Kindergarten (Prep)">Kindergarten (Prep)</option>
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
                        <optgroup label="Secondary (Matriculation)">
                          <option value="Grade 9 (Science - Biology)">Grade 9 (Science - Biology)</option>
                          <option value="Grade 9 (Science - Computer)">Grade 9 (Science - Computer)</option>
                          <option value="Grade 10 (Science - Biology)">Grade 10 (Science - Biology)</option>
                          <option value="Grade 10 (Science - Computer)">Grade 10 (Science - Computer)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {/* Field 4: Parent Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      4. Parent Phone Number / WhatsApp <span className="text-rose-500">*</span>
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

                  {/* Field 5: Home Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                      5. Home Address (Zafarwal & Surrounding Areas) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House / Street / Mohallah in Zafarwal"
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
                      Saves directly to Supabase and generates registration slip.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-blue-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving Data...</span>
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
                  Admission Records (5 Fields)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View recent admissions submitted through this 5-field form.
                </p>
              </div>

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

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Tracking ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Father Name</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-3">Phone</th>
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

        {/* SUPABASE SETUP & SQL PROMPT MODAL */}
        {showSupabaseModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowSupabaseModal(false)}
          >
            <div 
              className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
                    <Database className="w-5 h-5 text-blue-950" />
                  </div>
                  <div>
                    <h3 className="font-crest text-lg font-bold">
                      Supabase Integration & Table SQL
                    </h3>
                    <p className="text-xs text-amber-300">
                      Copy SQL prompt and connect your Supabase credentials
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSupabaseModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-sm text-slate-700">
                
                {/* Step 1: SQL Prompt */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                      <span>Step 1: Paste this SQL in Supabase SQL Editor</span>
                    </h4>
                    <button
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Prompt'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    Open your Supabase dashboard &rarr; <strong>SQL Editor</strong> &rarr; Click <strong>New query</strong> &rarr; Paste and click <strong>Run</strong>:
                  </p>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                    <pre>{SUPABASE_SQL_SCRIPT}</pre>
                  </div>
                </div>

                {/* Step 2: Supabase Credentials */}
                <div className="space-y-4 pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950">
                    Step 2: Enter Supabase Project URL & Anon Key
                  </h4>
                  <p className="text-xs text-slate-500">
                    Found in your Supabase Dashboard under <strong>Project Settings &rarr; API</strong>.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Project URL:
                      </label>
                      <input
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://xyzabcdefghijklm.supabase.co"
                        className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Project Public Anon Key:
                      </label>
                      <input
                        type="password"
                        value={supabaseAnonKey}
                        onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>

                  {testConnStatus && (
                    <div className={`p-3 rounded-lg text-xs ${
                      testConnStatus.includes('Successful')
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}>
                      {testConnStatus}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleSaveConfig}
                      className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Save Configuration
                    </button>
                    <button
                      onClick={handleTestConnection}
                      disabled={isTestingConn}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isTestingConn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                      <span>Test Live Connection</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                <button
                  onClick={() => setShowSupabaseModal(false)}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg cursor-pointer"
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

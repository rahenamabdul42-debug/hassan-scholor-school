import React, { useState, useEffect } from 'react';
import { 
  Database, CheckCircle2, AlertCircle, RefreshCw, 
  ExternalLink, Copy, Check, ShieldCheck, Key, Globe, 
  ChevronRight, X, Sparkles, Server
} from 'lucide-react';
import { 
  checkSupabaseConnection, 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  SUPABASE_RLS_FIX_SQL,
  SupabaseConnectionStatus 
} from '../lib/supabase';

export const SupabaseStatusBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<SupabaseConnectionStatus>({
    isConnected: false,
    statusText: 'Checking connection...',
    url: '',
    hasKey: false,
    source: 'none',
  });
  const [isChecking, setIsChecking] = useState(false);

  // Manual configuration form state for quick on-the-fly testing
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const runCheck = async () => {
    setIsChecking(true);
    try {
      const result = await checkSupabaseConnection();
      setStatus(result);
    } catch {
      setStatus({
        isConnected: false,
        statusText: 'Not Connected (Network check failed)',
        url: '',
        hasKey: false,
        source: 'none',
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runCheck();
    const config = getSupabaseConfig();
    setCustomUrl(config.url || '');
    setCustomKey(config.anonKey || '');
  }, []);

  const handleSaveCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(customUrl.trim(), customKey.trim());
    setSaveSuccessMsg('Configuration updated! Testing connection...');
    await runCheck();
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleResetToEnv = async () => {
    saveSupabaseConfig('', '');
    const config = getSupabaseConfig();
    setCustomUrl(config.url || '');
    setCustomKey(config.anonKey || '');
    setSaveSuccessMsg('Reset to Vercel environment variables.');
    await runCheck();
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_RLS_FIX_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <>
      {/* FLOATING CORNER BUTTON (Bottom-Left) */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => {
            setIsOpen(true);
            runCheck();
          }}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full shadow-xl hover:shadow-2xl transition-all font-semibold text-xs border backdrop-blur-md cursor-pointer ${
            status.isConnected
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 hover:bg-emerald-900'
              : 'bg-blue-950/90 text-amber-200 border-amber-400/40 hover:bg-blue-900'
          }`}
          title="Click to check or configure Supabase connection"
          aria-label="Supabase Connection Status"
        >
          {/* Status Dot with pulse */}
          <span className="relative flex h-2.5 w-2.5">
            {status.isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </>
            )}
          </span>

          <Database className={`w-3.5 h-3.5 ${status.isConnected ? 'text-emerald-400' : 'text-amber-400'}`} />

          <span className="font-mono text-[11px] sm:text-xs">
            {status.isConnected ? (
              <span className="text-emerald-300 font-bold">Supabase: Connected</span>
            ) : (
              <span className="text-amber-300 font-bold">Supabase: Not Connected</span>
            )}
          </span>

          <span className="hidden sm:inline text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80 group-hover:bg-white/20">
            Check
          </span>
        </button>
      </div>

      {/* CONNECTION STATUS & CONFIGURATION MODAL */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative max-w-xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 text-white flex items-center justify-between ${
              status.isConnected 
                ? 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950'
                : 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  status.isConnected ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-blue-950'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-crest text-lg font-bold">
                      Supabase Database Status
                    </h3>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                      status.isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {status.isConnected ? 'LIVE CONNECTED' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Hassan Scholars Public School · 5-Field Online Admission Form
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
              
              {/* Status Display Card */}
              <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                status.isConnected 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-start gap-3">
                  {status.isConnected ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {status.isConnected 
                        ? 'Form is Connected with Supabase!' 
                        : 'Form is Not Connected with Supabase Yet'}
                    </h4>
                    <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                      {status.statusText}
                    </p>
                    <p className="text-[11px] mt-1 font-mono text-slate-600">
                      Configuration source: {status.source === 'vercel_env' ? 'Vercel Environment Variables (Production)' : status.source === 'custom' ? 'Direct Browser Configuration' : 'None detected yet'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={runCheck}
                  disabled={isChecking}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-blue-900' : ''}`} />
                  <span>{isChecking ? 'Testing...' : 'Test Now'}</span>
                </button>
              </div>

              {/* What happens on form submission explanation */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-blue-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>How Submissions Work:</span>
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>
                    When connected: Submissions are inserted directly into your Supabase <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">admissions</code> table and show <strong>"Saved in Supabase Successfully"</strong>.
                  </li>
                  <li>
                    When not connected: Submissions show <strong>"Not Saved in Supabase Yet"</strong>, generate an official registration slip with tracking ID, and store the application safely in the local admissions ledger so no applicant data is ever lost.
                  </li>
                </ul>
              </div>

              {/* Live Direct Configuration (Allows entering URL & Key directly) */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-blue-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    <span>Connect or Test Supabase Credentials</span>
                  </h4>
                  {saveSuccessMsg && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveCustom} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Supabase Project URL:
                    </label>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:outline-none focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Supabase Anon / Public Key:
                    </label>
                    <input
                      type="text"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-white focus:outline-none focus:border-blue-900"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Only use the public anon key. Never use the secret service_role key.
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
                      disabled={isChecking}
                      className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Save & Test Connection
                    </button>
                  </div>
                </form>
              </div>

              {/* SQL Prompt for Supabase Table Creation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-amber-600" />
                    <span>SQL Prompt to Paste in Supabase:</span>
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
                  </button>
                </div>
                
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-40 border border-slate-800">
                  <pre>{SUPABASE_RLS_FIX_SQL}</pre>
                </div>
                <p className="text-[11px] text-slate-500">
                  Run this SQL in your <strong>Supabase Dashboard &rarr; SQL Editor</strong> to ensure the table and public insert permissions are active.
                </p>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <a
                href="#admissions"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-blue-950 hover:underline flex items-center gap-1"
              >
                <span>Go to Admission Form (5 Fields)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

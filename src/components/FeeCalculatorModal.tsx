import React, { useState } from 'react';
import { X, Calculator, Download, Check, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import { ACADEMIC_PROGRAMS } from '../data/schoolData';

interface FeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToAdmission: (gradeName: string) => void;
}

export const FeeCalculatorModal: React.FC<FeeCalculatorModalProps> = ({
  isOpen,
  onClose,
  onProceedToAdmission,
}) => {
  const [selectedGrade, setSelectedGrade] = useState('Primary Classes (Grade 1 – 5)');
  const [includeTransport, setIncludeTransport] = useState(false);
  const [transportZone, setTransportZone] = useState('Zafarwal City (Within 3km)');
  const [siblingDiscount, setSiblingDiscount] = useState(false);

  if (!isOpen) return null;

  // Fee calculation logic
  const getBaseFee = () => {
    switch (selectedGrade) {
      case 'Playgroup': return 3500;
      case 'Nursery': return 3800;
      case 'Kindergarten (Prep)': return 4200;
      case 'Primary Classes (Grade 1 – 5)': return 4800;
      case 'Middle Classes (Grade 6 – 8)': return 5800;
      case 'Secondary / Matriculation (Grade 9 – 10)': return 7200;
      default: return 4500;
    }
  };

  const getLabCharges = () => {
    if (selectedGrade.includes('Secondary')) return 600;
    if (selectedGrade.includes('Middle')) return 300;
    return 0;
  };

  const getTransportFee = () => {
    if (!includeTransport) return 0;
    if (transportZone.includes('Within 3km')) return 1800;
    if (transportZone.includes('5km')) return 2300;
    return 2800; // Pasrur Road / Outer villages
  };

  const baseMonthly = getBaseFee();
  const lab = getLabCharges();
  const transport = getTransportFee();
  const discountMultiplier = siblingDiscount ? 0.85 : 1.0; // 15% concession for second sibling
  const subtotalAcademic = (baseMonthly + lab) * discountMultiplier;
  const totalMonthlyEst = Math.round(subtotalAcademic + transport);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5 text-blue-950" />
            </div>
            <div>
              <h3 className="font-crest text-lg font-bold">
                Fee Structure Estimator
              </h3>
              <p className="text-xs text-amber-300">
                Transparent Fee Breakdown & Prospectus · Session 2026–2027
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          
          {/* Grade Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              Select Class / Program:
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-blue-900 focus:outline-none font-semibold text-blue-950"
            >
              {ACADEMIC_PROGRAMS.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.ageGroup})
                </option>
              ))}
            </select>
          </div>

          {/* Optional Add-ons */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Additional Options & Concessions:
            </p>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTransport}
                onChange={(e) => setIncludeTransport(e.target.checked)}
                className="w-4 h-4 text-blue-950 rounded border-slate-300"
              />
              <span className="text-xs sm:text-sm text-slate-800 font-medium">
                Include School Van / Pick & Drop Transport
              </span>
            </label>

            {includeTransport && (
              <div className="pl-7 pt-1">
                <select
                  value={transportZone}
                  onChange={(e) => setTransportZone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
                >
                  <option value="Zafarwal City (Within 3km)">Zafarwal City (Within 3km) - PKR 1,800/mo</option>
                  <option value="Pasrur Road / Degree College Area (5km)">Pasrur Road / Degree College Area (5km) - PKR 2,300/mo</option>
                  <option value="Outer Village Radius (7-10km)">Outer Village Radius (7-10km) - PKR 2,800/mo</option>
                </select>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={siblingDiscount}
                onChange={(e) => setSiblingDiscount(e.target.checked)}
                className="w-4 h-4 text-blue-950 rounded border-slate-300"
              />
              <span className="text-xs sm:text-sm text-slate-800 font-medium">
                Sibling Concession (15% tuition discount for 2nd/3rd child)
              </span>
            </label>
          </div>

          {/* Breakdown Summary */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950 border-b border-slate-100 pb-2">
              Monthly Estimate Breakdown
            </h4>

            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Base Tuition Fee ({selectedGrade}):</span>
              <span className="font-semibold text-slate-900 font-mono">PKR {baseMonthly.toLocaleString()}</span>
            </div>

            {lab > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Science Lab & IT Materials:</span>
                <span className="font-semibold text-slate-900 font-mono">PKR {lab.toLocaleString()}</span>
              </div>
            )}

            {siblingDiscount && (
              <div className="flex justify-between text-xs text-emerald-700">
                <span>Sibling Concession (15%):</span>
                <span className="font-semibold font-mono">-PKR {Math.round((baseMonthly + lab) * 0.15).toLocaleString()}</span>
              </div>
            )}

            {includeTransport && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Transport Fee ({transportZone.split('(')[0].trim()}):</span>
                <span className="font-semibold text-slate-900 font-mono">PKR {transport.toLocaleString()}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-blue-950 block">Total Estimated Monthly Dues:</span>
                <span className="text-[11px] text-slate-400">One-time admission registration fee: PKR 3,500</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold font-serif-school text-amber-700 font-mono">
                PKR {totalMonthlyEst.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-blue-950">Financial Assistance Policy:</p>
            <p>
              Hassan Scholars Public School provides merit-based scholarships for high board achievers and need-based fee waivers for deserving orphans in Zafarwal. Contact the Principal's office directly for details.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              window.print();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Prospectus Sheet</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onProceedToAdmission(selectedGrade);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>Proceed to Apply Online</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

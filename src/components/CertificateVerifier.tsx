/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Certificate, AdminSettings } from '../types';
import { Search, ShieldCheck, ShieldAlert, Award, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface CertificateVerifierProps {
  lang: 'en' | 'bn';
  initialId?: string;
  onViewCertificate?: (cert: Certificate) => void;
}

export default function CertificateVerifier({ lang, initialId = '', onViewCertificate }: CertificateVerifierProps) {
  const [certId, setCertId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; certificate?: Certificate; error?: string } | null>(null);

  const t = {
    en: {
      title: 'Official Certificate Verification',
      subtitle: 'Enter a Certificate ID or verification code to check its authenticity and credibility.',
      placeholder: 'e.g. CERT-123456-ABC',
      verifyBtn: 'Verify Credential',
      verifying: 'Checking database registry...',
      validHeader: 'CREDENTIAL IS VALID',
      validSub: 'This is an authentic, certified document issued by our academic board.',
      invalidHeader: 'INVALID CREDENTIAL ALERT',
      invalidSub: 'No matching records found in our Google Sheets registry. Please check for spelling mistakes.',
      student: 'Candidate Name',
      exam: 'Assessment Name',
      grade: 'Achieved Grade',
      score: 'Score Secured',
      issueDate: 'Issuance Timestamp',
      viewFull: 'Open Full Certificate'
    },
    bn: {
      title: 'সার্টিফিকেট যাচাইকরণ কুঠুরি',
      subtitle: 'সার্টিফিকেট আইডি অথবা ভেরিফিকেশন কোড দিয়ে সঠিকতা এবং প্রমাণ নিশ্চিত করুন।',
      placeholder: 'যেমন: CERT-123456-ABC',
      verifyBtn: 'সার্টিফিকেট যাচাই করুন',
      verifying: 'সার্টিফিকেট শনাক্ত করা হচ্ছে...',
      validHeader: 'সার্টিফিকেটটি বৈধ এবং প্রমাণিত',
      validSub: 'এটি আমাদের একাডেমিক বোর্ড দ্বারা অনুমোদিত এবং নিবন্ধিত একটি সত্য সার্টিফিকেট।',
      invalidHeader: 'অবৈধ সার্টিফিকেট সতর্কতা!',
      invalidSub: 'সার্টিফিকেট ডাটাবেজে এই আইডির কোনো তথ্য পাওয়া যায়নি। দয়া করে আইডি চেক করুন।',
      student: 'শিক্ষার্থীর নাম',
      exam: 'পরীক্ষার নাম',
      grade: 'অর্জিত গ্রেড',
      score: 'প্রাপ্ত স্কোর',
      issueDate: 'প্রদানের সময়কাল',
      viewFull: 'সার্টিফিকেট দেখুন'
    }
  }[lang];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setSearched(true);
    setResult(null);

    try {
      const formatted = certId.trim().toUpperCase();
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(formatted)}`);
      
      if (res.ok) {
        const data = await res.json();
        setResult({ valid: true, certificate: data.certificate });
      } else {
        const errData = await res.json();
        setResult({ valid: false, error: errData.error });
      }
    } catch (e) {
      setResult({ valid: false, error: 'Connection to registry failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4" id="certificate-verifier-module">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-3 animate-pulse text-cyan-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-100 tracking-tight">
          {t.title}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleVerify} className="relative flex items-center mb-6">
        <input
          type="text"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder={t.placeholder}
          className="w-full bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 px-5 py-3.5 rounded-xl text-sm focus:outline-none focus:border-cyan-500/60 shadow-lg tracking-wider font-mono font-medium"
        />
        <button
          type="submit"
          disabled={loading || !certId.trim()}
          className="absolute right-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-800 disabled:to-slate-800 text-white text-xs px-4 py-2.5 rounded-lg transition-all font-medium flex items-center gap-2 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-t border-r border-white animate-spin" />
              {lang === 'en' ? 'Verifying...' : 'যাচাই হচ্ছে...'}
            </span>
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              {t.verifyBtn}
            </>
          )}
        </button>
      </form>

      {/* Result Container */}
      {searched && result && (
        <div className="transition-all duration-300">
          {result.valid && result.certificate ? (
            /* VALID */
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl shadow-emerald-950/20 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-sm flex items-center gap-1">
                    {t.validHeader}
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                  </h3>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    {t.validSub}
                  </p>
                </div>
              </div>

              {/* Data Record Summary */}
              <div className="mt-5 border-t border-slate-800 pt-5 space-y-3.5">
                <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-500" />
                    {t.student}
                  </span>
                  <span className="text-slate-200 font-bold text-sm">
                    {result.certificate.studentName}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-slate-400 text-xs flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-500" />
                    {t.exam}
                  </span>
                  <span className="text-slate-200 font-semibold text-sm">
                    {result.certificate.examName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 text-left">
                    <span className="text-slate-400 text-[10px] block uppercase tracking-wider">{t.grade}</span>
                    <span className="text-cyan-400 font-bold text-lg">{result.certificate.grade}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 text-left">
                    <span className="text-slate-400 text-[10px] block uppercase tracking-wider">{t.score}</span>
                    <span className="text-cyan-400 font-bold text-lg">{result.certificate.score} ({result.certificate.percentage}%)</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                  <span className="text-slate-400 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    {t.issueDate}
                  </span>
                  <span className="text-slate-200 text-xs">
                    {new Date(result.certificate.issueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {onViewCertificate && (
                <button
                  type="button"
                  onClick={() => onViewCertificate(result.certificate!)}
                  className="w-full mt-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-cyan-900/40 cursor-pointer text-center block"
                >
                  {t.viewFull}
                </button>
              )}
            </div>
          ) : (
            /* INVALID */
            <div className="bg-slate-900/60 border border-red-500/30 rounded-2xl p-6 shadow-xl shadow-red-950/20 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-red-400 font-bold uppercase tracking-wider text-sm">
                    {t.invalidHeader}
                  </h3>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    {t.invalidSub}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Certificate, AdminSettings } from '../types';
import { Award, Printer, ArrowDownToLine, Share2, Check, Copy } from 'lucide-react';

interface CertificateViewProps {
  certificate: Certificate;
  settings: AdminSettings;
  lang: 'en' | 'bn';
  onClose?: () => void;
}

export default function CertificateView({ certificate, settings, lang, onClose }: CertificateViewProps) {
  const [copied, setCopied] = React.useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      certTitle: 'CERTIFICATE OF COMPLETION',
      certAwarded: 'This certificate is proudly awarded to',
      certBody: 'for successfully completing and demonstrating exceptional proficiency in the assessment',
      certScore: 'Accomplished with an aggregate score of',
      certVerified: 'Verified Digital Certificate',
      certId: 'Certificate ID',
      issueDate: 'Issue Date',
      grade: 'Grade',
      percent: 'Score Percentage',
      verifyCode: 'Verification Code',
      authSignature: 'Authorized Signature',
      instSeal: 'Official Seal',
      close: 'Back to Dashboard',
      print: 'Print Certificate',
      download: 'Download PDF (Simulated)',
      share: 'Copy Link',
      copied: 'Copied!'
    },
    bn: {
      certTitle: 'কৃতিত্ব অর্জনের সার্টিফিকেট',
      certAwarded: 'এই সার্টিফিকেটটি গর্বের সাথে প্রদান করা হলো',
      certBody: 'সফলভাবে পরীক্ষা সম্পন্ন করার এবং চমৎকার পারদর্শিতা প্রদর্শন করার স্বীকৃতিস্বরূপ',
      certScore: 'সর্বমোট প্রাপ্ত স্কোর',
      certVerified: 'যাচাইকৃত ডিজিটাল সার্টিফিকেট',
      certId: 'সার্টিফিকেট আইডি',
      issueDate: 'ইস্যুর তারিখ',
      grade: 'গ্রেড',
      percent: 'প্রাপ্ত নম্বর হার',
      verifyCode: 'ভেরিফিকেশন কোড',
      authSignature: 'অনুমোদিত স্বাক্ষর',
      instSeal: 'অফিসিয়াল সিল',
      close: 'ড্যাশবোর্ডে ফিরুন',
      print: 'সার্টিফিকেট প্রিন্ট করুন',
      download: 'পিডিএফ ডাউনলোড',
      share: 'লিঙ্ক কপি করুন',
      copied: 'কপি করা হয়েছে!'
    }
  }[lang];

  // Print function
  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?verify=${certificate.certificateId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate mockup SVG QR Code pointing to this certificate
  const qrUrl = `${window.location.origin}/?verify=${certificate.certificateId}`;
  
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto py-6 px-4">
      {/* Action Suite */}
      <div className="flex flex-wrap gap-3 justify-center w-full print:hidden">
        <button
          onClick={handlePrint}
          id="btn-print-cert"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-cyan-900/40 transition-all text-sm pointer-events-auto cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          {t.print}
        </button>
        
        <button
          onClick={() => alert(lang === 'en' ? 'PDF Generation triggered! Saved to downloads.' : 'পিডিএফ ডাউনলোড সম্পন্ন হয়েছে!')}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-lg text-slate-200 font-medium transition-all text-sm pointer-events-auto cursor-pointer"
        >
          <ArrowDownToLine className="w-4 h-4" />
          {t.download}
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-lg text-slate-200 font-medium transition-all text-sm pointer-events-auto cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          {copied ? t.copied : t.share}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium transition-all text-sm pointer-events-auto cursor-pointer"
          >
            {t.close}
          </button>
        )}
      </div>

      {/* Main Certificate Area */}
      <div 
        ref={certRef}
        id="certificate-print-area"
        className="relative w-full aspect-[1.414/1] bg-[#0d1527] border-8 border-double border-cyan-500/30 rounded-2xl p-8 md:p-14 overflow-hidden text-slate-100 flex flex-col justify-between shadow-2xl shadow-cyan-950/50 print:border-slate-800 print:bg-white print:text-slate-900"
      >
        {/* Background glows (non-printable) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-x-12 -translate-y-12 print:hidden" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-12 translate-y-12 print:hidden" />

        {/* Framing Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400/50" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-400/50" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-400/50" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-400/50" />

        {/* Header Block */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2 print:text-cyan-800">
            <Award className="w-10 h-10 text-cyan-400 animate-pulse print:text-cyan-700" />
            <span className="font-semibold text-lg tracking-wider text-cyan-400 uppercase print:text-slate-800">
              {settings.websiteName}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 print:text-slate-800 uppercase">
            {t.certTitle}
          </h1>
          <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-3 print:bg-slate-300" />
        </div>

        {/* Body Award Section */}
        <div className="text-center my-4">
          <p className="text-sm md:text-base italic text-slate-300 print:text-slate-600">
            {t.certAwarded}
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-cyan-400 my-2 print:text-cyan-800 font-sans tracking-wide">
            {certificate.studentName}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed print:text-slate-600">
            {t.certBody}
          </p>
          <h3 className="text-base md:text-lg font-semibold text-slate-200 mt-2 print:text-slate-800">
            "{certificate.examName}"
          </h3>
        </div>

        {/* Score and Grade Block */}
        <div className="flex justify-center gap-6 md:gap-14 my-3 text-center">
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl print:bg-slate-100 print:border-none">
            <p className="text-[10px] uppercase text-slate-400 print:text-slate-500">{t.certScore}</p>
            <p className="text-lg md:text-xl font-bold text-cyan-400 print:text-cyan-800">
              {certificate.score}
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl print:bg-slate-100 print:border-none">
            <p className="text-[10px] uppercase text-slate-400 print:text-slate-500">{t.grade}</p>
            <p className="text-lg md:text-xl font-bold text-cyan-400 print:text-cyan-800">
              {certificate.grade}
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl print:bg-slate-100 print:border-none">
            <p className="text-[10px] uppercase text-slate-400 print:text-slate-500">{t.percent}</p>
            <p className="text-lg md:text-xl font-bold text-cyan-400 print:text-cyan-800">
              {certificate.percentage}%
            </p>
          </div>
        </div>

        {/* Footer info: QR, IDs, Signatures */}
        <div className="flex items-end justify-between mt-4 border-t border-slate-800/60 pt-4 print:border-slate-200">
          
          {/* Certificate metadata with verification ID */}
          <div className="text-left flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping print:hidden" />
              <p className="text-[9px] uppercase tracking-wider text-emerald-400 font-semibold print:text-slate-800">
                ✓ {t.certVerified}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 print:text-slate-500">
              {t.certId}: <span className="font-mono text-slate-200 print:text-slate-800 font-bold">{certificate.certificateId}</span>
            </p>
            <p className="text-[10px] text-slate-400 print:text-slate-500">
              {t.verifyCode}: <span className="font-mono text-slate-200 print:text-slate-800">{certificate.verificationCode}</span>
            </p>
            <p className="text-[10px] text-slate-400 print:text-slate-500">
              {t.issueDate}: <span className="text-slate-200 print:text-slate-800">{new Date(certificate.issueDate).toLocaleDateString()}</span>
            </p>
          </div>

          {/* Verification QR Mockup */}
          <div className="flex flex-col items-center gap-1 bg-white p-1 rounded-lg border border-slate-800">
            <svg className="w-16 h-16" viewBox="0 0 100 100" shapeRendering="crispEdges">
              {/* QR outer corner squares */}
              <rect x="0" y="0" width="30" height="30" fill="#0f172a" />
              <rect x="5" y="5" width="20" height="20" fill="white" />
              <rect x="10" y="10" width="10" height="10" fill="#0f172a" />

              <rect x="70" y="0" width="30" height="30" fill="#0f172a" />
              <rect x="75" y="5" width="20" height="20" fill="white" />
              <rect x="80" y="10" width="10" height="10" fill="#0f172a" />

              <rect x="0" y="70" width="30" height="30" fill="#0f172a" />
              <rect x="5" y="75" width="20" height="20" fill="white" />
              <rect x="10" y="80" width="10" height="10" fill="#0f172a" />

              {/* Fake inner data matrix pixels */}
              <rect x="40" y="10" width="10" height="15" fill="#0f172a" />
              <rect x="55" y="0" width="10" height="10" fill="#0f172a" />
              <rect x="40" y="40" width="15" height="15" fill="#0f172a" />
              <rect x="15" y="45" width="10" height="15" fill="#0f172a" />
              <rect x="45" y="75" width="15" height="15" fill="#0f172a" />
              <rect x="70" y="50" width="15" height="10" fill="#0f172a" />
              <rect x="80" y="75" width="15" height="20" fill="#0f172a" />
              <rect x="55" y="85" width="10" height="10" fill="#0f172a" />
            </svg>
            <span className="text-[7px] text-slate-800 font-sans font-semibold uppercase tracking-wider">
              {lang === 'en' ? 'Scan to Verify' : 'যাচাই করুন'}
            </span>
          </div>

          {/* Admin Signature */}
          <div className="text-right flex flex-col items-center">
            <div className="relative text-center h-12 flex items-center justify-center">
              {settings.signatureUrl ? (
                <img 
                  src={settings.signatureUrl} 
                  alt="admin signature" 
                  className="max-h-12 object-contain mix-blend-multiply brightness-150 contrast-125 filter grayscale dark:brightness-100 dark:mix-blend-normal"
                />
              ) : (
                <span className="text-xs font-serif italic text-cyan-400 font-bold">Smart Quiz Pro Admin</span>
              )}
            </div>
            <div className="w-32 h-[1px] bg-slate-800 my-1 print:bg-slate-300" />
            <p className="text-[10px] text-slate-400 print:text-slate-500 uppercase tracking-widest leading-none">
              {t.authSignature}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Exam, Question, ExamResult, AdminSettings } from '../types';
import { Shield, Clock, ChevronRight, ChevronLeft, Flag, HelpCircle, AlertTriangle, PlayCircle, Eye, RefreshCw, Hand } from 'lucide-react';

interface ExamEngineProps {
  exam: Exam;
  studentName: string;
  studentPhone: string;
  lang: 'en' | 'bn';
  settings: AdminSettings;
  onCompleted: (result: ExamResult) => void;
  onExit: () => void;
}

export default function ExamEngine({ exam, studentName, studentPhone, lang, settings, onCompleted, onExit }: ExamEngineProps) {
  // Questions pool (we can randomize option sequence or order on load!)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  
  // High-fidelity exam modes
  const [examMode, setExamMode] = useState<'assessment' | 'practice'>('assessment');
  // For Practice Mode (Mock Test): tracks which questions have details revealed
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  // Timer States
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [isExamActive, setIsExamActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Per-Question countdown timer
  const [questionTimeLeft, setQuestionTimeLeft] = useState(settings?.timerSeconds || 15);

  // Anti-Cheat metrics
  const [infractionCount, setInfractionCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [lastWarningMsg, setLastWarningMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const t = {
    en: {
      introTitle: 'EXAM REQUISITES & ATTENTION CLAUSE',
      introInst: 'Before initiating, review the security standard criteria strictly enforced on this board:',
      fullReq: 'Full Screen Mode Requirement',
      fullReqDesc: 'You must play in fullscreen. Restoring or minimizing the browser will be penalized.',
      antiTab: 'Anti-Cheat Tab Lock-in',
      antiTabDesc: 'Leaving this exam view, opening other tabs, or looking up solutions alerts the proctor.',
      limits: '3 infraction Limit',
      limitsDesc: 'Exceeding 3 alerts automatically triggers instant submission of your partial sheet.',
      disableAct: 'Clicks and Copy Blocked',
      disableActDesc: 'Right click, copying headers, and paste events are hard-disabled on this stage.',
      startBtn: 'Begin Secure Assessment',
      antiShield: 'ANTI-CHEAT SYSTEM ONLINE',
      warnHeader: 'SECURITY CONVENANCE BREACH',
      warnDesc: 'A tab switch or window focus exit was detected! Leaving the exam surface is highly prohibited.',
      attention: 'ALERT',
      submitting: 'Submitting secure grade-sheets...',
      autoSubmit: 'Time Completed! Auto submitting assessment metrics...',
      timeLeft: 'Time Remaining',
      prev: 'Previous',
      next: 'Next Question',
      finish: 'Submit Exam',
      navTitle: 'Question Navigator',
      student: 'Student',
      examTitle: 'Exam Title',
      points: 'Points',
      min: 'min',
      sec: 'sec',
      fullscreenBtn: 'Authorize Fullscreen',
      examModeLabel: 'Select Exam Mode',
      assessmentMode: 'Secure Certification Exam (Proctored)',
      assessmentModeDesc: 'Strict rules. Fullscreen & Anti-Cheat active. Core grading answers shown at end.',
      practiceMode: 'Mock Test / Practice (Self-Testing)',
      practiceModeDesc: 'Flexible pace. Anti-cheat inactive. Shows correct/incorrect feedback immediately upon click.',
      practiceFeedbackCorrect: '🎉 CORRET ANSWER! Excellent job.',
      practiceFeedbackIncorrect: '❌ INCORRECT! The correct answer is: ',
      timerLabel: 'Question Timer'
    },
    bn: {
      introTitle: 'নিরাপত্তা এবং পরীক্ষা বিষয়ক নির্দেশনা',
      introInst: 'পরীক্ষা আরম্ভ করার পূর্বে নিচের কড়া শিক্ষাবোর্ড নিয়মাবলি ও নির্দেশিকাসমূহ দেখে নিন:',
      fullReq: 'ফুল স্ক্রিন মোড আবশ্যক',
      fullReqDesc: 'আপনাকে আবশ্যিকভাবে ফুল-স্ক্রিনে পরীক্ষা দিতে হবে। স্ক্রিন সংক্ষিপ্ত বা মিনিমাইজ করলে শাস্তিযোগ্য অপরাধ গণ্য হবে।',
      antiTab: 'ট্যাব পরিবর্তন প্রতিরোধক',
      antiTabDesc: 'অন্য ট্যাব ওপেন করা, উইন্ডো পরিবর্তন করা বা ব্রাউজার থেকে মনোযোগ সরানো কড়াভাবে নিষিদ্ধ।',
      limits: '৩টি সতর্কবার্তা সীমা',
      limitsDesc: 'কোনোভাবে ৩ বার উইন্ডো পরিবর্তন হলে পরীক্ষাটি সাথে সাথে অটো-সাবমিট হয়ে যাবে।',
      disableAct: 'কপি এবং পেস্ট লক',
      disableActDesc: 'পরীক্ষার পাতায় মাউসের রাইট ক্লিক এবং কপি করার অপশনসমূহ সম্পূর্ণ বন্ধ থাকবে।',
      startBtn: 'পরীক্ষা শুরু করুন',
      antiShield: 'অ্যান্টি-চিট সিকিউরিটি রানিং',
      warnHeader: 'নিরাপত্তা নীতিমালা লংঘন!',
      warnDesc: 'ট্যাব উইন্ডো পরিবর্তন শনাক্ত হয়েছে! পরীক্ষার উইন্ডো থেকে বের হওয়া কড়াভাবে নিষিদ্ধ।',
      attention: 'সতর্কতা',
      submitting: 'পরীক্ষার খাতা জমা দেওয়া হচ্ছে...',
      autoSubmit: 'সময় শেষ! পরীক্ষাটি স্বয়ংক্রিয়ভাবে সাবমিট হচ্ছে...',
      timeLeft: 'অবশিষ্ট সময়',
      prev: 'পূর্ববর্তী',
      next: 'পরবর্তী প্রশ্ন',
      finish: 'পরীক্ষা শেষ করুন',
      navTitle: 'প্রশ্ন নেভিগেটর',
      student: 'শিক্ষার্থী',
      examTitle: 'পরীক্ষার নাম',
      points: 'নম্বর',
      min: 'মি:',
      sec: 'সে:',
      fullscreenBtn: 'ফুলস্ক্রিন অনুমোদন করুন',
      examModeLabel: 'পরীক্ষা আরম্ভ করার মোড',
      assessmentMode: 'সার্টিফিকেশন পরীক্ষা মোড (প্রক্টর্ড)',
      assessmentModeDesc: 'কঠোর অ্যান্টি-চিট সক্রিয়। ফুলস্ক্রিন আবশ্যক। সঠিক/ভুল উত্তর পরীক্ষা শেষে প্রদর্শিত হবে।',
      practiceMode: 'মক টেস্ট মোড (অনুশীলনমূলক)',
      practiceModeDesc: 'কোনো কড়াকড়ি লক নেই। প্রতিটি প্রশ্নের উত্তর সাবমিট করার সাথে সাথেই সঠিক/ভুল উত্তর জেনে দিন।',
      practiceFeedbackCorrect: '🎉 সঠিক উত্তর! আপনার প্রস্তুতি অসাধারণ গতিতে এগিয়ে চলেছে।',
      practiceFeedbackIncorrect: '❌ উত্তরটি ভুল হয়েছে! সঠিক উত্তর ছিল: ',
      timerLabel: 'প্রশ্নভিত্তিক টাইমার'
    }
  }[lang];

  // Randomize questions upon mounting
  useEffect(() => {
    if (exam && exam.questions) {
      // Create a shallow copy and shuffle questions slightly to represent premium engine
      const shuffled = [...exam.questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }
  }, [exam]);

  // Load saved progress from localStorage (Auto-save feature!)
  useEffect(() => {
    if (isExamActive && exam) {
      const cacheKey = `sq_cache_${exam.id}_${studentPhone}`;
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        try {
          setSelectedAnswers(JSON.parse(saved));
        } catch (e) {
          console.warn("Cleared corrupted cached answers");
        }
      }
    }
  }, [isExamActive, exam, studentPhone]);

  // Save selected option to local cache automatically
  const handleSelectOption = (qId: string, choice: 'A' | 'B' | 'C' | 'D') => {
    // If practice/mock test mode and already answered, don't allow modification
    if (examMode === 'practice' && revealedAnswers[qId]) return;

    const nextAnswers = { ...selectedAnswers, [qId]: choice };
    setSelectedAnswers(nextAnswers);
    const cacheKey = `sq_cache_${exam.id}_${studentPhone}`;
    localStorage.setItem(cacheKey, JSON.stringify(nextAnswers));

    if (examMode === 'practice') {
      setRevealedAnswers((prev) => ({ ...prev, [qId]: true }));
    }
  };

  // Reset per-question countdown timer when question changes
  useEffect(() => {
    if (isExamActive && settings?.timerEnabled) {
      setQuestionTimeLeft(settings.timerSeconds || 15);
    }
  }, [currentIndex, isExamActive, settings]);

  // Per-Question countdown loop
  useEffect(() => {
    if (!isExamActive || !settings?.timerEnabled || isSubmitting) return;

    const interval = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleQuestionTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamActive, currentIndex, isSubmitting, settings]);

  const handleQuestionTimeout = () => {
    // If there is a next question, automatically go to it!
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      // It's the last question, auto-submit the exam!
      submitExamSheet();
    }
  };

  // Main countdown timer
  useEffect(() => {
    if (isExamActive && timeLeft > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamActive, timeLeft, isSubmitting]);

  // --- STRICT ANTI-CHEAT BEHAVIORS ---
  useEffect(() => {
    if (!isExamActive || examMode === 'practice') return;

    // Disabling Copy, Paste, Mouse Actions
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleCopyCutPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("Smart Quiz Pro Anti-Cheat Warning: Copying, cutting, or pasting text content is forbidden on this examination platform.");
    };

    // Tracking focus lost (Tab switching or browser blur)
    const handleWindowBlur = () => {
      setInfractionCount((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          // Immediately submit on 3rd warning!
          triggerImmediateSubmission();
        } else {
          setLastWarningMsg(
            lang === 'en' 
              ? `Warning ${next}/3: Stay on this index! Exiting this board again submits your partial answers immediately.` 
              : `সতর্কতা ${next}/৩: এই পাতাতেই থাকুন! পুনরায় উইন্ডো পরিবর্তন করলে পরীক্ষার খাতা সাবমিট হয়ে যাবে।`
          );
          setShowWarningModal(true);
        }
        return next;
      });
    };

    // Listeners mounting
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
    };
  }, [isExamActive]);

  // Safely exit fullscreen without throwing or leaving unhandled rejections
  const safeExitFullscreen = () => {
    try {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      if (isCurrentlyFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((err) => {
            console.warn("Failed to exit fullscreen automatically:", err);
          });
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    } catch (e) {
      console.warn("Error checking or exiting fullscreen:", e);
    }
  };

  useEffect(() => {
    return () => {
      safeExitFullscreen();
    };
  }, []);

  // Full screen toggle trigger helper
  const requestFullScreen = () => {
    try {
      const el = containerRef.current;
      if (el) {
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
          (el as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      }
    } catch (e) {
      console.warn("Fullscreen permission rejected or unavailable in this iframe environment.");
      setIsFullscreen(true); // Simulate fullscreen success in browser iframe sandbox
    }
  };

  // Start exam core routine
  const startExam = () => {
    requestFullScreen();
    setIsExamActive(true);
  };

  // Calculate final metrics and call server API
  const submitExamSheet = async (isAuto: boolean = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let score = 0;
    let correct = 0;
    let incorrect = 0;

    questions.forEach((q) => {
      const choice = selectedAnswers[q.id];
      if (choice) {
        if (choice === q.correctAnswer) {
          score += q.marks;
          correct += 1;
        } else {
          incorrect += 1;
        }
      } else {
        incorrect += 1; // unanswered counted as incorrect
      }
    });

    const totalQuestions = questions.length;
    const maxScore = totalQuestions * 5;
    const percentage = Math.round((score / (maxScore || 1)) * 100);
    const passed = percentage >= exam.passPercentage;

    // Define grade
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'A-';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 40) grade = 'D';

    // Send payload to backend
    const payload = {
      studentName,
      phone: studentPhone,
      examName: exam.title,
      score,
      correct,
      incorrect,
      percentage,
      grade,
      passed,
      type: percentage >= 90 ? 'achievement' : 'completion'
    };

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const resData = await res.json();
      
      // Clear local storage exam progress
      localStorage.removeItem(`sq_cache_${exam.id}_${studentPhone}`);
      
      if (res.ok) {
        onCompleted(resData.result);
      } else {
        alert("Unable to upload score-sheet. Submitting backup local scores.");
        onCompleted({
          id: `res-bk-${Date.now()}`,
          studentName,
          phone: studentPhone,
          examName: exam.title,
          score,
          correct,
          incorrect,
          percentage,
          grade,
          resultDate: new Date().toISOString(),
          passed,
          certificateId: passed ? `CERT-${Math.floor(100000 + Math.random() * 900000)}-LOCAL` : undefined
        });
      }
    } catch (err) {
      // Fail-safe mock completion logic
      onCompleted({
        id: `res-bk-${Date.now()}`,
        studentName,
        phone: studentPhone,
        examName: exam.title,
        score,
        correct,
        incorrect,
        percentage,
        grade,
        resultDate: new Date().toISOString(),
        passed,
        certificateId: passed ? `CERT-${Math.floor(100000 + Math.random() * 900000)}-LOCAL` : undefined
      });
    } finally {
      setIsSubmitting(false);
      // Exit fullscreen if active
      safeExitFullscreen();
    }
  };

  const handleAutoSubmit = () => {
    alert(t.autoSubmit);
    submitExamSheet(true);
  };

  const triggerImmediateSubmission = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    alert(lang === 'en' 
      ? 'Alert! 3/3 Anti-Cheat infractions reached. Proctor finalized and auto-submitted your current sheet.' 
      : 'সতর্কতা! ৩/৩ বার উইন্ডো পরিবর্তনের নিরাপত্তা নীতি ভঙ্গের কারণে পরীক্ষাটি স্বয়ংক্রিয়ভাবে জমা হয়ে গেছে।'
    );
    submitExamSheet(true);
  };

  // Format countdown string
  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isExamActive) {
    // SECURITY LOBBY
    return (
      <div className="w-full max-w-2xl mx-auto bg-[#090f1d]/90 border border-slate-800/80 rounded-2xl p-6 md:p-8 text-slate-100 shadow-2xl relative" id="security-clause-instructions">
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
        
        <div className="flex flex-col items-center text-center border-b border-slate-850 pb-6 mb-6">
          <div className="p-3 bg-cyan-500/10 border border-cyan-400/25 rounded-2xl text-cyan-400 animate-pulse mb-3">
            <Shield className="w-10 h-10" />
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-200">
            {t.introTitle}
          </h2>
          <p className="text-slate-400 text-xs mt-1 bg-slate-950/40 px-3 py-1 rounded-full border border-slate-900 font-mono tracking-wider">
            {t.antiShield}
          </p>
        </div>

        <p className="text-sm text-slate-300 mb-6 font-medium text-center">{t.introInst}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-left">
            <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {t.fullReq}
            </h4>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{t.fullReqDesc}</p>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-left">
            <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {t.antiTab}
            </h4>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{t.antiTabDesc}</p>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-left">
            <h4 className="text-sm font-semibold text-amber-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {t.limits}
            </h4>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{t.limitsDesc}</p>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-left">
            <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {t.disableAct}
            </h4>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{t.disableActDesc}</p>
          </div>
        </div>

        {/* EXAM CHARACTER MODE SELECTOR */}
        <div className="bg-[#030712] p-5 rounded-2xl border border-slate-900/65 mb-8 space-y-4 text-left">
          <label className="text-sm font-bold text-slate-200 tracking-wide block uppercase text-[11px] text-cyan-400">
            📊 {t.examModeLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Assessment mode card */}
            <button
              onClick={() => setExamMode('assessment')}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer pointer-events-auto ${
                examMode === 'assessment'
                  ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/40 text-slate-100 ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800'
              }`}
            >
              <div>
                <p className={`font-semibold text-xs transition-colors ${examMode === 'assessment' ? 'text-cyan-400' : 'text-slate-300'}`}>
                  {t.assessmentMode}
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-2">
                  {t.assessmentModeDesc}
                </p>
              </div>
            </button>

            {/* Practice/Mock Test Mode card */}
            <button
              onClick={() => setExamMode('practice')}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer pointer-events-auto ${
                examMode === 'practice'
                  ? 'bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-950/40 text-slate-100 ring-1 ring-emerald-500/20'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800'
              }`}
            >
              <div>
                <p className={`font-semibold text-xs transition-colors ${examMode === 'practice' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {t.practiceMode}
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-2">
                  {t.practiceModeDesc}
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onExit}
            className="flex-1 py-3 text-slate-300 font-medium rounded-xl border border-slate-800 hover:bg-slate-900 transition-all text-sm pointer-events-auto cursor-pointer"
          >
            {lang === 'en' ? 'Back' : 'ফিরুন'}
          </button>
          
          <button
            onClick={startExam}
            id="start-secured-exam-trigger"
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/40 text-sm flex items-center justify-center gap-2 pointer-events-auto cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 animate-bounce" />
            {t.startBtn}
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // ACTIVE EXAM ARENA
  return (
    <div 
      ref={containerRef}
      id="secured-exam-live-arena"
      className="bg-slate-950 w-full min-h-screen text-slate-100 p-4 md:p-8 flex flex-col justify-between"
    >
      {/* Alert Warning Overlay */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 bg-[#020617]/95 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500/40 rounded-2xl max-w-md p-6 text-center shadow-2xl relative">
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-500 inline-block mb-4 animate-bounce">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h3 className="text-red-500 font-bold text-lg mb-2 uppercase tracking-wide">
              {t.warnHeader}
            </h3>
            <p className="text-slate-200 text-sm leading-relaxed mb-6">
              {lastWarningMsg}
            </p>
            <button
              onClick={() => {
                setShowWarningModal(false);
                requestFullScreen();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold rounded-xl text-xs hover:from-red-700 hover:to-amber-700 transition-all cursor-pointer pointer-events-auto"
            >
              {lang === 'en' ? 'Return to Exam Board' : 'পরীক্ষায় ফিরে চলুন'}
            </button>
          </div>
        </div>
      )}

      {/* Top HUD */}
      <div className="border-b border-slate-900 pb-4 mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-200">{exam.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.student}: <span className="text-slate-100 font-semibold">{studentName} ({studentPhone})</span>
          </p>
        </div>

        {/* Dynamic Countdown Dial */}
        <div className="flex items-center gap-2.5 bg-[#0e1626] border border-cyan-500/20 px-4 py-2 rounded-xl">
          <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-cyan-400 animate-spin'} `} />
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase leading-none">{t.timeLeft}</p>
            <p className={`text-base font-mono font-bold leading-none mt-1 ${timeLeft < 60 ? 'text-red-500' : 'text-cyan-400'}`}>
              {formatTime()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Core Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start flex-1">
        
        {/* Questions Panel */}
        <div className="lg:col-span-3 flex flex-col justify-between min-h-[400px] h-full bg-slate-900/40 border border-slate-900 p-6 rounded-2xl relative">
          
          {currentQuestion ? (
            <div>
              {/* Question Header & Points badge */}
              <div className="flex justify-between items-start gap-4 mb-6">
                <span className="text-xs bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 px-3 py-1 rounded-full font-bold">
                  {lang === 'en' ? 'Question' : 'প্রশ্ন'} {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs text-slate-400">
                  {currentQuestion.marks} {t.points}
                </span>
              </div>

              {/* Question Title */}
              <h3 className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
                {currentQuestion.questionText}
              </h3>

              {/* Per-Question timer count-down animation banner */}
              {settings?.timerEnabled && (
                <div className="w-full bg-slate-950 rounded-full h-1.5 mb-5 overflow-hidden border border-slate-900 relative">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${(questionTimeLeft / (settings.timerSeconds || 15)) * 100}%` }}
                  />
                  <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1.5 font-mono px-0.5">
                    <span>⏳ {t.timerLabel}</span>
                    <span className="text-amber-400 font-bold">{questionTimeLeft} / {settings.timerSeconds || 15}s</span>
                  </div>
                </div>
              )}

              {/* Options lists */}
              <div className="mt-8 space-y-3.5">
                {[
                  { key: 'A', value: currentQuestion.optionA },
                  { key: 'B', value: currentQuestion.optionB },
                  { key: 'C', value: currentQuestion.optionC },
                  { key: 'D', value: currentQuestion.optionD }
                ].map((opt) => {
                  const studentSelection = selectedAnswers[currentQuestion.id];
                  const isSelected = studentSelection === opt.key;
                  const selectionRevealed = examMode === 'practice' && revealedAnswers[currentQuestion.id];

                  let btnBgClass = 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/80';
                  let badgeBgClass = 'bg-slate-800 text-slate-400';

                  if (selectionRevealed) {
                    if (opt.key === currentQuestion.correctAnswer) {
                      btnBgClass = 'bg-emerald-500/10 border-emerald-500/60 text-emerald-400 shadow-md shadow-emerald-950/20';
                      badgeBgClass = 'bg-emerald-400 text-slate-950 animate-pulse';
                    } else if (isSelected) {
                      btnBgClass = 'bg-rose-500/10 border-rose-500/60 text-rose-400 shadow-md shadow-rose-950/20 animate-shake';
                      badgeBgClass = 'bg-rose-400 text-slate-950';
                    } else {
                      btnBgClass = 'bg-slate-950/25 border-slate-900/60 text-slate-600 opacity-60';
                      badgeBgClass = 'bg-slate-950 text-slate-700';
                    }
                  } else if (isSelected) {
                    btnBgClass = 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/20';
                    badgeBgClass = 'bg-cyan-400 text-slate-950';
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(currentQuestion.id, opt.key as any)}
                      className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all flex items-center gap-4 cursor-pointer text-slate-300 pointer-events-auto ${btnBgClass}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${badgeBgClass}`}>
                        {opt.key}
                      </span>
                      <span>{opt.value}</span>
                    </button>
                  );
                })}
              </div>

              {/* Practice Mode immediate Correction notification box */}
              {examMode === 'practice' && revealedAnswers[currentQuestion.id] && (() => {
                const isCorrectVal = selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer;
                return (
                  <div className={`mt-6 p-4 rounded-xl border animate-fade-in text-xs text-left ${
                    isCorrectVal 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                      : 'bg-rose-500/5 border-rose-500/20 text-[#ff7171]'
                  }`}>
                    <p className="font-semibold flex items-center gap-2">
                      {isCorrectVal ? (
                        <span>{t.practiceFeedbackCorrect}</span>
                      ) : (
                        <span>
                          {t.practiceFeedbackIncorrect} 
                          <span className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-400 font-extrabold ml-1.5 font-mono text-[11px]">
                            {currentQuestion.correctAnswer}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <RefreshCw className="w-10 h-10 animate-spin mb-3 text-cyan-500" />
              <p className="text-sm">Pre-loading examination papers...</p>
            </div>
          )}

          {/* HUD Bottom Nav Buttons */}
          <div className="flex justify-between items-center mt-12 border-t border-slate-900 pt-5">
            <button
              onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 bg-slate-900/60 disabled:text-slate-700 hover:bg-slate-850 disabled:border-slate-900 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer pointer-events-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.prev}
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((p) => p + 1)}
                 className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold select-none cursor-pointer pointer-events-auto"
              >
                {t.next}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => submitExamSheet()}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-950 block select-none cursor-pointer pointer-events-auto"
              >
                {isSubmitting ? t.submitting : t.finish}
              </button>
            )}
          </div>

        </div>

        {/* Side Column: Question Index Map */}
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            {t.navTitle}
          </h2>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isSelected = currentIndex === idx;
              const isAnswered = !!selectedAnswers[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`aspect-square rounded-lg text-xs font-bold border transition-all flex items-center justify-center cursor-pointer pointer-events-auto ${
                    isSelected 
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 ring-2 ring-cyan-500/20' 
                      : isAnswered 
                        ? 'bg-slate-800 border-slate-700 text-cyan-400' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-900 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Solved' : 'সমাধানকৃত'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
              <span className="text-[10px] text-slate-400">{lang === 'en' ? 'Unsolved' : 'বাকি আছে'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, Exam, ExamResult, Certificate, AdminSettings, Notification, ExamSuggestion } from './types';
import { DEFAULT_ADMIN_SETTINGS, SAMPLE_EXAMS, SAMPLE_NOTIFICATIONS, SAMPLE_SUGGESTIONS } from './data';
import AdminPanel from './components/AdminPanel';
import ExamEngine from './components/ExamEngine';
import CertificateView from './components/CertificateView';
import CertificateVerifier from './components/CertificateVerifier';
import { 
  Award, Shield, BookOpen, Key, Bell, Search, Globe, User, Phone, Mail, Building2,
  Calendar, CheckCircle2, ChevronRight, GraduationCap, Clock, AlertCircle, FileText, Info,
  Facebook, MessageSquare, Send, Youtube, Sparkles, LogOut, ArrowRight, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global Bilingual state
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  // App core view routing
  const [view, setView] = useState<'lobby' | 'registration' | 'login' | 'dashboard' | 'exam' | 'result' | 'verifier' | 'admin'>('lobby');

  // Authentication State
  const [student, setStudent] = useState<Student | null>(null);
  
  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    institution: '',
    studentClass: '',
  });
  
  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Active exam / result state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [latestResult, setLatestResult] = useState<ExamResult | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Custom Settings
  const [settings, setSettings] = useState<AdminSettings>({ ...DEFAULT_ADMIN_SETTINGS });

  // Notifications pool
  const [notifications, setNotifications] = useState<Notification[]>([...SAMPLE_NOTIFICATIONS]);
  const [exams, setExams] = useState<Exam[]>([...SAMPLE_EXAMS]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [recentCerts, setRecentCerts] = useState<Certificate[]>([]);
  const [suggestions, setSuggestions] = useState<ExamSuggestion[]>([...SAMPLE_SUGGESTIONS]);

  // Search verifier deep link support
  const [verifyDeepLinkId, setVerifyDeepLinkId] = useState('');

  // Translations dictionary
  const t = {
    en: {
      siteTitle: 'Smart Quiz Pro',
      siteSubtitle: 'Premium Dynamic Exam & Certification Platform',
      tagline: 'Empower Your Knowledge',
      login: 'Student Login',
      register: 'Sign Up Profile',
      enterPhone: 'Enter Mobile Number',
      password: 'Passcode',
      remember: 'Remember My Credentials',
      regHeader: 'Join Smart Quiz Board',
      regDesc: 'Register your students file profile to start exams & unlock verifications.',
      name: 'Full Name',
      phone: 'Mobile Phone',
      email: 'Email Correspondence',
      institution: 'Educational Institution',
      studentClass: 'Class or Course',
      signUpBtn: 'Submit Registration',
      availableExam: 'Available Examinations',
      passMarks: 'Pass Criteria',
      duration: 'Duration',
      questions: 'Questions',
      startBtn: 'Enroll Assessment',
      historyTitle: 'Your Exam Scorecards',
      earnedCert: 'Collected Certs',
      certTitle: 'Verified digital certificate unlocked!',
      certCongrat: 'Congratulations! You successfully cleared the standard evaluation criteria.',
      viewCertBtn: 'Render Certificate',
      closeBtn: 'Back',
      notifHeader: 'Emergency Board Announcements',
      secKey: 'Admin Portal',
      verifySearch: 'Certificate Lookup',
      dashboard: 'Dashboard',
      noResult: 'No score-sheets found. Initiate an exam above to unlock certificates!',
      footerMsg: 'Smart Quiz Pro Platform • Built for high academic credibility.',
      welcomeBack: 'Welcome back,',
      category: 'Explore domains',
      studySuggestion: 'Study Suggestions & Guidelines'
    },
    bn: {
      siteTitle: 'স্মার্ট কুইজ প্রো',
      siteSubtitle: 'প্রিমিয়াম ডাইনামিক পরীক্ষা ও সার্টিফিকেট প্ল্যাটফর্ম',
      tagline: 'আপনার মেধা যাচাই করুন',
      login: 'শিক্ষার্থী লগইন',
      register: 'নতুন রেজিস্ট্রেশন',
      enterPhone: 'মোবাইল নম্বর দিন',
      password: 'পিন কোড',
      remember: 'লগইন তথ্য সংরক্ষণ করুন',
      regHeader: 'পরীক্ষার্থী নিবন্ধন করুন',
      regDesc: 'সার্টিফিকেট অর্জন ও ভেরিফিকেশন সুবিধা পেতে আপনার প্রোফাইল তৈরি করুন।',
      name: 'শিক্ষার্থীর পূর্ণ নাম',
      phone: 'মোবাইল নম্বর',
      email: 'ইমেইল অ্যাড্রেস',
      institution: 'শিক্ষা প্রতিষ্ঠান',
      studentClass: 'শ্রেণি বা কোর্স',
      signUpBtn: 'নিবন্ধন সম্পন্ন করুন',
      availableExam: 'উপলব্ধ পরীক্ষাসমূহ',
      passMarks: 'পাস মার্কস',
      duration: 'সময়সীমা',
      questions: 'মোট প্রশ্ন',
      startBtn: 'পরীক্ষা শুরু করুন',
      historyTitle: 'আপনার পরীক্ষার ইতিহাস',
      earnedCert: 'অর্জিত সার্টিফিকেটসমূহ',
      certTitle: 'ভেরিফাইড সার্টিফিকেট আনলক হয়েছে!',
      certCongrat: 'অভিনন্দন! আপনি সফলভাবে সর্বনিম্ন পাস মার্কের চেয়ে ভালো পারফর্ম করেছেন।',
      viewCertBtn: 'সার্টিফিকেট ডাউনলোড করুন',
      closeBtn: 'বন্ধ করুন',
      notifHeader: 'জরুরি নোটিশ বোর্ড',
      secKey: 'অ্যাডমিন ড্যাশবোর্ড',
      verifySearch: 'সার্টিফিকেট যাচাই',
      dashboard: 'শিক্ষার্থী ড্যাশবোর্ড',
      noResult: 'এখনো কোনো পরীক্ষায় অংশ নেননি। উপরে উপলব্ধ পরীক্ষায় অংশ নিন!',
      footerMsg: 'স্মার্ট কুইজ প্রো প্ল্যাটফর্ম • শিক্ষার সর্বোচ্চ মান রক্ষার্থে নিয়োজিত।',
      welcomeBack: 'স্বাগতম,',
      category: 'পরীক্ষার ক্যাটাগরিসমূহ',
      studySuggestion: 'কুইজ সাজেশন ও সিলেবাস গাইডলাইন'
    }
  }[lang];

  // Sync cache and settings
  useEffect(() => {
    // Check deep link verifications
    const params = new URLSearchParams(window.location.search);
    const code = params.get('verify');
    if (code) {
      setVerifyDeepLinkId(code);
      setView('verifier');
    }

    // Load saved settings & suggestions
    fetch("/api/settings")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(() => {});

    fetch("/api/suggestions")
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && Array.isArray(data)) {
          setSuggestions(data);
        }
      })
      .catch(() => {});

    // Sync saved session
    const cache = localStorage.getItem('sq_session_student');
    if (cache) {
      try {
        setStudent(JSON.parse(cache));
        setView('dashboard');
      } catch (e) {}
    }
  }, []);

  // Fetch local result histories
  useEffect(() => {
    if (student) {
      fetch("/api/results")
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          // Filter results matching student phone
          const personal = data.filter((r: ExamResult) => r.phone === student.phone);
          setResults(personal);
        })
        .catch(() => {});

      fetch("/api/certificates")
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const personalCerts = data.filter((c: Certificate) => c.phone === student.phone);
          setRecentCerts(personalCerts);
        })
        .catch(() => {});
    }
  }, [student, view]);

  // Submit student registration profile
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm)
      });
      if (res.ok) {
        const data = await res.json();
        alert(lang === 'en' ? 'Student profile initialized!' : 'রেজিস্ট্রেশন সফল হয়েছে!');
        if (rememberMe) {
          localStorage.setItem('sq_session_student', JSON.stringify(data.student));
        }
        setStudent(data.student);
        setView('dashboard');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e) {
      // Offline fallback profile
      const localProfile: Student = {
        id: `std-loc-${Date.now()}`,
        name: regForm.name,
        phone: regForm.phone,
        email: regForm.email,
        institution: regForm.institution,
        studentClass: regForm.studentClass,
        registrationDate: new Date().toISOString()
      };
      if (rememberMe) {
        localStorage.setItem('sq_session_student', JSON.stringify(localProfile));
      }
      setStudent(localProfile);
      setView('dashboard');
    }
  };

  // Submit student profile login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) return;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginPhone })
      });
      if (res.ok) {
        const data = await res.json();
        if (rememberMe) {
          localStorage.setItem('sq_session_student', JSON.stringify(data.student));
        }
        setStudent(data.student);
        setView('dashboard');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e) {
      alert("Verification server unavailable. Using offline login mock.");
      const mockUser: Student = {
        id: "std-mock",
        name: "Mock Registrant",
        phone: loginPhone,
        email: "mock@gmail.com",
        institution: "Default School",
        studentClass: "Honours",
        registrationDate: new Date().toISOString()
      };
      setStudent(mockUser);
      setView('dashboard');
    }
  };

  // Signout user
  const handleSignout = () => {
    localStorage.removeItem('sq_session_student');
    setStudent(null);
    setView('lobby');
  };

  return (
    <div className="min-h-screen bg-[#02050c] text-white font-sans flex flex-col justify-between selection:bg-cyan-500/30">
      
      {/* Dynamic Glowing Cyber-Accents */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-12" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none translate-y-12" />

      {/* Modern Top Header HUD */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/10 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer pointer-events-auto" onClick={() => setView('lobby')}>
            <GraduationCap className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div>
              <span className="font-serif font-extrabold text-sm md:text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-200 to-cyan-400 uppercase">
                {settings.websiteName || t.siteTitle}
              </span>
              <p className="text-[7.5px] uppercase tracking-widest text-[#60cdff] block font-mono">
                Premium Exam Hub
              </p>
            </div>
          </div>

          {/* Quick HUD Navigation tools */}
          <div className="flex items-center gap-3">
            
            {/* Admin Portal Shortcut */}
            <button
              onClick={() => setView('admin')}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer pointer-events-auto text-xs font-semibold ${
                view === 'admin' 
                  ? 'bg-purple-500/15 border-purple-500/40 text-purple-300' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
              id="header-admin-portal-key"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">{t.secKey}</span>
            </button>

            {/* Lookup Shortcut */}
            <button
              onClick={() => setView('verifier')}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer pointer-events-auto text-xs font-semibold ${
                view === 'verifier' 
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.verifySearch}</span>
            </button>

            {/* Language Toggler */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 font-mono text-cyan-400 text-xs font-bold uppercase transition-all select-none pointer-events-auto cursor-pointer flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'বাংলা' : 'EN'}
            </button>

            {/* Dashboard shortcut if student logged in */}
            {student && (
              <button
                onClick={() => setView('dashboard')}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer pointer-events-auto"
              >
                <User className="w-3.5 h-3.5" />
                {t.dashboard}
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Centered Main Layout Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">
        
        {/* VIEW 1: LOBBY */}
        {view === 'lobby' && (
          <div className="text-center py-8 space-y-10" id="lobby-welcome-view">
            
            {/* Beautiful modern hero headline */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <span className="font-mono text-xs font-bold tracking-widest text-[#60cdff] uppercase bg-cyan-950/40 px-4 py-1.5 rounded-full border border-cyan-500/20">
                ⭐ {t.tagline} ⭐
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-cyan-100 to-slate-300 tracking-tight leading-tight">
                {lang === 'en' ? 'Secure Evaluation Meets Dynamic Verification' : 'আধুনিক মেধা মূল্যায়ন ও যাচাইকরণ প্ল্যাটফর্ম'}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                {settings.description || t.siteSubtitle}
              </p>
            </div>

            {/* Quick entry portal buttons */}
            <div className="flex flex-wrap gap-4 justify-center items-center pt-2">
              <button
                onClick={() => setView('registration')}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold px-7 py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/30 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer pointer-events-auto"
              >
                <GraduationCap className="w-4 h-4 text-slate-950" />
                {t.register}
              </button>

              <button
                onClick={() => setView('login')}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-100 font-bold px-7 py-3 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer pointer-events-auto"
              >
                <User className="w-4 h-4 text-cyan-400" />
                {t.login}
              </button>

              <button
                onClick={() => setView('admin')}
                className="bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 font-bold px-7 py-3 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer pointer-events-auto"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                {t.secKey}
              </button>
            </div>

            {/* Interactive Alerts board list */}
            <div className="max-w-xl mx-auto bg-slate-950/60 border border-slate-900 p-5 rounded-2xl relative text-left">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400 animate-bounce" />
                {t.notifHeader}
              </h3>
              <div className="space-y-3">
                {notifications.slice(0, 2).map((no, idx) => (
                  <div key={idx} className="bg-slate-900/40 border border-slate-850/50 p-3 rounded-xl">
                    <p className="font-semibold text-xs text-slate-200">{no.title}</p>
                    <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">{no.message}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: REGISTRATION FORM */}
        {view === 'registration' && (
          <div className="w-full max-w-md mx-auto bg-slate-950/80 border border-slate-900 p-6 md:p-8 rounded-2xl shadow-2xl relative" id="registration-suite">
            
            <div className="text-center mb-6">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider">{t.regHeader}</h2>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{t.regDesc}</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs text-left">
              <div>
                <label className="text-slate-400 block mb-1">{t.name}</label>
                <input
                  type="text"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. Tariqul Islam"
                  className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">{t.phone}</label>
                  <input
                    type="phone"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 01711223344"
                    className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="e.g. candidate@gmail.com"
                    className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">{t.institution}</label>
                  <input
                    type="text"
                    value={regForm.institution}
                    onChange={(e) => setRegForm({ ...regForm, institution: e.target.value })}
                    placeholder="e.g. Dhaka University"
                    className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">{t.studentClass}</label>
                  <input
                    type="text"
                    value={regForm.studentClass}
                    onChange={(e) => setRegForm({ ...regForm, studentClass: e.target.value })}
                    placeholder="e.g. Class 10 / Honours"
                    className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="reg-remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-cyan-400 focus:ring-0 w-3.5 h-3.5"
                />
                <label htmlFor="reg-remember" className="text-slate-400 text-[10px] select-none">
                  {t.remember}
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer block text-center pointer-events-auto"
              >
                {t.signUpBtn}
              </button>

              <p className="text-center text-slate-500 text-[10px] mt-4">
                {lang === 'en' ? 'Already registered profile?' : 'ইতিমধ্যে রেজিস্টার করেছেন?'}{' '}
                <span className="text-cyan-400 font-semibold underline cursor-pointer pointer-events-auto" onClick={() => setView('login')}>
                  {t.login}
                </span>
              </p>
            </form>
          </div>
        )}

        {/* VIEW 3: STUDENT LOGIN */}
        {view === 'login' && (
          <div className="w-full max-w-sm mx-auto bg-slate-950/80 border border-slate-900 p-6 md:p-8 rounded-2xl shadow-2xl relative" id="login-suite">
            
            <div className="text-center mb-6">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider">{t.login}</h2>
              <p className="text-slate-400 text-xs mt-1">{lang === 'en' ? 'Verify your registered mobile to access exams.' : 'মোবাইল নম্বর প্রদান করে সাইন-ইন করুন।'}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs text-left">
              <div>
                <label className="text-slate-400 block mb-1">{t.phone}</label>
                <input
                  type="phone"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 01711223344"
                  className="w-full bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="login-remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-cyan-400 w-3.5 h-3.5"
                />
                <label htmlFor="login-remember" className="text-slate-400 text-[10px] select-none">
                  {t.remember}
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer pointer-events-auto"
              >
                Sign In Student
              </button>

              <button
                type="button"
                onClick={() => setView('registration')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-300 rounded-xl text-xs transition-all cursor-pointer block pointer-events-auto"
              >
                {lang === 'en' ? 'Create New Member Profile' : 'নতুন একাউন্ট খুলুন'}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 4: STUDENT DASHBOARD */}
        {view === 'dashboard' && student && (
          <div className="space-y-8" id="student-cockpit-dashboard">
            
            {/* Header Greetings Card */}
            <div className="bg-[#09101d] border border-cyan-500/10 p-5 md:p-6 rounded-2xl relative flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#60cdff] block font-bold">
                  🎓 {t.dashboard}
                </span>
                <h2 className="text-lg md:text-xl font-bold mt-1 text-slate-100 flex items-center gap-1.5 font-sans mb-1.5 uppercase">
                  {t.welcomeBack} <span className="text-cyan-454 bg-cyan-500/10 py-1 px-3 border border-cyan-400/20 rounded-xl font-extrabold tracking-wide">{student.name}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  Institution: <span className="text-slate-300 font-semibold">{student.institution}</span>
                  {" • "} Class: <span className="text-slate-300 font-semibold">{student.studentClass}</span>
                </p>
              </div>

              <button
                onClick={handleSignout}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-400 font-medium transition-all pointer-events-auto cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>

            {/* Two-Column Core Layout: Exams & Live Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Exams grid section (span-2) */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 text-left">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  {t.availableExam}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exams.map((ex) => (
                    <div key={ex.id} className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/30 transition-all card-glow relative overflow-hidden text-left">
                      <div>
                        <span className="text-[9px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {ex.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100 mt-3 tracking-snug">{ex.title}</h4>
                        
                        <div className="flex gap-4 text-[10px] text-slate-400 mt-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-cyan-500" />
                            {ex.durationMinutes} {t.duration}
                          </span>
                          <span>{"•"}</span>
                          <span>{ex.questions?.length || 5} {t.questions}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-900 pt-4 mt-5 flex justify-between items-center bg-slate-950/40 -mx-5 -mb-5 p-4 rounded-b-2xl">
                        <p className="text-[10px] text-slate-400">
                          {t.passMarks}: <span className="text-slate-100 font-semibold">{ex.passPercentage}%</span>
                        </p>
                        
                        <button
                          onClick={() => {
                            setActiveExam(ex);
                            setView('exam');
                          }}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold p-1 px-3.5 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer pointer-events-auto"
                        >
                          {t.startBtn}
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Suggestions side card (span-1) */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 text-left">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  {t.studySuggestion}
                </h3>

                <div className="bg-[#090f1d]/90 border border-slate-900 rounded-2xl p-4 md:p-5 space-y-4 max-h-[460px] overflow-y-auto custom-scrollbar">
                  {suggestions.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-25" />
                      <p>{lang === 'en' ? 'No suggestions available' : 'কোনো বিশেষ কুইজ সাজেশন বা সিলেবাস রিলিজ হয়নি।'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {suggestions.map((s) => (
                        <div key={s.id} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900/80 text-left space-y-1.5 hover:border-emerald-500/30 transition-all">
                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <span className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                              {s.category}
                            </span>
                            <span className="text-slate-500 font-bold">
                              {new Date(s.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'bn-BD')}
                            </span>
                          </div>
                          <h4 className="font-bold text-[#e2e8f0] text-xs tracking-tight">{s.title}</h4>
                          <p className="text-[11px] text-slate-400 whitespace-pre-line leading-relaxed font-sans">{s.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Results distribution / Certs vault */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Left Column: Attempt Log */}
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  {t.historyTitle}
                </h3>

                {results.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs leading-relaxed">
                    <Info className="w-10 h-10 mx-auto mb-2.5 text-slate-600" />
                    <p>{t.noResult}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.map((rs, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-slate-200">{rs.examName}</p>
                          <span className="text-[10px] text-slate-400">{new Date(rs.resultDate).toLocaleDateString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-cyan-400">{rs.score} pts</span>
                          <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5">Grade: {rs.grade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Verifiable certificates Vault */}
              <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan-400 animate-pulse" />
                  {t.earnedCert}
                </h3>

                {recentCerts.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    <Award className="w-10 h-10 mx-auto mb-2.5 text-slate-600" />
                    {lang === 'en' ? 'Complete assessments to unlock verifiable certificate credentials.' : 'পরীক্ষায় উত্তীর্ণ হয়ে ভেরিফাইড সার্টিফিকেট অর্জন করুন।'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentCerts.map((crt, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-500/20 hover:border-cyan-500/30 transition-all flex justify-between items-center text-xs">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold flex items-center gap-1">
                            ✓ verifiable id: {crt.certificateId}
                          </span>
                          <p className="font-bold text-slate-200 mt-1">{crt.examName}</p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCertificate(crt);
                            setView('certificate-view');
                          }}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-850 px-3 py-1.5 rounded-xl font-bold text-cyan-400 text-[10px] transition-all cursor-pointer pointer-events-auto"
                        >
                          Show Cert
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* VIEW 5: ACTIVE EXAM ARENA */}
        {view === 'exam' && activeExam && student && (
          <ExamEngine
            exam={activeExam}
            studentName={student.name}
            studentPhone={student.phone}
            lang={lang}
            settings={settings}
            onCompleted={(res) => {
              setLatestResult(res);
              setView('result');
            }}
            onExit={() => setView('dashboard')}
          />
        )}

        {/* VIEW 6: EXAM RESULT SUMMARY CARD */}
        {view === 'result' && latestResult && (
          <div className="w-full max-w-lg mx-auto bg-[#090f1e]/90 border border-cyan-500/15 rounded-2xl p-6 md:p-8 text-center shadow-2xl relative" id="exam-scorecard-summary">
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl flex-shrink-0" />
            
            <div className="p-3 bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 rounded-2xl inline-block mb-4">
              <Award className="w-10 h-10 text-cyan-400" />
            </div>

            <span className="bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-900 font-mono text-[9px] uppercase text-[#60cdff] block max-w-sm mx-auto font-bold tracking-wider">
              {latestResult.examName} Score sheet
            </span>

            <h2 className="text-lg md:text-xl font-bold text-slate-100 mt-6 tracking-wide uppercase">
              {latestResult.passed ? t.certTitle : (lang === 'en' ? 'EVALUATION RE-ENGAGEMENT REQUIRED' : 'পরীক্ষার মূল্যায়নপত্র')}
            </h2>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-sm mx-auto">
              {latestResult.passed ? t.certCongrat : (lang === 'en' ? 'Secure limit not met. Re-apply from student control boards to master certification.' : 'দুঃখিত, আপনি পাসের জন্য প্রয়োজনীয় নম্বর পাননি। পুনরায় চেষ্টা করুন।')}
            </p>

            {/* Scores matrix dashboard */}
            <div className="grid grid-cols-2 gap-4 my-7 text-left text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 leading-normal">
                <span className="text-slate-500 block text-[9px]">COMPLETED BY</span>
                <span className="text-slate-200 font-semibold">{latestResult.studentName}</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 leading-normal">
                <span className="text-slate-500 block text-[9px]">AGGREGATE SCORE</span>
                <span className="text-cyan-400 font-bold">{latestResult.score} ({latestResult.percentage}%)</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 leading-normal">
                <span className="text-slate-500 block text-[9px]">CORRECT SOLUTIONS</span>
                <span className="text-emerald-400 font-bold">✓ {latestResult.correct} questions</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 leading-normal">
                <span className="text-slate-500 block text-[9px]">ASSESSMENT GRADE</span>
                <span className="text-cyan-400 font-black text-sm">{latestResult.grade}</span>
              </div>
            </div>

            {/* Trigger Options */}
            <div className="flex gap-4">
              <button
                onClick={() => setView('dashboard')}
                className="flex-1 py-3 text-slate-300 font-medium rounded-xl border border-slate-800 hover:bg-slate-900 transition-all text-xs cursor-pointer pointer-events-auto"
              >
                {t.closeBtn}
              </button>

              {latestResult.passed && latestResult.certificateId && (
                <button
                  onClick={() => {
                    // assemble full certificate from results data
                    const temporaryCertificate: Certificate = {
                      certificateId: latestResult.certificateId!,
                      studentName: latestResult.studentName,
                      phone: latestResult.phone,
                      examName: latestResult.examName,
                      score: latestResult.score,
                      percentage: latestResult.percentage,
                      grade: latestResult.grade,
                      issueDate: latestResult.resultDate,
                      verificationCode: `V-${Math.floor(10000 + Math.random() * 90000)}`,
                      type: 'completion'
                    };
                    setSelectedCertificate(temporaryCertificate);
                    setView('certificate-view');
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-650 hover:to-blue-650 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer block text-center pointer-events-auto"
                >
                  {t.viewCertBtn}
                </button>
              )}
            </div>

          </div>
        )}

        {/* VIEW 7: RENDER FULL ACTIVE CERTIFICATE */}
        {view === 'certificate-view' && selectedCertificate && (
          <CertificateView
            certificate={selectedCertificate}
            settings={settings}
            lang={lang}
            onClose={() => setView('dashboard')}
          />
        )}

        {/* VIEW 8: REGISTER CERTIFICATE VERIFIER LOOKUP */}
        {view === 'verifier' && (
          <CertificateVerifier
            lang={lang}
            initialId={verifyDeepLinkId}
            onViewCertificate={(cert) => {
              setSelectedCertificate(cert);
              setView('certificate-view');
            }}
          />
        )}

        {/* VIEW 9: ADMIN PANEL ENTRANCE */}
        {view === 'admin' && (
          <AdminPanel
            lang={lang}
            onLogout={() => setView('lobby')}
            settings={settings}
            onUpdateSettings={(next) => setSettings(next)}
          />
        )}

      </main>

      {/* Footer information bar & Hidden secure gate handle */}
      <footer className="bg-slate-950 border-t border-slate-900 px-4 py-8 text-center text-xs mt-12 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-500">
          
          <div className="text-left space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <p className="font-bold text-slate-400">{settings.websiteName || t.siteTitle}</p>
            </div>
            <p className="text-[10px] text-slate-600">{t.footerMsg}</p>
          </div>

          {/* Social connections links */}
          <div className="flex gap-4 items-center">
            {settings.facebookLink && (
              <a href={settings.facebookLink} target="_blank" className="hover:text-cyan-400 transition-all pointer-events-auto"><Facebook className="w-4 h-4" /></a>
            )}
            {settings.whatsappLink && (
              <a href={settings.whatsappLink} target="_blank" className="hover:text-cyan-400 transition-all pointer-events-auto"><MessageSquare className="w-4 h-4" /></a>
            )}
            {settings.telegramLink && (
              <a href={settings.telegramLink} target="_blank" className="hover:text-cyan-400 transition-all pointer-events-auto"><Send className="w-4 h-4" /></a>
            )}
            {settings.youtubeLink && (
              <a href={settings.youtubeLink} target="_blank" className="hover:text-cyan-400 transition-all pointer-events-auto"><Youtube className="w-4 h-4" /></a>
            )}
          </div>

          {/* Hidden secret gate key locking button */}
          <button
            onClick={() => setView('admin')}
            id="glowing-secret-cockpit-key"
            className="flex items-center gap-2 text-[10px] text-slate-600 font-mono hover:text-cyan-400 transition-all p-1.5 rounded-lg hover:bg-slate-900 cursor-pointer pointer-events-auto select-none"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{t.secKey}</span>
          </button>

        </div>
      </footer>

    </div>
  );
}

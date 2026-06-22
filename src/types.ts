/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string; // ID
  category: string; // ক্যাটাগরি
  questionText: string; // প্রশ্ন
  optionA: string; // অপশন A
  optionB: string; // অপশন B
  optionC: string; // অপশন C
  optionD: string; // অপশন D
  correctAnswer: 'A' | 'B' | 'C' | 'D'; // সঠিক উত্তর
  marks: number; // মার্কস
  status: 'Published' | 'Draft'; // স্ট্যাটাস
}

export interface Student {
  id: string; // ID
  name: string; // নাম
  phone: string; // ফোন
  email: string; // ইমেইল
  institution: string; // প্রতিষ্ঠান
  studentClass: string; // ক্লাস
  registrationDate: string; // রেজিস্ট্রেশন তারিখ
}

export interface Exam {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  passPercentage: number;
  questions: Question[];
  status: 'Published' | 'Draft';
}

export interface ExamResult {
  id: string; // ID
  studentName: string; // শিক্ষার্থীর নাম
  phone: string; // ফোন
  examName: string; // পরীক্ষার নাম
  score: number; // স্কোর
  correct: number; // সঠিক
  incorrect: number; // ভুল
  percentage: number; // শতাংশ
  grade: string; // গ্রেড
  resultDate: string; // ফলাফল তারিখ
  passed: boolean;
  certificateId?: string; // সার্টিফিকেট আইডি
}

export interface Certificate {
  certificateId: string; // সার্টিফিকেট আইডি
  studentName: string; // শিক্ষার্থীর নাম
  phone: string; // ফোন/স্টুডেন্ট আইডি রোল
  examName: string; // পরীক্ষার নাম
  score: number; // স্কোর
  percentage: number; // শতাংশ
  grade: string; // গ্রেড
  issueDate: string; // ইস্যু তারিখ
  verificationCode: string; // ভেরিফিকেশন কোড
  type: 'participation' | 'completion' | 'achievement'; // টাইপ (অংশগ্রহণ, সম্পন্ন, অর্জন)
}

export interface Notification {
  title: string; // শিরোনাম
  message: string; // বার্তা
  date: string; // তারিখ
}

export interface AdminSettings {
  websiteName: string;
  logoUrl: string;
  contactNumber: string;
  facebookLink: string;
  whatsappLink: string;
  telegramLink: string;
  youtubeLink: string;
  themeColor: string; // 'cyan' | 'emerald' | 'violet' | 'amber'
  adminPin: string;
  passcode: string;
  signatureUrl: string; // অ্যাডমিন স্বাক্ষর url
  certificateDesign: 'standard' | 'premium' | 'modern';
  timerEnabled: boolean; // প্রতিটি প্রশ্নের জন্য টাইমার সচল কিনা
  timerSeconds: number; // টাইমারের মেয়াদ (সেকেন্ড)
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  device: string;
}

export interface ExamSuggestion {
  id: string; // আইডি
  title: string; // শিরোনাম
  category: string; // ক্যাটাগরি
  content: string; // নির্দেশনা বা সাজেশনের বিষয়বস্তু
  date: string; // যোগ করার তারিখ
}

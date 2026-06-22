/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, Exam, Notification, AdminSettings, ExamSuggestion } from './types';

export const SAMPLE_QUESTIONS: Question[] = [
  // Web Development
  {
    id: 'q-101',
    category: 'Web Development',
    questionText: 'What does CSS stand for?',
    optionA: 'Counter Style Sheets',
    optionB: 'Cascading Style Sheets',
    optionC: 'Computer Style Sheets',
    optionD: 'Colorful Style Sheets',
    correctAnswer: 'B',
    marks: 5,
    status: 'Published'
  },
  {
    id: 'q-102',
    category: 'Web Development',
    questionText: 'Which HTML element is used to link an external Javascript file?',
    optionA: '<script href="file.js">',
    optionB: '<js src="file.js">',
    optionC: '<script src="file.js">',
    optionD: '<link rel="js" href="file.js">',
    correctAnswer: 'C',
    marks: 5,
    status: 'Published'
  },
  {
    id: 'q-103',
    category: 'Web Development',
    questionText: 'Which of the following is NOT a React Hook?',
    optionA: 'useState',
    optionB: 'useEffect',
    optionC: 'useFetch',
    optionD: 'useContext',
    correctAnswer: 'C',
    marks: 5,
    status: 'Published'
  },
  {
    id: 'q-104',
    category: 'Web Development',
    questionText: 'What is the correct port for HTTP protocols by default?',
    optionA: '80',
    optionB: '443',
    optionC: '3000',
    optionD: '8080',
    correctAnswer: 'A',
    marks: 5,
    status: 'Published'
  },

  // General Knowledge (GK)
  {
    id: 'q-201',
    category: 'General Knowledge',
    questionText: 'What is the capital city of Bangladesh?',
    optionA: 'Sylhet',
    optionB: 'Chittagong',
    optionC: 'Dhaka',
    optionD: 'Rajshahi',
    correctAnswer: 'C',
    marks: 5,
    status: 'Published'
  },
  {
    id: 'q-202',
    category: 'General Knowledge',
    questionText: 'Who wrote the national anthem of Bangladesh?',
    optionA: 'Kazi Nazrul Islam',
    optionB: 'Rabindranath Tagore',
    optionC: 'Jibanananda Das',
    optionD: 'Jasmin Uddin',
    correctAnswer: 'B',
    marks: 5,
    status: 'Published'
  },
  {
    id: 'q-203',
    category: 'General Knowledge',
    questionText: 'Which is the largest mangrove forest in the world?',
    optionA: 'Amazon Rainforest',
    optionB: 'Sundarbans',
    optionC: 'Madagascar Mangroves',
    optionD: 'Florida Mangroves',
    correctAnswer: 'B',
    marks: 5,
    status: 'Published'
  },

  // Science & Tech
  {
    id: 'q-301',
    category: 'Science & Technology',
    questionText: 'Which element has the chemical symbol "O"?',
    optionA: 'Osmium',
    optionB: 'Ozone',
    optionC: 'Oxygen',
    optionD: 'Gold',
    correctAnswer: 'C',
    marks: 5,
    status: 'Published'
  },
  {
    id: 'q-302',
    category: 'Science & Technology',
    questionText: 'What is the speed of light in vacuum?',
    optionA: '300,000 km/s',
    optionB: '150,000 km/s',
    optionC: '500,000 km/s',
    optionD: '1,000,000 km/s',
    correctAnswer: 'A',
    marks: 5,
    status: 'Published'
  },
  {
    id: 'q-303',
    category: 'Science & Technology',
    questionText: 'Who is known as the father of modern computer science?',
    optionA: 'Charles Babbage',
    optionB: 'Alan Turing',
    optionC: 'Bill Gates',
    optionD: 'Ada Lovelace',
    correctAnswer: 'B',
    marks: 5,
    status: 'Published'
  }
];

export const SAMPLE_EXAMS: Exam[] = [
  {
    id: 'ex-1',
    title: 'Modern Web Development Basics',
    category: 'Web Development',
    durationMinutes: 10,
    passPercentage: 60,
    questions: SAMPLE_QUESTIONS.filter(q => q.category === 'Web Development'),
    status: 'Published'
  },
  {
    id: 'ex-2',
    title: 'Bangladesh History & Heritage',
    category: 'General Knowledge',
    durationMinutes: 5,
    passPercentage: 50,
    questions: SAMPLE_QUESTIONS.filter(q => q.category === 'General Knowledge'),
    status: 'Published'
  },
  {
    id: 'ex-3',
    title: 'General Science Fundamental',
    category: 'Science & Technology',
    durationMinutes: 8,
    passPercentage: 70,
    questions: SAMPLE_QUESTIONS.filter(q => q.category === 'Science & Technology'),
    status: 'Published'
  }
];

export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    title: '🎉 Welcome to Smart Quiz Pro',
    message: 'We are thrilled to launch this premium, fast, and secure quiz and certification platform. Check out your available exams!',
    date: '2026-06-21T08:00:00Z'
  },
  {
    title: '📝 New Exam Scheduled!',
    message: 'A brand-new exam "Modern Web Development Basics" has just been released. Finish it today to collect your dynamic digital completion certificate.',
    date: '2026-06-21T07:45:00Z'
  },
  {
    title: '⚠️ System Update Notification',
    message: 'The Anti-Cheat system has been upgraded. Full screen access is now required to initiate exams. Tab switching is monitored, and 3 triggers will trigger auto-submission.',
    date: '2026-06-21T06:30:00Z'
  }
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  websiteName: 'Smart Quiz Pro',
  logoUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=40px&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // premium graduation cap icon stylized
  contactNumber: '+8801712345678',
  facebookLink: 'https://facebook.com/smartquizpro',
  whatsappLink: 'https://wa.me/8801712345678',
  telegramLink: 'https://t.me/smartquizpro',
  youtubeLink: 'https://youtube.com/c/smartquizpro',
  themeColor: 'cyan', // cyan theme, premium glow
  adminPin: '1122', // Security pincode
  passcode: 'admin1122', // Admin Password
  signatureUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&auto=format&fit=crop&q=80', // Admin handwritten generic signature
  certificateDesign: 'premium',
  timerEnabled: false, // ডিফল্টভাবে নিষ্ক্রিয়
  timerSeconds: 15 // ডিফল্ট ১৫ সেকেন্ড
};

export const SAMPLE_SUGGESTIONS: ExamSuggestion[] = [
  {
    id: 'sug-1',
    title: 'পরীক্ষায় ভালো স্কোর করার সেরা কৌশল',
    category: 'General Tips',
    content: '১. প্রতিটি প্রশ্ন মনোযোগ সহকারে পড়তে হবে।\n২. সময়ের সঠিক বণ্টন খুব জরুরি (টাইমার অন থাকলে দ্রুত উত্তর করুন)।\n৩. ভুল উত্তর দিয়ে সময় অপচয় না করে পরবর্তী প্রশ্নে এগিয়ে যান।\n৪. শান্ত ও নিরিবিলি পরিবেশে বসে কুইজ শুরু করুন।',
    date: '2026-06-21T08:10:00Z'
  },
  {
    id: 'sug-2',
    title: 'Web Development কুইজ গাইডলাইন ও সিলেবাস',
    category: 'Web Development',
    content: 'এই পরীক্ষাটিতে ভালো করতে হলে নিচের বিষয়গুলো রিভিশন করুন:\n- HTML5 নতুন ট্যাগসমূহ (<article>, <section>, <nav>)\n- CSS3 Flexbox এবং Grid লেআউট সিস্টেম\n- Javascript ES6+ মেথডসমূহ (map, filter, reduce, promises)\n- React Fundamentals এবং Hooks (useState, useEffect, useContext)',
    date: '2026-06-21T08:15:00Z'
  }
];

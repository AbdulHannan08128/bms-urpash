import React from 'react'
import AnalysisDashboard from './AnalysisDashboard'

export const metadata = {
  title: 'Session Exam Intelligence & Analytics | BMS Urpash',
  description: 'Comprehensive academic session performance analytics, trends, merit leaderboards, and subject mastery breakdown.',
}

export default function ExamAnalysisPage() {
  return <AnalysisDashboard initialUrl={process.env.add_Exam_URL || '/api/exams/BULK'} />
}

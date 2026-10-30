import React from 'react'
import Title from '../../title/Title'
import AnalysisDashboard from './AnalysisDashboard'

export const metadata = {
  title: 'Session Exam Intelligence & Analytics | BMS Urpash',
  description: 'Comprehensive academic session performance analytics, trends, merit leaderboards, and subject mastery breakdown.',
}

export default function ExamAnalysisPage() {
  return (
    <>
      <Title title="Session Exam Intelligence & Analytics" />
      <AnalysisDashboard initialUrl={process.env.add_Exam_URL || '/api/exams/BULK'} />
    </>
  )
}

import React from 'react'
import SESSION from './SESSION'
import Title from '../../title/Title'
export default function page() {
  return (
    <>
    <Title title="Print Session Marks Card"/>
    <SESSION URL={process.env.add_Exam_URL}/>
    </>
  )
}

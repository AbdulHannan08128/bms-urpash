import React from 'react'
import Title from '../../title/Title'
import Toggle from './Toggle'
export default function page() {
  return (
    <>
    <Title title='Add New Exam'/>
    
    <Toggle BULK_URL={process.env.add_Exam_URL} ADD_POST_URL={process.env.ADD_POST_URL}/>
    </>
  )
}

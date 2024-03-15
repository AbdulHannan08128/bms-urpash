import React from 'react'
import Table from './Table'
import Title from '../../title/Title'
export default function page({params}) {
  return (
    <>
    <Title title="Inspect Exam"/>
    <Table url={process.env.add_Exam_URL} id={params.ID}/>
    </>
  )
}

import React from 'react'
import Card from './Card'
export default function page({params}) {
  return (
    <>
   
    <Card admission={params.admission} URL_1={process.env.BULK_URL} URL_2={process.env.add_Exam_URL}/>
    </>
    
  )
}

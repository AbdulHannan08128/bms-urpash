import React from 'react'
import Card from './CARD_2024.jsx'
export default function page({params}) {
  return (
    <>
   
    <Card YEAR={params.YEAR} URL_1={process.env.BULK_URL} URL_2={process.env.add_Exam_URL}/>
    </>
    
  )
}

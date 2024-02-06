import React from 'react'
import ExcelForm from './excelForm'
export default function page() {
  return (
    <ExcelForm BULK_URL={process.env.BULK_URL}/>
  )
}

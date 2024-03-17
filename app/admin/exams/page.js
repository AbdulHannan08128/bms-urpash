import React from 'react'
import Title from '../title/Title'
import Link from 'next/link'
import Exams from './Exams'
export default function page() {
  return (
    <>
    <Title title='Exams'/>
    <div className="flex flex-wrap md:flex-row gap-6 max-w-3xl mx-auto mt-2 p-5" style={{flexWrap:'wrap'}}>
        {/* Teacher Card */}
        <div className="flex-1">
          <div className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <Link href='/admin/exams/add' className='block p-6'>
              
                <div className="uppercase text-sm text-indigo-500 font-semibold">/Add</div>
                <p className='text-lg font-medium mt-2 hover:underline'>Add New Exam</p>
                <p className='text-gray-600 mt-2'>Add an exam by importing an excel file or manually.</p>
              
            </Link>
          </div>
        </div>
       
        {/* Session Card */}
        <div className="flex-1">
          <div className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <Link href='/admin/checklist/session' className='block p-6'>
              
                <div className="uppercase text-sm text-indigo-500 font-semibold">/Session</div>
                <p className='text-lg font-medium mt-2 hover:underline'>Print Marks Cards Yearly</p>
                <p className='text-gray-600 mt-2'>Get print preview of the marks card and save it as a pdf.</p>
              
            </Link>
          </div>
        </div>
      </div>



<Exams url={process.env.add_Exam_URL}/>



    </>
    
  )
}

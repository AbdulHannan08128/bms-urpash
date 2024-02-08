import React from 'react'
import Title from '../title/Title'
import Link from 'next/link'
import Checklist from './checklist'
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;
export default function page() {

  return (
    <>

    <Title title='Checklist'/>
    <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto mt-2 p-5">
        {/* Teacher Card */}
        <div className="flex-1">
          <div className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <Link href='/admin/checklist/add' className='block p-6'>
              
                <div className="uppercase text-sm text-indigo-500 font-semibold">/Add</div>
                <p className='text-lg font-medium mt-2 hover:underline'>Add Students</p>
                <p className='text-gray-600 mt-2'>Add students by importing an excel file or manually.</p>
              
            </Link>
          </div>
        </div>
        {/* Student Card */}
        <div className="flex-1">
          <div className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <Link href='/admin/checklist/print' className='block p-6'>
              
                <div className="uppercase text-sm text-indigo-500 font-semibold">/Print</div>
                <p className='text-lg font-medium mt-2 hover:underline'>Print Checklist</p>
                <p className='text-gray-600 mt-2'>Get print preview of this checklist and save it as a pdf.</p>
              
            </Link>
          </div>
        </div>
      </div>


<Checklist URL={process.env.BULK_URL}/>


      
    </>
    
  )
}

import React from 'react';
import Title from '../title/Title';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <Title title='Accounts' />
      <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto mt-2 p-5">
        {/* Teacher Card */}
        <div className="flex-1">
          <div className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <Link href='/admin/accounts/teachers' className='block p-6'>
              
                <div className="uppercase text-sm text-indigo-500 font-semibold">/Teacher</div>
                <p className='text-lg font-medium mt-2 hover:underline'>Manage Teacher Accounts</p>
                <p className='text-gray-600 mt-2'>View and manage accounts of teachers.</p>
              
            </Link>
          </div>
        </div>
        {/* Student Card */}
        <div className="flex-1">
          <div className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
            <Link href='/admin/accounts/students' className='block p-6'>
              
                <div className="uppercase text-sm text-indigo-500 font-semibold">/Students</div>
                <p className='text-lg font-medium mt-2 hover:underline'>Manage Student Accounts</p>
                <p className='text-gray-600 mt-2'>View and manage accounts of students.</p>
              
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

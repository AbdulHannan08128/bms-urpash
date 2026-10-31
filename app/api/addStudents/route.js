import {NextResponse} from 'next/server';

import connectDB from '@/utils/db';
import getStudents from '../../../dbfunctions/getStudent'
import {addStudents} from '../../../dbfunctions/addStudent'
connectDB();
// addStudents([data]);
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req){
    let id = req.nextUrl.searchParams.get('id');
    let grade = req.nextUrl.searchParams.get('grade');
    let admission = req.nextUrl.searchParams.get('admission');
    let students;

    if (id) {
      try {
        const single = await getStudents({ _id: id });
        students = Array.isArray(single) ? single : (single ? [single] : []);
      } catch (err) {
        students = [];
      }
    }
    else if (grade && admission) {
      const admStr = String(admission).trim();
      students = await getStudents({
        grade: grade,
        $or: [
          { admission: admStr },
          ...(!isNaN(Number(admStr)) ? [{ admission: Number(admStr) }] : [])
        ]
      });
    }
    else if (grade) {
      students = await getStudents({grade:grade});
    }
    else if (admission) {
      const admStr = String(admission).trim();
      students = await getStudents({
        $or: [
          { admission: admStr },
          ...(!isNaN(Number(admStr)) ? [{ admission: Number(admStr) }] : [])
        ]
      });
    }
    else {
      students = await getStudents({});
    }

  return NextResponse.json(students, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}

export async function POST(req){
    let data = await req.json();
   addStudents(data);
   return NextResponse.json({status:200})
}
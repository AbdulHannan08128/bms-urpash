import {NextResponse} from 'next/server';

import connectDB from '@/utils/db';
import getStudents from '../../../dbfunctions/getStudent'
import {addStudents} from '../../../dbfunctions/addStudent'
connectDB();
// addStudents([data]);
export async function GET(req){
    let grade = req.nextUrl.searchParams.get('grade');
    let admission = req.nextUrl.searchParams.get('admission');
    let students
    if (grade) {
      students = await getStudents({grade:grade});
    }

  else if(admission) {
    students = await getStudents({admission:admission});
  }
  else{
    students = await getStudents({});
 }


  return NextResponse.json(students);
    

}

export async function POST(req){
    let data = await req.json();
   addStudents(data);
   return NextResponse.json({status:200})
}
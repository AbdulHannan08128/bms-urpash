import {NextResponse} from 'next/server';
import { addExam } from '@/dbfunctions/addExam';
import connectDB from '@/utils/db';
import getExams from '@/dbfunctions/getExam';
connectDB();
// addStudents([data]);
export async function GET(){
  
let exams =  await getExams();
console.log(exams);
 return NextResponse.json(exams);


}

export async function POST(req){
  let Data = await req.json();
  const [name, year, marks, data] = Data;
  console.log(name);
  console.log(year);
  console.log(marks);
  console.log(Data);
  addExam({name, year, marks, data})
  return NextResponse.json({exam:'add'})
}
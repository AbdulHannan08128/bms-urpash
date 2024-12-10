import {NextResponse} from 'next/server';
import connectDB from '@/utils/db';
import getExams from '@/dbfunctions/getExam';
connectDB();

export async function GET(req){
    let grade = req.nextUrl.searchParams.get('class');
    let year = req.nextUrl.searchParams.get('year');
   
  
  
  if (grade && year) {
    let exams =  await getExams({year: year});
    console.log(exams);
    return NextResponse.json(exams);
    
  }
  
  
  
  }
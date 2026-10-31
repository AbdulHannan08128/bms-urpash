import {NextResponse} from 'next/server';
import { addExam } from '@/dbfunctions/addExam';
import connectDB from '@/utils/db';
import getExams from '@/dbfunctions/getExam';
connectDB();
// addStudents([data]);
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(req){
  let slug = req.nextUrl.searchParams.get('slug');
  let year = req.nextUrl.searchParams.get('year');

  if (slug) {
    let exams = await getExams({url:slug});
    return NextResponse.json(exams, { headers: noCacheHeaders });
  }
  else if (year) {
    let exams = await getExams({year:year});
    return NextResponse.json(exams, { headers: noCacheHeaders });
  }
  else{
    let exams = await getExams({});
    return NextResponse.json(exams, { headers: noCacheHeaders });
  }
}

export async function POST(req){
  let Data = await req.json();
  const [url,name, year, marks, data, passPercentage, shortName] = Data;
  console.log(url);
  console.log(name); 
  console.log(year);
  console.log(marks);
  console.log(Data);
  addExam({url,name, year, marks, data, passPercentage, shortName});
  return NextResponse.json({exam:'add'})
}
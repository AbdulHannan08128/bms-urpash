import {NextResponse} from 'next/server';
import { addExam } from '@/dbfunctions/addExam';
import connectDB from '@/utils/db';
import getExams from '@/dbfunctions/getExam';
connectDB();
// addStudents([data]);
export async function GET(req){
  let slug = req.nextUrl.searchParams.get('slug');
  let year = req.nextUrl.searchParams.get('year');
 


if (slug) {
  let exams =  await getExams({url:slug});
  console.log(exams);
  return NextResponse.json(exams);
  
}
else if (year) {
  let exams =  await getExams({year:year});
  console.log(exams);
  return NextResponse.json(exams);
  
}

else{
  let exams =  await getExams({});
 return NextResponse.json(exams);
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
import {NextResponse} from 'next/server';

import connectDB from '@/utils/db';
import getStudent from '../../../dbfunctions/getStudent'
import updateStudent from '../../../dbfunctions/updateStudent'
connectDB();
// addStudents([data]);
export async function GET(req){
   


  return NextResponse.json({status:200});
    

}

export async function POST(req){
  let data = await req.formData();
  let file = data.get('photo');

  
  async function noPhoto(){
    const student = await getStudent({admission:data.get('admission')});
    const newStudent = {
      roll: data.get('roll'),
      admission: data.get('admission'),
      aadhar: data.get('aadhar'),
      name: data.get('name'),
      father: data.get('father'),
      mother: data.get('mother'),
      category: data.get('category'),
      grade: data.get('grade'),
      dob: data.get('dob'),
      phone: data.get('phone'),
      email: data.get('email'),
      photo: student.photo,
      address: data.get('address'),
      account: data.get('account')
    };

    await updateStudent(data.get('admission'),newStudent);
    return NextResponse.json({status:200});
  }



  async function isFile(){const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    
    const base64Image = buffer.toString("base64");



    
    // Create a new object without the photo property
    
    
    const newStudent = {
      roll: data.get('roll'),
      admission: data.get('admission'),
      aadhar: data.get('aadhar'),
      name: data.get('name'),
      father: data.get('father'),
      mother: data.get('mother'),
      category: data.get('category'),
      grade: data.get('grade'),
      dob: data.get('dob'),
      phone: data.get('phone'),
      email: data.get('email'),
      photo: base64Image,
      address: data.get('address'),
      account: data.get('account')
    };

    await updateStudent(data.get('admission'),newStudent)
    return NextResponse.json({ status: 200 });
  }




  try {
    await isFile();
  } catch (error) {
    await noPhoto();
  }
  return NextResponse.json({status:200})

  
  
}

import {NextResponse} from 'next/server';

import connectDB from '@/utils/db';
import {addStudents} from '../../../dbfunctions/addStudent'
connectDB();
// addStudents([data]);
export async function GET(){
    
    return NextResponse.json({success:'working/addStudents'});

}

export async function POST(req){
    let data = await req.json();
   addStudents(data);
   return NextResponse.json({status:200})
}
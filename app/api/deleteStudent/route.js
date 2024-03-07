import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import deleteStudent from '../../../dbfunctions/deleteStudent';

connectDB();

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Extract admission number from the request body
   const admissionNumber = data;
   console.log(admissionNumber);

    // Call deleteStudent function to delete the student
    const deletedStudent = await deleteStudent(admissionNumber);

    console.log('Student deleted:', deletedStudent);
    
    // Return success response
    return NextResponse.json({ success: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error.message);
    
    // Return error response
    return NextResponse.error(new Error('Failed to delete student'));
  }
}

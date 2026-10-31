import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Student from '@/models/students';
import { updateStudentInExams } from '../../../dbfunctions/updateStudent';

export async function GET(req) {
  return NextResponse.json({ status: 200 });
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.formData();

    const studentId = (data.get('studentId') || data.get('id') || '').toString().trim();
    const rawOldAdmission = data.get('oldAdmission');
    const rawNewAdmission = data.get('admission');
    const studentGrade = (data.get('grade') || '').toString().trim();

    // Use oldAdmission if provided, else fallback to new admission
    const oldAdmission = (rawOldAdmission || rawNewAdmission || '').toString().trim();
    const newAdmission = (rawNewAdmission || rawOldAdmission || '').toString().trim();

    if (!studentId && !oldAdmission) {
      return NextResponse.json(
        { status: 400, error: 'Student ID or Admission number is required' },
        { status: 400 }
      );
    }

    let existingStudent = null;

    // 1. Try finding by unique _id first (most reliable, prevents any duplicate admission collisions)
    if (studentId) {
      try {
        existingStudent = await Student.findById(studentId);
      } catch (err) {
        // If studentId was not a valid ObjectId, proceed to fallback lookups
      }
    }

    // 2. Disambiguate by admission + grade if both available
    if (!existingStudent && oldAdmission && studentGrade) {
      existingStudent = await Student.findOne({
        grade: studentGrade,
        $or: [
          { admission: oldAdmission },
          ...(!isNaN(Number(oldAdmission)) ? [{ admission: Number(oldAdmission) }] : [])
        ]
      });
    }

    // 3. Search query for the existing student by old admission
    if (!existingStudent && oldAdmission) {
      const searchCondition = {
        $or: [
          { admission: oldAdmission },
          ...(!isNaN(Number(oldAdmission)) ? [{ admission: Number(oldAdmission) }] : [])
        ]
      };
      existingStudent = await Student.findOne(searchCondition);
    }

    // 4. Fallback search by new admission
    if (!existingStudent && newAdmission && newAdmission !== oldAdmission) {
      existingStudent = await Student.findOne({
        $or: [
          { admission: newAdmission },
          ...(!isNaN(Number(newAdmission)) ? [{ admission: Number(newAdmission) }] : [])
        ]
      });
    }

    if (!existingStudent) {
      return NextResponse.json(
        { status: 404, error: `Student with admission "${oldAdmission}" not found` },
        { status: 404 }
      );
    }

    // Photo handling
    let file = data.get('photo');
    let photoBuffer = existingStudent.photo; // preserve existing photo by default

    // Only update photo if an actual file was selected
    if (
      file &&
      typeof file === 'object' &&
      typeof file.arrayBuffer === 'function' &&
      file.size > 0
    ) {
      try {
        const byteData = await file.arrayBuffer();
        photoBuffer = Buffer.from(byteData);
      } catch (photoErr) {
        console.error('Error processing uploaded photo:', photoErr);
      }
    }

    const newStudentData = {
      roll: data.get('roll') ?? existingStudent.roll,
      admission: newAdmission,
      aadhar: data.get('aadhar') ?? existingStudent.aadhar,
      name: data.get('name') ?? existingStudent.name,
      father: data.get('father') ?? existingStudent.father,
      mother: data.get('mother') ?? existingStudent.mother,
      category: data.get('category') ?? existingStudent.category,
      grade: data.get('grade') ?? existingStudent.grade,
      dob: data.get('dob') ?? existingStudent.dob,
      phone: data.get('phone') ?? existingStudent.phone,
      email: data.get('email') ?? existingStudent.email,
      photo: photoBuffer,
      address: data.get('address') ?? existingStudent.address,
      account: data.get('account') ?? existingStudent.account
    };

    // Update the student document in MongoDB
    const updatedStudent = await Student.findByIdAndUpdate(
      existingStudent._id,
      newStudentData,
      { new: true }
    );

    // Propagate student updates across all exam records, scoped to student's class
    const examUpdates = await updateStudentInExams(
      oldAdmission,
      {
        admission: newAdmission,
        name: newStudentData.name,
        father: newStudentData.father
      },
      existingStudent.grade || studentGrade
    );

    return NextResponse.json({
      status: 200,
      message: 'Student updated successfully',
      student: {
        id: updatedStudent._id,
        admission: updatedStudent.admission,
        name: updatedStudent.name
      },
      examUpdates
    });
  } catch (error) {
    console.error('Error in /api/updateStudent:', error);
    return NextResponse.json(
      { status: 500, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

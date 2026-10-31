import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Student from '@/models/students';
import { updateAdmissionInExams } from '../../../dbfunctions/updateStudent';

export async function GET(req) {
  return NextResponse.json({ status: 200 });
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.formData();

    const rawOldAdmission = data.get('oldAdmission');
    const rawNewAdmission = data.get('admission');

    // Use oldAdmission if provided, else fallback to new admission
    const oldAdmission = (rawOldAdmission || rawNewAdmission || '').toString().trim();
    const newAdmission = (rawNewAdmission || rawOldAdmission || '').toString().trim();

    if (!oldAdmission) {
      return NextResponse.json(
        { status: 400, error: 'Admission number is required' },
        { status: 400 }
      );
    }

    // Search query for the existing student
    const searchCondition = {
      $or: [
        { admission: oldAdmission },
        ...(!isNaN(Number(oldAdmission)) ? [{ admission: Number(oldAdmission) }] : [])
      ]
    };

    let existingStudent = await Student.findOne(searchCondition);

    // If not found by old admission, fallback search by new admission
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

    // If admission number was changed, propagate update across all exam records
    let examUpdates = { updatedExamsCount: 0, updatedRecordsCount: 0 };
    if (newAdmission && oldAdmission !== newAdmission) {
      examUpdates = await updateAdmissionInExams(oldAdmission, newAdmission);
    }

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

import Student from '../models/students.js';
import Exam from '../models/exams.js';

/**
 * Propagate admission number change to all exam records in MongoDB.
 * In legacy exam records, exam.data[0] contains an array of student marks objects.
 */
export const updateAdmissionInExams = async (oldAdmission, newAdmission) => {
  if (!oldAdmission || !newAdmission || String(oldAdmission).trim() === String(newAdmission).trim()) {
    return { updatedExamsCount: 0, updatedRecordsCount: 0 };
  }

  const oldAdmStr = String(oldAdmission).trim();
  const exams = await Exam.find({});
  let updatedExamsCount = 0;
  let updatedRecordsCount = 0;

  for (const exam of exams) {
    let examModified = false;
    if (Array.isArray(exam.data)) {
      for (let i = 0; i < exam.data.length; i++) {
        const item = exam.data[i];
        if (Array.isArray(item)) {
          for (let j = 0; j < item.length; j++) {
            const record = item[j];
            if (record && record.admission !== undefined && String(record.admission).trim() === oldAdmStr) {
              record.admission = (typeof record.admission === 'number' && !isNaN(Number(newAdmission)))
                ? Number(newAdmission)
                : String(newAdmission).trim();
              examModified = true;
              updatedRecordsCount++;
            }
          }
        } else if (item && typeof item === 'object') {
          if (item.admission !== undefined && String(item.admission).trim() === oldAdmStr) {
            item.admission = (typeof item.admission === 'number' && !isNaN(Number(newAdmission)))
              ? Number(newAdmission)
              : String(newAdmission).trim();
            examModified = true;
            updatedRecordsCount++;
          }
        }
      }
    }

    if (examModified) {
      exam.markModified('data');
      await exam.save();
      updatedExamsCount++;
    }
  }

  console.log(`Updated admission in ${updatedExamsCount} exams (${updatedRecordsCount} student records) from ${oldAdmission} to ${newAdmission}`);
  return { updatedExamsCount, updatedRecordsCount };
};

const updateStudent = async (admissionNumber, newData) => {
  try {
    const oldAdm = String(admissionNumber).trim();
    const query = {
      $or: [
        { admission: oldAdm },
        ...(!isNaN(Number(oldAdm)) ? [{ admission: Number(oldAdm) }] : [])
      ]
    };

    const updatedStudent = await Student.findOneAndUpdate(
      query,
      newData,
      { new: true }
    );
    
    if (!updatedStudent) {
      throw new Error(`Student not found with admission: ${admissionNumber}`);
    }

    // Check if admission number changed and cascade to exams
    const newAdm = newData.admission ? String(newData.admission).trim() : oldAdm;
    if (newAdm && oldAdm !== newAdm) {
      await updateAdmissionInExams(oldAdm, newAdm);
    }
    
    console.log('Student updated successfully:', updatedStudent.admission);
    return updatedStudent;
  } catch (error) {
    console.error('Error updating student:', error.message);
    throw error;
  }
};

export default updateStudent;

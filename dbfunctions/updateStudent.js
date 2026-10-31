import Student from '../models/students.js';
import Exam from '../models/exams.js';

/**
 * Propagate student changes (admission, name, father) to all exam records in MongoDB.
 * In legacy exam records, exam.data[0] contains an array of student marks objects.
 * Accepts optional studentClass to disambiguate students sharing the same admission number across different grades.
 */
export const updateStudentInExams = async (oldAdmission, updatedFields = {}, studentClass = null) => {
  if (!oldAdmission) {
    return { updatedExamsCount: 0, updatedRecordsCount: 0 };
  }

  const oldAdmStr = String(oldAdmission).trim();
  const exams = await Exam.find({});
  let updatedExamsCount = 0;
  let updatedRecordsCount = 0;

  const newAdmission = updatedFields.admission ? String(updatedFields.admission).trim() : null;
  const newName = updatedFields.name !== undefined && updatedFields.name !== null ? String(updatedFields.name).trim() : null;
  const newFather = updatedFields.father !== undefined && updatedFields.father !== null ? String(updatedFields.father).trim() : null;
  const targetClass = studentClass ? String(studentClass).trim().toUpperCase() : null;

  for (const exam of exams) {
    let examModified = false;
    if (Array.isArray(exam.data)) {
      for (let i = 0; i < exam.data.length; i++) {
        const item = exam.data[i];
        if (Array.isArray(item)) {
          for (let j = 0; j < item.length; j++) {
            const record = item[j];
            if (record && record.admission !== undefined && String(record.admission).trim() === oldAdmStr) {
              // Disambiguate if targetClass is provided and record has a different class
              const recClass = record.class ? String(record.class).trim().toUpperCase() : null;
              if (targetClass && recClass && recClass !== targetClass) {
                continue;
              }

              if (newAdmission) {
                record.admission = (typeof record.admission === 'number' && !isNaN(Number(newAdmission)))
                  ? Number(newAdmission)
                  : newAdmission;
              }
              if (newName) {
                record.name = newName;
              }
              if (newFather) {
                record.father = newFather;
              }
              examModified = true;
              updatedRecordsCount++;
            }
          }
        } else if (item && typeof item === 'object') {
          if (item.admission !== undefined && String(item.admission).trim() === oldAdmStr) {
            const recClass = item.class ? String(item.class).trim().toUpperCase() : null;
            if (targetClass && recClass && recClass !== targetClass) {
              continue;
            }

            if (newAdmission) {
              item.admission = (typeof item.admission === 'number' && !isNaN(Number(newAdmission)))
                ? Number(newAdmission)
                : newAdmission;
            }
            if (newName) {
              item.name = newName;
            }
            if (newFather) {
              item.father = newFather;
            }
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

  console.log(`Updated exams for student (${oldAdmission}): ${updatedExamsCount} exams, ${updatedRecordsCount} records`);
  return { updatedExamsCount, updatedRecordsCount };
};

// Alias for backwards compatibility
export const updateAdmissionInExams = (oldAdmission, newAdmission, studentClass = null) => {
  return updateStudentInExams(oldAdmission, { admission: newAdmission }, studentClass);
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

    // Cascade student details to exams immediately
    await updateStudentInExams(oldAdm, {
      admission: newData.admission,
      name: newData.name,
      father: newData.father
    }, updatedStudent.grade);
    
    console.log('Student updated successfully:', updatedStudent.admission);
    return updatedStudent;
  } catch (error) {
    console.error('Error updating student:', error.message);
    throw error;
  }
};

export default updateStudent;

import Exam from '../models/exams'// Make sure to provide the correct path to your model file

export async function addExam(data) {
  try {
    // Insert the array of student objects into the database
    const result = await Exam.insertMany(data);
    console.log('Students saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error saving students:', error);
    throw error;
  }
}




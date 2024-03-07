import Student from '../models/students'; // Import the Student model

const deleteStudent = async (admissionNumber) => {
  try {
    // Find the student by admission number and delete them
    const deletedStudent = await Student.findOneAndDelete({ admission: admissionNumber });
    
    if (!deletedStudent) {
      throw new Error('Student not found'); // Throw an error if student not found
    }
    
    console.log('Student deleted successfully:', deletedStudent);
    return deletedStudent;
  } catch (error) {
    console.error('Error deleting student:', error.message);
    throw error; // Re-throw the error to handle it in the caller function
  }
};

export default deleteStudent;

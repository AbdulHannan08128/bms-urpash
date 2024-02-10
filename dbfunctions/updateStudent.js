// updateUser.js

import Student from '../models/students'; // Import the Student model

const updateStudent = async (admissionNumber, newData) => {
  try {
    // Find the student by admission number and update their data
    const updatedStudent = await Student.findOneAndUpdate(
      { admission: admissionNumber }, // Search condition
      newData, // New data to update
      { new: true } // Return the updated document
    );
    
    if (!updatedStudent) {
      throw new Error('Student not found'); // Throw an error if student not found
    }
    
    console.log('Student updated successfully:', updatedStudent);
    return updatedStudent;
  } catch (error) {
    console.error('Error updating student:', error.message);
    throw error; // Re-throw the error to handle it in the caller function
  }
};

export default updateStudent;

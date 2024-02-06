import Student from '../models/students'// Make sure to provide the correct path to your model file

export async function addStudents(data) {
  // Array of student objects with data for each student
  const students = [
    {
      name: 'John Doe',
      roll: '101',
      grade: '10',
      dob: '2005-01-01',
      parentage: 'Parent Name',
      phone: '1234567890',
      email: 'john.doe@example.com',
      aadhar: '1234-5678-9012',
      // Add other fields as needed
    },
    {
      name: 'Jane Smith',
      roll: '102',
      grade: '10',
      dob: '2005-02-01',
      parentage: 'Parent Name',
      phone: '9876543210',
      email: 'jane.smith@example.com',
      aadhar: '5678-9012-3456',
      // Add other fields as needed
    },
    // Add more student objects as needed
  ];

  try {
    // Insert the array of student objects into the database
    const result = await Student.insertMany(data);
    console.log('Students saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error saving students:', error);
    throw error;
  }
}




// models/User.js

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  roll: {
    type: String,
    required: false
  },
  grade: {
    type: String,
    required: false,
  },
  dob: {
    type: String,
    required: false
  }, 
  parentage: {
    type: String,
    required: false
  }, 
  phone: {
    type: String,
    required: false
  }, 
  email: {
    type: String,
    required: false
  }, 
  photo: {
    type: Buffer,
    required: false
  }, 
  aadhar: {
    type: String,
    required: false
  }, 
  
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;

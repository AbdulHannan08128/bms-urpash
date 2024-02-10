// models/User.js

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  roll: {
    type: String,
    required: false
  },
  admission:{
    type:String,
    required:false
  },
  aadhar: {
    type: String,
    required: false
  }, 
  name: {
    type: String,
    required: false
  },
  father: {
    type: String,
    required: false
  }, 
  mother: {
    type: String,
    required: false
  }, 
  
 category:{
  type:String,
  required:false
 },
 
  grade: {
    type: String,
    required: false,
  },
  dob: {
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
  address:{
    type:String,
    required:false
  },
  account:{
    type:String,
    required:false
  }
  
 
  
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;

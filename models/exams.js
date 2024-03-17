// models/User.js

import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  
  year: {
    type: String,
    required: false
  },
  marks: {
    type: String,
    required: false
  },
  data: {
    type: Array,
    required: false
  },
  passPercentage:{
    type:String,
    required:false
  },
  shortName:{
    type:String,
    required:false
  },
  
  
  
 
  
});

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);

export default Exam;

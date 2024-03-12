// models/User.js

import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
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
  
  
  
 
  
});

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);

export default Exam;

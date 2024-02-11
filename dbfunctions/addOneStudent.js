import Student from "../models/students";

export async function addOneStudent(data,success, err){
    try {
        const newStudent = new Student(data);
        await newStudent.save();
         if (typeof(success)=='function') {
            success();
         }
         else{
            console.log('Student added successfully');
         }
        
      } catch (error) {
        if (typeof(err)=='function') {
            err(error);
         }
         else{
            console.log('Failed!!');
         }
      }
}
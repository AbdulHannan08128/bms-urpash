
import Student from '../models/students';

async function getStudents(query) {
    try {
       

        const students = await Student.find(query);
        return students;
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}

export default getStudents;

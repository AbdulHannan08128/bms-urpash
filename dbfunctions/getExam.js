
import Exam from '../models/exams';

async function getExams(obj) {
    try {
       

        const exams = await Exam.find(obj);
        return exams;
    } catch (error) {
        console.error('Error fetching exams:', error);
        return [];
    }
}

export default getExams;

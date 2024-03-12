
import Exam from '../models/exams';

async function getExams() {
    try {
       

        const exams = await Exam.find({});
        return exams;
    } catch (error) {
        console.error('Error fetching exams:', error);
        return [];
    }
}

export default getExams;

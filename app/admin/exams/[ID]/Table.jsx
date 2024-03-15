'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const TableView = (props) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(props.url + '?slug='+props.id);
        let exam = response.data;
        console.log(exam);
        const newData = [];
        await exam[0].data[0].forEach(item=> {
           let stu = {
            id:1,
            student:item.name,
            admission:item.admission,
            father:item.father,
            class:item.class,
            marks:{
              english: item.english,
              kashmiri: item.kashmiri,
              math:item.math,
              science:item.science,
              urdu:item.urdu

            }
           }
           newData.push(stu)
        });
        setData(newData)
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const DATA = [
    { id: 1, student: 'John Doe', fatherName: 'Michael Doe', rollNo: 'A001', class: '10th', marks: { English: 85, Math: 90, Science: 82, Social_Science: 78, Urdu: 88, Kashmiri: 75 }},
    { id: 2, student: 'Jane Smith', fatherName: 'Robert Smith', rollNo: 'A002', class: '11th', marks: { English: 92, Math: 88, Science: 90, Social_Science: 85, Urdu: 90, Kashmiri: 80 }},
    { id: 3, student: 'Alice Johnson', fatherName: 'David Johnson', rollNo: 'A003', class: '9th', marks: { English: 78, Math: 85, Science: 80, Social_Science: 75, Urdu: 82, Kashmiri: 70 }},]
    // Add more data as needed
  
  
  const handleView = (student) => {
    setSelectedStudent(student);
  };

  const handleClose = () => {
    setSelectedStudent(null);
  };

  return (
    
    <div className="overflow-x-auto xl:m-20">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Father's Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Admission No.
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.student}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.father}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.admission}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.class}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="text-indigo-600 hover:text-indigo-900" onClick={() => handleView(item)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold mb-2">{selectedStudent.student}</h2>
              <p className="text-gray-600"><span className=' italic' style={{fontWeight:'bold'}}>Father's Name:</span> {selectedStudent.father}</p>
              <p className="text-gray-600"><span className=' italic' style={{fontWeight:'bold'}}>Admission No.:</span> {selectedStudent.admission}</p>
              <p className="text-gray-600"><span className=' italic' style={{fontWeight:'bold'}}>Class:</span> {selectedStudent.class}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 place-content-center">
              {Object.entries(selectedStudent.marks).map(([subject, mark]) => (
                <div key={subject} className="border p-4">
                  <h3 className="text-lg font-semibold mb-2">{subject}</h3>
                  <p>{mark}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded" onClick={handleClose} style={{width:'100%'}}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
   
  );
};

export default TableView;


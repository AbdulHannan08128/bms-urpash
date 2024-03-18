"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import DROPDOWN from "./DROPDOWN";
import Link from 'next/link'

export default function SESSION(props) {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  async function fetchData() {
    try {
      const response = await axios.get(props.URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [props.URL]);

  useEffect(() => {
    if (selectedYear) {
      // Filter exams for the selected academic year
      const filteredExams = data.filter((exam) => exam.year === selectedYear);

      // Collect all students from data[0] of filtered exams
      const allStudents = filteredExams.flatMap((exam) =>
        exam.data[0] ? exam.data[0] : []
      );

      // Filter unique students based on admission number
      const uniqueStudents = allStudents.reduce((acc, student) => {
        if (!acc.find((s) => s.admission === student.admission)) {
          acc.push(student);
        }
        return acc;
      }, []);

      setStudents(uniqueStudents);
    } else {
      setStudents([]);
    }
  }, [selectedYear, data]);

  return (
    <div className="mt-4 ml-5">
      <DROPDOWN options={data} func={setSelectedYear} />
      {students?students.length > 0 ? (
        <div className="overflow-x-auto p-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father's Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.father}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.admission}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-10">
                 
                  <Link
                    href={`/admin/exams/session/${selectedYear}`}
                  >
                    <button className="text-indigo-600 hover:text-indigo-900">
                      Print Card
                    </button>
                  </Link>
                </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ''
      ):''}
    </div>
  );
}

// pages/index.js
"use client";
// pages/index.js
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { post } from "@/functions/axios.post";
import Alert from "../../checklist/add/Alert";
import * as XLSX from "xlsx";

export default function Home(props) {
  const [success, setSuccess] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [examName, setExamName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [PassingMarks, setPassingMarks] = useState("");
  const [shName, setshName] = useState("");

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const convertedData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      setJsonData(convertedData);
      console.log(convertedData);
    };

    reader.readAsArrayBuffer(file);
  };

  function submit(e) {
    let id = `${examName}${academicYear}`;
    e.preventDefault();
    if (academicYear == "" || examName == "" || maxMarks == "") {
      alert("Please fill the Exam details");
    } else {
      console.log([id, examName, academicYear, maxMarks, [jsonData], PassingMarks, shName]);
      post(
        props.BULK_URL,
        [id, examName, academicYear, maxMarks, [jsonData],PassingMarks, shName],
        () => {
          setSuccess(true);
        },
        (err) => {
          alert("Error");
        }
      );
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <form>
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold mb-4">Upload Excel File</h1>
          <div
            {...getRootProps()}
            className={`py-12 px-4 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              isDragActive ? "border-blue-500" : ""
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-center">
              {jsonData == null
                ? isDragActive
                  ? "Drop the file here"
                  : "Drag and drop your Excel file here, or click to browse"
                : "Change File"}
            </p>
          </div>
          {jsonData != null && (
            <>
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Exam Details:</h2>
                <input
                  type="text"
                  className="block w-full p-2 border rounded-md"
                  placeholder="Exam Name"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="block w-full p-2 border rounded-md mt-4"
                  placeholder="Academic Year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="block w-full p-2 border rounded-md mt-4"
                  placeholder="Max Marks"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="block w-full p-2 border rounded-md mt-4"
                  placeholder="Passing Percentage"
                  value={PassingMarks}
                  onChange={(e) => setPassingMarks(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="block w-full p-2 border rounded-md mt-4"
                  placeholder="Short Name (eg; Unit-1 to U1)"
                  value={shName}
                  onChange={(e) => setshName(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-10 pl-10 pr-10"
                onClick={submit}
              >
                Upload
              </button>
            </>
          )}
        </div>
      </form>
      {success && <Alert Function={setSuccess} />}
    </>
  );
}

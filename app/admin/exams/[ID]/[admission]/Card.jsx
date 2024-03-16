"use client";

import { useSearchParams } from "next/navigation";
import { get } from "../../../../../functions/axios.get";
import { useState, useEffect } from "react";
import styles from "./Card.module.css";
export default function SearchBar(props) {
  const searchParams = useSearchParams();
  const [student, setStudent] = useState({});
  const [Marks, setMarks] = useState({});
  const [Year, setYear] = useState({});
  const [Name, setName] = useState({});
  const [MMARKS, setMMARKS] = useState({});
  const [OMARKS, setOMARKS] = useState({});

  const exam = searchParams.get("exam");
  async function getMarks() {
    await get(props.URL_2 + "?slug=" + exam, (marks) => {
      // console.log('marks');
      // console.log(marks.data[0].data);

      setMMARKS(marks.data[0].marks);
      setName(marks.data[0].name);
      setYear(marks.data[0].year);
      marks.data[0].data[0].forEach((mark) => {
        if (mark.admission == props.admission) {
          // console.clear();
          setMarks(mark);
          console.log("hook");
          console.log(Marks);
          setOMARKS(
            parseInt(Marks.english) +
              parseInt(Marks.math) +
              parseInt(Marks.science) +
              parseInt(Marks.sst) +
              parseInt(Marks.urdu) +
              parseInt(Marks.kashmiri)
          );
        } else {
          console.log(
            "virtual= " + props.admission + "and" + " real=" + mark.admission
          );
          // console.log(mark);
        }
      });
    });
  }
  async function getStudent() {
    await get(props.URL_1 + "?admission=" + props.admission, (Student) => {
      // console.log('student');
      // console.log(Student.data);

      setStudent(Student.data[0]);
    });
  }

  useEffect(() => {
    console.clear();
    getMarks();
    getStudent();
  }, []);

  return (
    <>
      <div
        className="PHIDE h-screen grid place-items-center"
        style={{ width: "100%" }}
      >
        <button
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center PHIDE m-auto"
        >
          <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2h8a2 2 0 012 2v5h1a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 012-2h1V5zm3-1a1 1 0 00-1 1v5h10V5a1 1 0 00-1-1H7z"
              clipRule="evenodd"
            />
          </svg>
          Print
        </button>
      </div>
      <div className=" p-0 min-h-screen max-h-screen wHIDE">
        <div className={styles.full}>
          <div>
            <div className={`text-3xl text-center uppercase`}>
              <h1>Govt. Boys Middle School Urpash</h1>
              <h2>
                <div className="text-center p-2">
                  <h2 className={`text-2xl`}>Progress Report</h2>
                </div>
              </h2>
            </div>

            <div
              className={`${styles.width_100} pl-10 text-l grid grid-cols-2`}
            >
              <div className={`${styles.lh}`}>
                <div>
                  <span className="font-bold uppercase mb-5">Class:</span>{" "}
                  {student ? student.grade : ""}
                </div>
                <div>
                  <span className="font-bold uppercase mb-5">Roll No.:</span>
                  {student ? student.roll : ""}
                </div>
                <div>
                  <span className="font-bold uppercase mb-5">
                    Name:
                  </span>
                  {student ? student.name : ""}
                </div>
                <div>
                  <span className="font-bold uppercase mb-5">
                    Admission No.:
                  </span>
                  {student ? student.admission : ""}
                </div>
                <div>
                  <span className="font-bold uppercase mb-5">
                    Parentage:
                  </span>
                  {student ? student.father : ""}
                </div>
              </div>
              <div className=" grid place-items-center">
                <span className={styles.photo}></span>
              </div>
            </div>
          </div>
          <div className={`${styles.table} mt-14`}>
            <table
              className={`flex justify-center align-center flex-col ${styles.table}`}
            >
              <tr key="" className="grid grid-cols-3" style={{ width: "100%" }}>
                <th className={`${styles.th}`}>Subject</th>
                <th className={`${styles.th}`}>Marks Obtained</th>
                <th className={`${styles.th}`}>Status</th>
              </tr>
              <tr key="" className="grid grid-cols-3" style={{ width: "100%" }}>
                <td className={`${styles.td}`}>English</td>
                <td className={`${styles.td}`}>{Marks.english}</td>
                <td className={`${styles.td}`}>
                  {" "}
                  {parseInt(Marks.english) >
                  parseInt(MMARKS) - (30 / 100) * parseInt(MMARKS)
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
              <tr key="" className="grid grid-cols-3" style={{ width: "100%" }}>
                <td className={`${styles.td}`}>Maths</td>
                <td className={`${styles.td}`}>{Marks.math}</td>
                <td className={`${styles.td}`}>
                  {" "}
                  {parseInt(Marks.math) >
                  parseInt(MMARKS) - (30 / 100) * parseInt(MMARKS)
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
              <tr key="" className="grid grid-cols-3" style={{ width: "100%" }}>
                <td className={`${styles.td}`}>Science</td>
                <td className={`${styles.td}`}>{Marks.science}</td>
                <td className={`${styles.td}`}>
                  {" "}
                  {
                    parseInt(Marks.science)
                     >
                  parseInt(MMARKS) - (30 / 100) * parseInt(MMARKS)
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
              <tr key="" className="grid grid-cols-3" style={{ width: "100%" }}>
                <td className={`${styles.td}`}>Social Science</td>
                <td className={`${styles.td}`}>{Marks.sst}</td>
                <td className={`${styles.td}`}>
                  {" "}
                  {
                    parseInt(Marks.sst) 
                    >
                  parseInt(MMARKS) - (30 / 100) * parseInt(MMARKS)
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
              <tr key="" className="grid grid-cols-3" style={{ width: "100%" }}>
                <td className={`${styles.td}`}>Urdu</td>
                <td className={`${styles.td}`}>{Marks.urdu}</td>
                <td className={`${styles.td}`}>
                  {" "}
                  {
                    parseInt(Marks.urdu) >
                  parseInt(MMARKS) - (30 / 100) * parseInt(MMARKS)
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
              <tr key="" className="grid grid-cols-3" style={{ width: "100%" }}>
                <td className={`${styles.td}`}>Kashmiri</td>
                <td className={`${styles.td}`}>{Marks.kashmiri}</td>
                <td className={`${styles.td}`}>
                  {" "}
                  {
                    parseInt(Marks.kashmiri) >
                  parseInt(MMARKS) - (30 / 100) * parseInt(MMARKS)
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
              <tr
                key=""
                className="grid grid-cols-3 font-bold"
                style={{ width: "100%" }}
              >
                <td className={`${styles.td}`}>Total Max. Marks</td>
                <td className={`${styles.td}`}>{parseInt(MMARKS) * 6}</td>
                <td className={`${styles.td}`}>-</td>
              </tr>
              <tr
                key=""
                className="grid grid-cols-3 font-bold"
                style={{ width: "100%" }}
              >
                <td className={`${styles.td}`}>Total Marks</td>
                <td className={`${styles.td}`}>
                  {parseInt(Marks.english) +
                    parseInt(Marks.math) +
                    parseInt(Marks.science) +
                    parseInt(Marks.sst) +
                    parseInt(Marks.urdu) +
                    parseInt(Marks.kashmiri)}
                </td>
                <td className={`${styles.td}`}>
                  {" "}
                  {parseInt(Marks.english) +
                    parseInt(Marks.math) +
                    parseInt(Marks.science) +
                    parseInt(Marks.sst) +
                    parseInt(Marks.urdu) +
                    parseInt(Marks.kashmiri) >
                  parseInt(MMARKS) * 6 - (30 / 100) * parseInt(MMARKS) * 6
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
              <tr
                key=""
                className="grid grid-cols-3 font-bold"
                style={{ width: "100%" }}
              >
                <td className={styles.td}>Percentage</td>
                <td className={styles.td}>
                  {Math.round(
                    ((parseInt(Marks.english) +
                      parseInt(Marks.math) +
                      parseInt(Marks.science) +
                      parseInt(Marks.sst) +
                      parseInt(Marks.urdu) +
                      parseInt(Marks.kashmiri)) /
                      (parseInt(MMARKS) * 6)) *
                      100
                  )}
                  %
                </td>
                <td className={`${styles.td}`}>
                  {" "}
                  {Math.round(
                    ((parseInt(Marks.english) +
                      parseInt(Marks.math) +
                      parseInt(Marks.science) +
                      parseInt(Marks.sst) +
                      parseInt(Marks.urdu) +
                      parseInt(Marks.kashmiri)) /
                      (parseInt(MMARKS) * 6)) *
                      100
                  ) > 30
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
            </table>
          </div>
          <div>
            <div className="grid grid-cols-3 place-items-center font-bold uppercase absolute bottom-3 w-screen">
              <span>EXAMINATION INCHARGE</span>
              <span>CHECKED BY</span>
              <span>HEADMASTER</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

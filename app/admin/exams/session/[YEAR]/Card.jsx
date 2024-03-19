"use client";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./Card.module.css";

export default function SearchBar(props) {
  const searchParams = useSearchParams();
  const [student, setStudent] = useState({});
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grid, setGrid] = useState("");

  const admission = searchParams.get("admission");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentResponse = await axios.get(
          `${props.URL_1}?admission=${admission}`
        );
        setStudent(studentResponse.data[0]);
        console.log("studentResponse.data[0]");
        console.log(studentResponse.data[0]);
      } catch (error) {
        setError(
          error.message || "An error occurred while fetching student data"
        );
        setLoading(false);
      }
    };

    const fetchMarks = async () => {
      try {
        const marksResponse = await axios.get(
          `${props.URL_2}?year=${props.YEAR}`
        );
        if (marksResponse.data && marksResponse.data.length > 0) {
          setMarksData(marksResponse.data);
          console.log("marksResponse.data");
          console.log(marksResponse.data);

          let marksLen = marksResponse.data.length.toString();
          let gridLayout = eval(marksLen + "+1");
          setGrid(gridLayout.toString());
          console.log(gridLayout.toString());
        } else {
          setError("No marks data found");
        }
      } catch (error) {
        setError(
          error.message || "An error occurred while fetching marks data"
        );
      }
      setLoading(false);
    };

    setLoading(true);
    fetchStudent();
    fetchMarks();
  }, [admission, props.URL_1, props.URL_2, props.YEAR]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="absolute text-purple-950 font-bold">
            GETTING READY
          </div>
          <div className="rounded-full h-44 w-44 border-t-4 border-b-4 border-purple-600 animate-ping bg-purple-400"></div>
        </div>
      ) : (
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
      )}
      <div className="p-0 min-h-screen max-h-screen wHIDE">
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
                  {student.grade}
                </div>
                <div>
                  <span className="font-bold uppercase mb-5">Roll No.:</span>{" "}
                  {student.roll}
                </div>
                <div>
                  <span className="font-bold uppercase mb-5">Name:</span>{" "}
                  {student.name}
                </div>
                <div>
                  <span className="font-bold uppercase mb-5">
                    Admission No.:
                  </span>{" "}
                  {student.admission}
                </div>
                <div>
                  <span className="font-bold uppercase mb-5">Parentage:</span>{" "}
                  {student.father}
                </div>
              </div>
              <div className={`${styles.lh}`}>
               
                <div>
                  <span className="font-bold uppercase mb-5">
                    Academic Year:
                  </span>{" "}
                  {props.YEAR}
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.table} mt-14`}>
            <table
              className={`flex justify-center align-center flex-col ${styles.table}`}
            >
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <th className={`${styles.th}`}>Subject</th>
                {marksData.map((mdata) => {
                  return (
                    <th className={`${styles.th}`}>
                      {mdata.shortName ? mdata.shortName : mdata.name}
                    </th>
                  );
                })}
              </tr>

              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>English</td>
                {marksData.map((mdata) => {
                  return (
                    <td className={`${styles.td}`}>
                      {
                        mdata.data[0].find(
                          (ST) => ST.admission == parseInt(admission)
                        ).english
                      }
                    </td>
                  );
                })}
              </tr>
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>Maths</td>
                {marksData.map((mdata) => {
                  return (
                    <td className={`${styles.td}`}>
                      {" "}
                      {
                        mdata.data[0].find(
                          (ST) => ST.admission == parseInt(admission)
                        ).math
                      }
                    </td>
                  );
                })}
              </tr>
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>Science</td>
                {marksData.map((mdata) => {
                  return (
                    <td className={`${styles.td}`}>
                      {
                        mdata.data[0].find(
                          (ST) => ST.admission == parseInt(admission)
                        ).science
                      }
                    </td>
                  );
                })}
              </tr>
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>Social Science</td>
                {marksData.map((mdata) => {
                  return (
                    <td className={`${styles.td}`}>
                      {" "}
                      {
                        mdata.data[0].find(
                          (ST) => ST.admission == parseInt(admission)
                        ).sst
                      }
                    </td>
                  );
                })}
              </tr>
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>Urdu</td>
                {marksData.map((mdata) => {
                  return (
                    <td className={`${styles.td}`}>
                      {" "}
                      {
                        mdata.data[0].find(
                          (ST) => ST.admission == parseInt(admission)
                        ).urdu
                      }
                    </td>
                  );
                })}
              </tr>
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>Kashmiri</td>
                {marksData.map((mdata) => {
                  return (
                    <td className={`${styles.td}`}>
                      {
                        mdata.data[0].find(
                          (ST) => ST.admission == parseInt(admission)
                        ).kashmiri
                      }
                    </td>
                  );
                })}
              </tr>
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>Max. Marks</td>
                {marksData.map((mdata) => {
                  return <td className={`${styles.td}`}>{mdata.marks}</td>;
                })}
              </tr>
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>
                  {marksData.length > 4 ? "%age" : "Percentage"}
                </td>
                {marksData.map((mdata) => {
                  return (
                    <td className={`${styles.td}`}>
                      {Math.round(
                        ((parseInt(
                          mdata.data[0].find(
                            (ST) => ST.admission == parseInt(admission)
                          ).english
                        ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).math
                          ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).science
                          ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).sst
                          ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).urdu
                          ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).kashmiri
                          )) /
                          (parseInt(mdata.marks) * 6)) *
                          100
                      )}
                      %
                    </td>
                  );
                })}
              </tr>
              <tr style={{ width: "100%" }} className={`grid grid-col-${grid}`}>
                <td className={`${styles.th}`}>Result</td>
                {marksData.map((mdata) => {
                  return (
                    <td className={`${styles.td}`}>
                      {Math.round(
                        ((parseInt(
                          mdata.data[0].find(
                            (ST) => ST.admission == parseInt(admission)
                          ).english
                        ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).math
                          ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).science
                          ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).sst
                          ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).urdu
                          ) +
                          parseInt(
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).kashmiri
                          )) /
                          (parseInt(mdata.marks) * 6)) *
                          100
                      ) > mdata.passPercentage
                        ? "PASS"
                        : "FAIL"}
                    </td>
                  );
                })}
              </tr>
            </table>
          </div>
          <div>
            <div className="grid grid-cols-3 place-items-center font-bold uppercase absolute bottom-7 w-screen">
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

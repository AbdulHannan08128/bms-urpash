"use client";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import "./CARD_2024.css";
import { SortByAlphaOutlined } from "@mui/icons-material";
import Image from "next/image";

export default async function SearchBar(props) {
  const searchParams = useSearchParams();
  const [student, setStudent] = useState({});
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grid, setGrid] = useState("");
  const [grade, setGrade] = useState();
  const [isNotEVS, setNotEVS] = useState();
  const [pass, setPass] = useState(true);
  const [percentage, setPercentage] = useState(0);
  const [overallGrade, setOverallGrade] = useState("A");
  const [totalMarks, setTotalMarks] = useState("A");
  const [rank, setRank] = useState(null);

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
          let gridLayout = eval(marksLen + "+2");
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

  const calculate_other_student_marks = (marksData, grade, isNotEVS) => {
    // Define subjects based on conditions
    const subjects = grade
      ? ["english", "math", "science", "urdu", "kashmiri", "sst"]
      : isNotEVS
      ? ["english", "math", "urdu", "kashmiri"] // Exclude Science and SST
      : ["english", "math", "science", "urdu", "kashmiri"];

    console.log("Subjects to calculate:", subjects);

    // Iterate through marksData to calculate total marks for each student
    return marksData.map((studentExams, studentIndex) => {
      console.log(`Student ${studentIndex + 1} data:`, studentExams);

      // Calculate total for a single student's exams
      const studentTotal = studentExams.reduce((total, exam, examIndex) => {
        console.log(`  Exam ${examIndex + 1} data:`, exam);

        // Add marks for all specified subjects
        const examTotal = subjects.reduce((subjectTotal, subject) => {
          const subjectMarks = exam[subject] || 0;
          console.log(`    ${subject}: ${subjectMarks}`);
          return subjectTotal + subjectMarks;
        }, 0);

        console.log(`  Exam ${examIndex + 1} total:`, examTotal);
        return total + examTotal; // Accumulate exam totals
      }, 0);

      console.log(`Student ${studentIndex + 1} total marks:`, studentTotal);
      return studentTotal;
    });
  };

  const calculateStudentRank = (total_marks, marks_array) => {
    console.clear();

    // Step 1: Initial input
    console.log("Initial Marks Array:", marks_array);
    console.log("Given Marks (Total Marks):", total_marks);

    // Step 2: Filter marks_array to include only valid numbers
    const validMarks = marks_array
      .map((m) => Number(m)) // Convert to numbers
      .filter((m) => !isNaN(m) && m > 0); // Keep numbers greater than zero
    console.log("Filtered Valid Marks:", validMarks);

    if (validMarks.length === 0) {
      console.error("No valid marks found in the array.");
      return "Invalid marks array.";
    }

    // Step 3: Sort the marks in descending order
    const sortedMarks = [...validMarks].sort((a, b) => b - a);
    console.log("Sorted Marks (Descending Order):", sortedMarks);

    // Step 4: Find the rank of the given total_marks
    const rank = sortedMarks.indexOf(total_marks) + 1;
    console.log(`Rank of Given Marks (${total_marks}):`, rank);

    // Step 5: Handle edge case where total_marks is not in the array
    if (rank === 0) {
      console.error(`Marks ${total_marks} not found in the array.`);
      return `Marks ${total_marks} not found in the array.`;
    }

    // Step 6: Append rank suffix
    const rankSuffix = (n) => {
      if (n === 1) return "st";
      if (n === 2) return "nd";
      if (n === 3) return "rd";
      return "Nil"; // Return "Nil" for ranks greater than 3
    };

    const rankWithSuffix = `${rank}${rankSuffix(rank)}`;
    if (rankSuffix(rank) === "Nil") {
      return "Nil";
    }
    console.log("Final Rank with Suffix:", rankWithSuffix);

    return rankWithSuffix;
  };

  const getOtherStudents = async () => {
    const ALL_EXAMS = marksData;
    let class_students = [];

    // Collect students of the same grade
    ALL_EXAMS.forEach((exam) => {
      if (exam.data && Array.isArray(exam.data) && exam.data[0]) {
        exam.data[0].forEach((other_student) => {
          if (student.grade === other_student.class) {
            class_students.push(other_student);
          }
        });
      }
    });

    console.log("Class Students:", class_students);

    let sorted_students = [];

    // Use a Set to track unique admissions
    let uniqueAdmissions = new Set();

    class_students.forEach((class_student) => {
      if (!uniqueAdmissions.has(class_student.admission)) {
        // Add admission to the Set
        uniqueAdmissions.add(class_student.admission);

        // Filter students with the same admission
        let sorted = class_students.filter(
          (a) => a.admission === class_student.admission
        );

        // Push the unique array to sorted_students
        sorted_students.push(sorted);
      }
    });

    console.log("Sorted Students:", sorted_students);

    let marks_array = [];

    marks_array.push(
      calculate_other_student_marks(sorted_students, grade, isNotEVS)
    );

    console.clear();
    console.log("MARKS ARRAY: " + marks_array);

    setRank(calculateStudentRank(totalMarks, marks_array[0]));
  };

  useEffect(() => {
    switch (student.grade) {
      case "6th":
        setGrade(true);
        break;
      case "7th":
        setGrade(true);
        break;
      case "8th":
        setGrade(true);
        break;

      case "KG":
        setNotEVS(true);
        break;
      case "Ist":
        setNotEVS(true);
        break;
      case "2nd":
        setNotEVS(true);
        break;

      default:
        break;
    }
  }, [student.grade]);
  if (error) {
    return <div>Error: {error}</div>;
  }

  let calculate_percentage = async () => {
    setPercentage(
      (
        ((grade
          ? marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .english,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .math,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .science,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .urdu,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .kashmiri,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .sst,

              0
            )
          : !isNotEVS
          ? marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .english,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .math,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .science,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .urdu,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .kashmiri,

              0
            )
          : marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .english,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .math,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .urdu,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .kashmiri,

              0
            )) /
          (grade
            ? marksData.reduce(
                (total, subject) => total + parseInt(subject.marks),
                0
              ) * 6
            : !isNotEVS
            ? marksData.reduce(
                (total, subject) => total + parseInt(subject.marks),
                0
              ) * 5
            : marksData.reduce(
                (total, subject) => total + parseInt(subject.marks),
                0
              ) * 4)) *
        100
      ).toFixed(2)
    );
  };

  const calculate_total_marks = async () => {
    setTotalMarks(
      grade
        ? marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .english,

            0
          ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .math,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .science,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .urdu,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .kashmiri,

              0
            ) +
            marksData.reduce(
              (total, mdata) =>
                total +
                mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                  .sst,

              0
            )
        : !isNotEVS
        ? marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .english,

            0
          ) +
          marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .math,

            0
          ) +
          marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .science,

            0
          ) +
          marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .urdu,

            0
          ) +
          marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .kashmiri,

            0
          )
        : marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .english,

            0
          ) +
          marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .math,

            0
          ) +
          marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .urdu,

            0
          ) +
          marksData.reduce(
            (total, mdata) =>
              total +
              mdata.data[0].find((ST) => ST.admission == parseInt(admission))
                .kashmiri,

            0
          )
    );
  };

  useEffect(() => {
    calculate_percentage();
    calculate_total_marks();
    getOtherStudents();
    setPass(percentage > 33);
    setOverallGrade(
      percentage === 100
        ? "A+" // Outstanding
        : percentage >= 90
        ? "A+" // Excellent
        : percentage >= 80
        ? "A" // Very Good
        : percentage >= 70
        ? "B+" // Good
        : percentage >= 60
        ? "B" // Above Average
        : percentage >= 50
        ? "C" // Average
        : percentage >= 33
        ? "D" // Below Average
        : "F" // Fail
    );
  }, [marksData, grade, isNotEVS, overallGrade, percentage, pass, totalMarks]);

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
      <div className="">
        <div className="wHIDE h-screen w-screen wra fixed">
          <div className="w-screen h-screen bg-img">
            <img
              src="/LOGO-W.png"
              alt="BMS URPASH"
              className="IMG relative right-6"
            />
          </div>
          <div className="w-screen h-screen bg-transparent z-50 absolute top-0 card-wrapper">
            <div className="sheet-wrapper">
              <div className="headsec relative mt-3">
                <div>
                  {" "}
                  <img
                    src="/LOGO-W.png"
                    alt="BMS URPASH"
                    className="logo absolute left-0 top-2"
                  />
                </div>
                <div className="innerGRID relative left-2">
                  <div>
                    <h2 className="text-2xl font-bold text-center tracking-tight ">
                      OFFICE OF THE HEADMASTER
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-center uppercase tracking-tight">
                      Govt. Boys Middle School Urpash
                    </h2>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-center uppercase tracking-tight color-blue">
                      CERTIFICATE OF ACHIEVEMENT
                    </h2>
                  </div>
                </div>
              </div>
              <div className="details w-screen h-auto p-14 capitalize">
                <div
                  className="grid"
                  style={{ gridTemplateColumns: "2fr 1fr" }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="font-bold uppercase">
                      <span className="opacity-80"> Name: </span>
                      <span className="text-black-700">{student.name}</span>
                    </div>
                    <div className="font-bold uppercase">
                      <span className="opacity-80">Father's Name: </span>
                      <span className="text-black-700">{student.father}</span>
                    </div>
                    <div className="font-bold uppercase">
                      <span className="opacity-80"> Class: </span>
                      <span className="text-black-700">{student.grade}</span>
                    </div>
                    <div className="font-bold uppercase">
                      <span className="opacity-80"> Registration No.: </span>
                      <span className="text-black-700">
                        {" "}
                        {student.admission}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="font-bold uppercase">
                      <span className="opacity-80"> Session: </span>
                      <span className="text-black-700">
                        NOV-{new Date().getFullYear()}
                      </span>
                    </div>
                    <div className="font-bold uppercase">
                      <span className="opacity-80"> DOB: </span>
                      <span className="text-black-700">
                        {student.dob ? student.dob.split('"')[1] : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="table mt-5 absolute left-10" style={{}}>
                  <table className="th">
                    <tr
                      className={`grid grid-col-${grid}`}
                      style={{ width: "91vw" }}
                    >
                      <th className="uppercase th text-center">Subjects</th>

                      {marksData.map((mdata) => {
                        return (
                          <th className={`th uppercase text-left`} colSpan={2}>
                            {mdata.name ? mdata.name : "N/A"} (
                            {mdata.shortName ? mdata.shortName : mdata.name})
                          </th>
                        );
                      })}
                      <th className={`th uppercase text-left`} colSpan={2}>
                        {"GRAND TOTAL  "}(
                        {marksData.map((mdata, i) => {
                          return marksData.length == i + 1
                            ? mdata.shortName
                            : mdata.shortName + "+";
                        })}
                        )
                      </th>
                    </tr>

                    <tr
                      style={{ width: "100%" }}
                      className={`grid grid-col-${(
                        parseInt(grid) * 2
                      ).toString()}`}
                    >
                      <th></th>
                      <th></th>
                      <th className={`th font-bold`}>Obt.</th>
                      <th className={`th font-bold`}>Max.</th>
                      {marksData.map(() => {
                        return (
                          <>
                            <th className={`th font-bold`}>Obt.</th>
                            <th className={`th font-bold`}>Max.</th>
                          </>
                        );
                      })}
                    </tr>

                    <tr
                      style={{ width: "100%" }}
                      className={`grid grid-col-${(
                        parseInt(grid) * 2
                      ).toString()}`}
                    >
                      <th
                        className={`th text-left`}
                        style={{ borderRight: "none" }}
                      >
                        English
                      </th>
                      <th
                        className={`th text-center`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-center`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).english
                              }
                            </th>
                            <th className={`th text-center`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-center`}>
                        {/* Displaying the total obtained marks here */}
                        {marksData.reduce(
                          (total, mdata) =>
                            total +
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).english,
                          0
                        )}
                      </th>
                      <th className={`th text-center`}>
                        {/* Displaying the total maximum marks here */}
                        {marksData.reduce(
                          (total, subject) => total + parseInt(subject.marks),
                          0
                        )}
                      </th>
                    </tr>

                    <tr
                      style={{ width: "100%" }}
                      className={`grid grid-col-${(
                        parseInt(grid) * 2
                      ).toString()}`}
                    >
                      <th
                        className={`th text-left`}
                        style={{ borderRight: "none" }}
                      >
                        Math
                      </th>
                      <th
                        className={`th text-center`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-center`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).math
                              }
                            </th>
                            <th className={`th text-center`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-center`}>
                        {/* Displaying the total obtained marks here */}
                        {marksData.reduce(
                          (total, mdata) =>
                            total +
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).math,

                          0
                        )}
                      </th>
                      <th className={`th text-center`}>
                        {/* Displaying the total maximum marks here */}
                        {marksData.reduce(
                          (total, subject) => total + parseInt(subject.marks),
                          0
                        )}
                      </th>
                    </tr>
                    {!isNotEVS && (
                      <tr
                        style={{ width: "100%" }}
                        className={`grid grid-col-${(
                          parseInt(grid) * 2
                        ).toString()}`}
                      >
                        <th
                          className={`th text-left`}
                          style={{ borderRight: "none" }}
                        >
                          {grade ? "Science" : "EVS"}
                        </th>
                        <th
                          className={`th text-center`}
                          style={{ borderLeft: "none" }}
                        ></th>
                        {marksData.map((mdata) => {
                          return (
                            <>
                              <th className={`th text-center`}>
                                {
                                  mdata.data[0].find(
                                    (ST) => ST.admission == parseInt(admission)
                                  ).science
                                }
                              </th>
                              <th className={`th text-center`}>
                                {mdata.marks}
                              </th>
                            </>
                          );
                        })}
                        <th className={`th text-center`}>
                          {/* Displaying the total obtained marks here */}
                          {marksData.reduce(
                            (total, mdata) =>
                              total +
                              mdata.data[0].find(
                                (ST) => ST.admission == parseInt(admission)
                              ).science,

                            0
                          )}
                        </th>
                        <th className={`th text-center`}>
                          {/* Displaying the total maximum marks here */}
                          {marksData.reduce(
                            (total, subject) => total + parseInt(subject.marks),
                            0
                          )}
                        </th>
                      </tr>
                    )}

                    <tr
                      style={{ width: "100%" }}
                      className={`grid grid-col-${(
                        parseInt(grid) * 2
                      ).toString()}`}
                    >
                      <th
                        className={`th text-left`}
                        style={{ borderRight: "none" }}
                      >
                        Urdu
                      </th>
                      <th
                        className={`th text-center`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-center`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).urdu
                              }
                            </th>
                            <th className={`th text-center`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-center`}>
                        {/* Displaying the total obtained marks here */}
                        {marksData.reduce(
                          (total, mdata) =>
                            total +
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).urdu,

                          0
                        )}
                      </th>
                      <th className={`th text-center`}>
                        {/* Displaying the total maximum marks here */}
                        {marksData.reduce(
                          (total, subject) => total + parseInt(subject.marks),
                          0
                        )}
                      </th>
                    </tr>
                    <tr
                      style={{ width: "100%" }}
                      className={`grid grid-col-${(
                        parseInt(grid) * 2
                      ).toString()}`}
                    >
                      <th
                        className={`th text-left`}
                        style={{ borderRight: "none" }}
                      >
                        Kashmiri
                      </th>
                      <th
                        className={`th text-center`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-center`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).kashmiri
                              }
                            </th>
                            <th className={`th text-center`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-center`}>
                        {/* Displaying the total obtained marks here */}
                        {marksData.reduce(
                          (total, mdata) =>
                            total +
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).kashmiri,

                          0
                        )}
                      </th>
                      <th className={`th text-center`}>
                        {/* Displaying the total maximum marks here */}
                        {marksData.reduce(
                          (total, subject) => total + parseInt(subject.marks),
                          0
                        )}
                      </th>
                    </tr>

                    {grade && (
                      <tr
                        style={{ width: "100%" }}
                        className={`grid grid-col-${(
                          parseInt(grid) * 2
                        ).toString()}`}
                      >
                        <th
                          className={`th text-left`}
                          style={{ borderRight: "none" }}
                        >
                          SST
                        </th>
                        <th
                          className={`th text-center`}
                          style={{ borderLeft: "none" }}
                        ></th>
                        {marksData.map((mdata) => {
                          return (
                            <>
                              <th className={`th text-center`}>
                                {
                                  mdata.data[0].find(
                                    (ST) => ST.admission == parseInt(admission)
                                  ).sst
                                }
                              </th>
                              <th className={`th text-center`}>
                                {mdata.marks}
                              </th>
                            </>
                          );
                        })}
                        <th className={`th text-center`}>
                          {/* Displaying the total obtained marks here */}
                          {marksData.reduce(
                            (total, mdata) =>
                              total +
                              mdata.data[0].find(
                                (ST) => ST.admission == parseInt(admission)
                              ).sst,

                            0
                          )}
                        </th>
                        <th className={`th text-center`}>
                          {/* Displaying the total maximum marks here */}
                          {marksData.reduce(
                            (total, subject) => total + parseInt(subject.marks),
                            0
                          )}
                        </th>
                      </tr>
                    )}

                    <tr
                      style={{ width: "100%" }}
                      className={`grid grid-col-${(
                        parseInt(grid) * 2
                      ).toString()}`}
                    >
                      <th
                        className={`th text-left`}
                        style={{ borderRight: "none" }}
                      >
                        TOTAL
                      </th>
                      <th
                        className={`th text-center`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th
                              className={
                                pass
                                  ? `th text-center text-green-800`
                                  : "th text-center text-red-800"
                              }
                            >
                              {grade
                                ? eval(
                                    mdata.data[0].find(
                                      (ST) =>
                                        ST.admission == parseInt(admission)
                                    ).english +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).math +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).science +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).urdu +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).kashmiri +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).sst
                                  )
                                : !isNotEVS
                                ? eval(
                                    mdata.data[0].find(
                                      (ST) =>
                                        ST.admission == parseInt(admission)
                                    ).english +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).math +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).science +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).urdu +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).kashmiri
                                  )
                                : eval(
                                    mdata.data[0].find(
                                      (ST) =>
                                        ST.admission == parseInt(admission)
                                    ).english +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).math +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).urdu +
                                      mdata.data[0].find(
                                        (ST) =>
                                          ST.admission == parseInt(admission)
                                      ).kashmiri
                                  )}
                            </th>
                            <th className={`th text-center `}>
                              {grade
                                ? parseInt(mdata.marks) * 6
                                : !isNotEVS
                                ? parseInt(mdata.marks) * 5
                                : parseInt(mdata.marks) * 4}
                            </th>
                          </>
                        );
                      })}
                      <th
                        className={
                          pass
                            ? `th text-center text-green-800`
                            : "th text-center text-red-800"
                        }
                      >
                        {/* Displaying the total obtained marks here */}

                        {totalMarks}
                      </th>
                      <th className={`th text-center `}>
                        {/* Displaying the total maximum marks here */}
                        {grade
                          ? marksData.reduce(
                              (total, subject) =>
                                total + parseInt(subject.marks),
                              0
                            ) * 6
                          : !isNotEVS
                          ? marksData.reduce(
                              (total, subject) =>
                                total + parseInt(subject.marks),
                              0
                            ) * 5
                          : marksData.reduce(
                              (total, subject) =>
                                total + parseInt(subject.marks),
                              0
                            ) * 4}
                      </th>
                    </tr>
                  </table>
                </div>

                <div
                  className="grade relative grid grid-cols-2 grid-rows-3 font-bold gap-4 text-xl w-[90vw] z-10"
                  style={{ marginTop: "380px" }}
                >
                  <div>
                    OVERALL RESULT:{" "}
                    <span>
                      {pass ? (
                        <span className=" text-green-800"> PASS</span>
                      ) : (
                        <span className=" text-red-800">FAIL</span>
                      )}
                    </span>
                  </div>
                  <div>
                    RANK:{" "}
                    <span
                      className={
                        pass && rank == "Nil"
                          ? "text-yellow-700"
                          : pass
                          ? "text-green-800"
                          : "text-red-800"
                      }
                    >
                      {rank}
                    </span>
                  </div>
                  <div>
                    OVERALL GRADE:{" "}
                    <span className={pass ? "text-green-800" : "text-red-800"}>
                      {overallGrade}
                    </span>
                  </div>
                  <div>
                    <div>
                      PERCENTAGE:{" "}
                      <span
                        className={pass ? "text-green-800" : "text-red-800"}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-screen grid grid-cols-3 font-bold fixed bottom-16 left-6">
                <div className="text-center relative">
                  <Image
                    src="/incharge-sign.png"
                    alt=""
                    width={100}
                    height={50}
                    priority
                    className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-[90%]"
                  />
                  EXAMINATION INCHARGE
                </div>
                <div className="text-center relative">
                  <Image
                    src="/checked-by-sign.png"
                    alt=""
                    width={150}
                    height={100}
                    priority
                    className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-[75%]"
                  />
                  CHECKED BY
                </div>
                <div className="text-center relative">
                  <Image
                    src="/headmaster-sign.png"
                    alt=""
                    width={150}
                    height={100}
                    priority
                    className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-[90%]"
                  />
                  HEADMASTER
                </div>
              </div>
              <div className=" bottom-0 fixed bg-white w-[95%] h-9 btm-wr lg:hidden"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

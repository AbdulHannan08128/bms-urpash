"use client";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import "./CARD_2024.css";

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

  if (error) {
    return <div>Error: {error}</div>;
  }
  // Function to adjust content size for printing
  function adjustContentSizeForPrinting() {
    const content = document.getElementById("print"); // Replace 'content' with the ID of your content container
    const printableHeight = window.innerHeight; // Get the height of the printable area

    const contentHeight = content.offsetHeight; // Get the height of the content

    // If the content height exceeds the printable height, scale it down
    if (contentHeight > printableHeight) {
      const scaleFactor = printableHeight / contentHeight;
      content.style.transform = `scale(${scaleFactor})`;
    }
  }

  // Call the function when the page is loaded
  window.onload = adjustContentSizeForPrinting;

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
            onClick={() => {
              adjustContentSizeForPrinting();
              window.print();
            }}
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
      <div>
        <div className="wHIDE w-screen h-screen" id="print">
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
                <div className="innerGRID">
                  <div>
                    <h2 className="text-2xl font-bold text-center tracking-tight">
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
                      PROGRESS REPORT
                    </h2>
                  </div>
                </div>
              </div>
              <div className="details w-screen h-auto p-14 capitalize">
                <div className="flex flex-col gap-4">
                  <div className="font-bold">Name: {student.name}</div>
                  <div className="font-bold">
                    Father's Name: {student.father}
                  </div>
                  <div className="font-bold">Class: {student.grade}</div>
                  <div className="font-bold">Roll No.: {student.roll}</div>
                  <div className="font-bold">
                    Admission No.: {student.admission}
                  </div>
                </div>
                <div className="table mt-5 absolute left-10" style={{}}>
                  <table className="th">
                    <tr
                      className={`grid grid-col-${grid}`}
                      style={{ width: "90vw" }}
                    >
                      <th className="uppercase th text-left">Subjects</th>

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
                        className={`th text-left`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-left`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).english
                              }
                            </th>
                            <th className={`th text-left`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-left`}>
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
                      <th className={`th text-left`}>
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
                        className={`th text-left`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-left`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).math
                              }
                            </th>
                            <th className={`th text-left`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-left`}>
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
                      <th className={`th text-left`}>
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
                        EVS
                      </th>
                      <th
                        className={`th text-left`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-left`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).science
                              }
                            </th>
                            <th className={`th text-left`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-left`}>
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
                      <th className={`th text-left`}>
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
                        Urdu
                      </th>
                      <th
                        className={`th text-left`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-left`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).urdu
                              }
                            </th>
                            <th className={`th text-left`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-left`}>
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
                      <th className={`th text-left`}>
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
                        className={`th text-left`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-left`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).kashmiri
                              }
                            </th>
                            <th className={`th text-left`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-left`}>
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
                      <th className={`th text-left`}>
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
                        SST
                      </th>
                      <th
                        className={`th text-left`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-left`}>
                              {
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).sst
                              }
                            </th>
                            <th className={`th text-left`}>{mdata.marks}</th>
                          </>
                        );
                      })}
                      <th className={`th text-left`}>
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
                      <th className={`th text-left`}>
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
                        TOTAL
                      </th>
                      <th
                        className={`th text-left`}
                        style={{ borderLeft: "none" }}
                      ></th>
                      {marksData.map((mdata) => {
                        return (
                          <>
                            <th className={`th text-left`}>
                              {eval(
                                mdata.data[0].find(
                                  (ST) => ST.admission == parseInt(admission)
                                ).english +
                                  mdata.data[0].find(
                                    (ST) => ST.admission == parseInt(admission)
                                  ).math +
                                  mdata.data[0].find(
                                    (ST) => ST.admission == parseInt(admission)
                                  ).science +
                                  mdata.data[0].find(
                                    (ST) => ST.admission == parseInt(admission)
                                  ).urdu +
                                  mdata.data[0].find(
                                    (ST) => ST.admission == parseInt(admission)
                                  ).kashmiri +
                                  mdata.data[0].find(
                                    (ST) => ST.admission == parseInt(admission)
                                  ).sst
                              )}
                            </th>
                            <th className={`th text-left`}>
                              {parseInt(mdata.marks) * 6}
                            </th>
                          </>
                        );
                      })}
                      <th className={`th text-left`}>
                        {/* Displaying the total obtained marks here */}
                        {marksData.reduce(
                          (total, mdata) =>
                            total +
                            mdata.data[0].find(
                              (ST) => ST.admission == parseInt(admission)
                            ).english,

                          0
                        ) +
                          marksData.reduce(
                            (total, mdata) =>
                              total +
                              mdata.data[0].find(
                                (ST) => ST.admission == parseInt(admission)
                              ).math,

                            0
                          ) +
                          marksData.reduce(
                            (total, mdata) =>
                              total +
                              mdata.data[0].find(
                                (ST) => ST.admission == parseInt(admission)
                              ).science,

                            0
                          ) +
                          marksData.reduce(
                            (total, mdata) =>
                              total +
                              mdata.data[0].find(
                                (ST) => ST.admission == parseInt(admission)
                              ).urdu,

                            0
                          ) +
                          marksData.reduce(
                            (total, mdata) =>
                              total +
                              mdata.data[0].find(
                                (ST) => ST.admission == parseInt(admission)
                              ).kashmiri,

                            0
                          ) +
                          marksData.reduce(
                            (total, mdata) =>
                              total +
                              mdata.data[0].find(
                                (ST) => ST.admission == parseInt(admission)
                              ).sst,

                            0
                          )}
                      </th>
                      <th className={`th text-left`}>
                        {/* Displaying the total maximum marks here */}
                        {marksData.reduce(
                          (total, subject) => total + parseInt(subject.marks),
                          0
                        ) * 6}
                      </th>
                    </tr>
                  </table>
                </div>

                <div
                  className="grade absolute flex flex-col font-bold gap-4 text-xl"
                  style={{ marginTop: "380px" }}
                >
                  <div>OVERALL POSITION: ____________</div>
                  <div>OVERALL GRADE: ____________</div>
                </div>
                <div className="w-screen grid grid-cols-3 font-bold absolute bottom-16 left-6">
                  <div className="text-center">EXAMINATION INCHARGE</div>
                  <div className="text-center">CHECKED BY</div>
                  <div className="text-center">HEADMASTER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

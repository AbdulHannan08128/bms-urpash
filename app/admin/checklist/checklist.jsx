"use client";
import React, { useEffect, useState } from "react";
import Select from "./Select";
import { get } from "../../../functions/axios.get";
import { post } from "../../../functions/axios.post";

import Link from "next/link";
export const dynamic = "force-dynamic";
export const dynamicParams = true;
import styles from "./checklist.module.css";
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;
import { useRouter } from "next/navigation";

export default function Checklist(props) {
  const router = useRouter();
  const [grade, setGrade] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Delete, setDelete] = useState(false);
  const [Deleted, setDeleted] = useState(false);
  const [deleteItem, setDeleteItem] = useState("Ayaan");
  async function getData(grade) {
    setLoading(true);
  
    get(
      `${props.URL}?grade=${grade}`,
      (response) => {
        setData(response.data);
        // alert('Success');
        console.log(response.data);
        console.log(data);
        setLoading(false);
      },
      () => {
        // alert('An Error Occurred');
        setLoading(false);
      }
    );
  }
  async function getAllData() {
    setLoading(true);
    get(
      `${props.URL}`,
      (response) => {
        setData(response.data);
        // alert('Success');
        console.log(response.data);
        console.log(data);
        setLoading(false);
      },
      () => {
        // alert('An Error Occurred');
        setLoading(false);
      }
    );
  }
  async function deleteConformation() {
    if (Delete) {
      setDelete(false);
    } else {
      setDelete(true);
    }
  }
  async function DELETED() {
    if (Deleted) {
      setDeleted(false);
    } else {
      setDeleted(true);
    }
  }

  async function DELETE() {
    await post(props.deleteURL, deleteItem.admission, ()=>{
      
      deleteConformation();
      DELETED();
      getData(deleteItem.grade);
      
    },
    ()=>{
      alert('fail')
    })
  }

  useEffect(() => {
    if (grade == "all") {
      getAllData();
      router.refresh();
    } else if (grade) {
      getData(grade);
      router.refresh();
    }
  }, [grade]);

  return (
    <>
      <div className="w-auto h-auto p-0 mt-6 flex align-middle justify-center flex-col gap-0">
        <Select Function={setGrade} />

        <div className="overflow-scroll rounded-lg border border-gray-200 shadow-md m-5">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium text-gray-900 pl-5"
                >
                  Name
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Roll
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Father
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Mother
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Phone
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Class
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Adm No.
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Category
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Address
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Acc No.
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Aadhar
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  DOB
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 font-medium text-gray-900"
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {data
                ? data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                        <div className="relative h-10 w-10">
                          {/* Render the image here */}
                          {item.photo ? (
                            <img
                              src={`data:image/png;base64,${Uint8Array.from(
                                item.photo.data
                              ).reduce(
                                (data, byte) =>
                                  data + String.fromCharCode(byte),
                                ""
                              )}`}
                              alt="Binary Image"
                              width={50}
                              height={50}
                              className={styles.img}
                            />
                          ) : (
                            <span className="block w-10 h-10 bg-slate-400 rounded-full"></span>
                          )}
                          {/* Use the appropriate status indicator here */}
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-700">
                            {item.name}
                          </div>
                          <div className="text-gray-400">{item.email}</div>
                        </div>
                      </th>
                      <td className="px-6 py-4">{item.roll}</td>
                      <td className="px-6 py-4">{item.father}</td>
                      <td className="px-6 py-4">{item.mother}</td>
                      <td className="px-6 py-4">{item.phone}</td>
                      <td className="px-6 py-4">{item.grade}</td>
                      <td className="px-6 py-4">{item.admission}</td>
                      <td className="px-6 py-4">{item.category}</td>
                      <td className="px-6 py-4">{item.address}</td>
                      <td className="px-6 py-4">{item.account}</td>
                      <td className="px-6 py-4">{item.aadhar}</td>
                      <td className="px-6 py-4">{item.dob}</td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <Link
                            href={"/admin/checklist/edit/" + item.admission}
                          >
                            <button className="print-button md:inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded PHIDE">
                              EDIT
                            </button>
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-4">
                          <button
                            className="print-button md:inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded PHIDE"
                            onClick={() => {
                              setDeleteItem(item);
                              deleteConformation();
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
          {loading ? (
            <div className="flex justify-center items-center w-screen h-screen absolute top-0 left-0 backdrop-blur">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-900 m-2"></div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {Delete ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <svg
              className="w-20 h-20 text-red-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M7 6l1 12a2 2 0 002 2h4a2 2 0 002-2l1-12M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"></path>
            </svg>

            <h3 className="text-xl font-normal text-gray-800 mt-5 mb-6">
              Conform to delete {deleteItem.name}
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                onClick={deleteConformation}
              >
                Cancel
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600" onClick={DELETE}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}



{Deleted?
<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <svg
                    className="w-20 h-20 text-green-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <h3 className="text-xl font-normal text-gray-800 mt-5 mb-6">Student Deleted Successfully</h3>
                <div className="flex justify-center space-x-4">
                    <button
                      
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                        onClick={DELETED}
                    >
                        Close
                    </button>
                    <button
                       
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                        onClick={DELETED}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>:''}
    </>
  );
}

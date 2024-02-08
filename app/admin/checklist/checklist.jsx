'use client'
import React, { useEffect, useState } from 'react';
import Select from './Select';
import { get } from '../../../functions/axios.get';
import Link from 'next/link'
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;
import {useRouter} from 'next/navigation'

export default function Checklist(props) {
  const router = useRouter();
    const [grade, setGrade] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getData(grade) {
        setLoading(true)
        get(`${props.URL}?grade=${grade}`, (response) => {
            setData(response.data);
            // alert('Success');
            console.log(response.data);
            console.log(data);
            setLoading(false);
        }, () => {
            // alert('An Error Occurred');
            setLoading(false);
        });
    }
    async function getAllData() {
        setLoading(true)
        get(`${props.URL}`, (response) => {
            setData(response.data);
            // alert('Success');
            console.log(response.data);
            console.log(data);
            setLoading(false);
        }, () => {
            // alert('An Error Occurred');
            setLoading(false);
        });
    }
    
    useEffect(() => {
        if (grade=='all') {
            getAllData();
            router.refresh();
        }
        else if(grade) {
            getData(grade);
            router.refresh();
        }
    }, [grade]);
   

    return (
        <>
            <div className='w-auto h-auto p-0 mt-6 flex align-middle justify-center flex-col gap-0'>
                <Select Function={setGrade} />

                <div className="overflow-scroll rounded-lg border border-gray-200 shadow-md m-5">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900 pl-5">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Roll
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Parentage
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
                                    Aadhar
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    DOB
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                            {data?data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                        <div className="relative h-10 w-10">
                                            {/* Render the image here */}
                                         {item.photo?   <img
                            src={`data:image/png;base64,${Uint8Array.from(
                              item.photo.data
                            ).reduce(
                              (data, byte) => data + String.fromCharCode(byte),
                              ""
                            )}`}
                            alt="Binary Image"
                            width={50}
                            height={50}
                            className={styles.binimage}
                          />
                                         
                                       :<span className='block w-10 h-10 bg-slate-400 rounded-full'></span> }
                                            {/* Use the appropriate status indicator here */}
                                          
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-700">{item.name}</div>
                                            <div className="text-gray-400">{item.email}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{item.roll}</td>
                                    <td className="px-6 py-4">{item.parentage}</td>
                                    <td className="px-6 py-4">{item.phone}</td>
                                    <td className="px-6 py-4">{item.grade}</td>
                                    <td className="px-6 py-4">{item.admission}</td>
                                    <td className="px-6 py-4">{item.aadhar}</td>
                                    <td className="px-6 py-4">{item.dob}</td>
                                    
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-4">
                                       <Link href={'/admin/checklist/edit/'+item.admission}>
                                       <button className="print-button md:inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded PHIDE">
                                      EDIT
                                   </button>
                                       </Link>
                                        </div>
                                    </td>
                                </tr>
                            )):''}
                        </tbody>
                    </table>
                    {loading? <div className="flex justify-center items-center w-screen h-screen absolute top-0 left-0 backdrop-blur">
                            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-900 m-2"></div>
                          </div>:''}
                </div>
            </div>

        </>
    );
}

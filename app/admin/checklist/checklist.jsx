'use client'
import React, { useEffect, useState } from 'react';
import Select from './Select';
import { get } from '../../../functions/axios.get';
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

    async function getData(grade) {
        get(`${props.URL}?grade=${grade}`, (response) => {
            setData(response.data);
            alert('Success');
            console.log(response.data);
            console.log(data);
        }, () => {
            // alert('An Error Occurred');
        });
    }

    useEffect(() => {
        if (grade) {
            getData(grade);
            router.refresh();
        }
    }, [grade]);
   

    return (
        <>
            <div className='w-auto h-auto p-20 flex align-middle justify-center flex-col gap-0'>
                <Select Function={setGrade} />

                <div className="overflow-scroll rounded-lg border border-gray-200 shadow-md m-5">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                                    Name-Aadhar
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
                                <th scope="col" className="px-6 py-4 font-medium text-gray-900" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                        <div className="relative h-10 w-10">
                                            {/* Render the image here */}
                                         {item.photo&&    <img
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
                                         
                                        }
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
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-4">
                                            {/* Add your delete and edit buttons here */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

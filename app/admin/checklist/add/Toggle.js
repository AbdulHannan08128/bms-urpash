'use client'
import ExcelForm from './excelForm'
import React,{useState} from 'react'
import Form from './Form'



export default function Toggle(props) {
    const [selectedOption, setSelectedOption] = useState('');
    const [toggle, setToggle] = useState();
    const options = [
        { label: 'Excel', value: 'Excel' },
        {label: 'Form', value:'Form'}
        
    ];

    
    const handleSelect = (selectedValue) => {
        console.log('Selected Option:', selectedValue);
        
    };
    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        setToggle(value)
    };

  return (
   <>
    <div className="container mx-auto p-4">
            
    <div className="relative inline-block w-64 PHIDE">
            <select
                value={selectedOption}
                onChange={handleSelectChange}
                className="block appearance-none w-full bg-gradient-to-r from-blue-200 to-blue-300 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300 ease-in-out hover:border-gray-500 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-400 cursor-pointer shadow-md"
            >
                <option value="">Select Method</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                    className="fill-current h-4 w-4 transition duration-300 ease-in-out transform hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414zM7 11a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
        </div>



   {toggle=='Excel'?<ExcelForm BULK_URL={props.BULK_URL}/>:''}
   {toggle=='Form'?<Form POST_URL={props.ADD_POST_URL}/>:''}
   </>
  )
}

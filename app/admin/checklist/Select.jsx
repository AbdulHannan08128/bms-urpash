'use client'
import React, { useState } from 'react';
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 10;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;
function CustomSelect({ options, onSelect }) {
    const [selectedOption, setSelectedOption] = useState('');
   

    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        onSelect(value);
    };

    return (
        <div className="relative inline-block w-64">
            <select
                value={selectedOption}
                onChange={handleSelectChange}
                className="block appearance-none w-full bg-gradient-to-r from-blue-200 to-blue-300 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition duration-300 ease-in-out hover:border-gray-500 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-400 cursor-pointer shadow-md"
            >
                <option value="">Select Class</option>
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
    );
}

function MyComponent(props) {
    const options = [
        { label: 'Ist', value: 'Ist' },
        { label: '2nd', value: '2nd' },
        { label: '3rd', value: '3rd' },
        { label: '4th', value: '4th' },
        { label: '5th', value: '5th' },
        { label: '6th', value: '6th' },
        { label: '7th', value: '7th' },
        { label: '8th', value: '8th' },
        
    ];

    const handleSelect = (selectedValue) => {
        console.log('Selected Option:', selectedValue);
        props.Function(selectedValue);
    };

    return (
        <div className="container mx-auto p-4">
            
            <CustomSelect options={options} onSelect={handleSelect} />
        </div>
    );
}

export default MyComponent;


import React, { useState } from 'react';

const TailwindSelect = (props) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    props.func(event.target.value)
  };

  // Filter out duplicate years
  const uniqueOptions = Array.from(new Set(props.options.map(option => option.year)));

  return (
    <div className="relative">
      <select
        value={selectedOption}
        onChange={handleChange}
        className="block appearance-none w-48 bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
      >
        <option value="" disabled hidden>
          Select an option
        </option>
        {uniqueOptions.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.293 10.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4zM10 0a1 1 0 011 1v9.586l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 01-.293-.707V1a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default TailwindSelect;

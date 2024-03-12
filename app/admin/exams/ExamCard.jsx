import React from 'react';

const ExamCard = ({examName, academicYear, maxMarks}) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      <div className="relative">
        <div className="h-40 md:h-32 bg-gradient-to-r from-purple-400 to-blue-500"></div>
        <div className="absolute top-0 left-0 p-4">
          <span className="text-white font-semibold text-lg md:text-base">{examName}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 lg:gap-10">
          <div className="text-gray-700 mb-2 md:mb-0"><span className="font-semibold text-blue-500">Academic Year: </span>{academicYear}</div>
          <div className="text-gray-700"><span className="font-semibold text-blue-500">Max Marks: </span>{maxMarks}</div>
        </div>
        <div className="text-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;

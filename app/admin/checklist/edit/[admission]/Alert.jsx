import React, { useState } from 'react';
import {useRouter} from 'next/navigation'
function SuccessAlert({ onClose }) {
    
    return (
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
                <h3 className="text-xl font-normal text-gray-800 mt-5 mb-6">Student Updated Successfully</h3>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                    >
                        Close
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

function MyComponent(props) {
    const Router = useRouter();
    const [showSuccessAlert, setShowSuccessAlert] = useState(true);

    const handleClose = () => {
        setShowSuccessAlert(false);
        props.Function(false);
        Router.push('/admin/checklist');

    };

    return (
        <div>
            {showSuccessAlert && <SuccessAlert onClose={handleClose} />}
        </div>
    );
}

export default MyComponent;

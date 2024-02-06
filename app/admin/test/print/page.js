// TableWithPrintButton.js
'use client'
// TableWithPrintButton.js

import React from 'react';

const TableWithPrintButton = () => {
  const printTable = () => {
    const table = document.getElementById('print-table');
    const newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
          <style>
            /* Additional styles for print preview */
            @media print {
              /* Hide print button in print preview */
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body class="p-4">
          <button class="print-button mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="window.print()">Print Table</button>
          ${table.outerHTML}
        </body>
      </html>
    `);
    newWin.document.close();
  };

  return (
    <div className="max-w-md mx-auto">
      <button className="print-button mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={printTable}>Print Table</button>
      <table id="print-table" className="table-auto border-collapse border border-gray-800">
        <thead>
          <tr>
            <th className="border border-gray-800 px-4 py-2">Header 1</th>
            <th className="border border-gray-800 px-4 py-2">Header 2</th>
            {/* Add more table headers if needed */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-800 px-4 py-2">Data 1</td>
            <td className="border border-gray-800 px-4 py-2">Data 2</td>
            {/* Add more table data rows if needed */}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableWithPrintButton;


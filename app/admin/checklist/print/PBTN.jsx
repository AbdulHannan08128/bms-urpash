'use client'
import React from 'react'

export default function PBTN() {
  return (
    <button className="print-button hidden md:inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded PHIDE absolute right-5 top-5" onClick={() => window.print()}>
      Print
    </button>
  )
}

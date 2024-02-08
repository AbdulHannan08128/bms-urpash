'use client'
import React from 'react'

export default function PBTN() {
  return (
    <button className="print-button md:inline-block bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded PHIDE fixed bottom-5 right-5" onClick={() => window.print()}>
      Print
    </button>
  )
}

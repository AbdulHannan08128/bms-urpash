import React from 'react'

export default function Title(props) {
  return (
    <h1 className=' w-auto h-20 block m-2 p-2 bg-gradient-to-tr from-gray-600 to-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] hover:cursor-pointer' style={{borderRadius:'12px', display:'flex', alignItems:'center', paddingLeft:'20px', fontSize:'2.6rem', letterSpacing:'2px', fontWeight:'bold', overflow:'scroll'}}>{props.title}</h1>
  )
}

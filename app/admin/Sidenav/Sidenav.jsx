'use client'

import './Sidenav.css'

import Link from 'next/link' 

export default function Sidenav() {
  

 function toggle(){
     document.querySelector('#sn').classList.toggle('-translate-x-80');
     document.querySelector('#sn').classList.toggle('open');
     

  }
  
  return (
  <>
  
  <div className='so PHIDE' onClick={toggle} >OPEN</div>
  <aside className="bg-white shadow-sm -translate-x-80 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 PHIDE" id='sn' onClick={toggle} style={{overflowY:"scroll"}}>
  <div className="relative overflow-scroll" style={{overflowY:"scroll"}}>
    <Link className="py-6 px-8 text-center" href="/admin">
      <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900">
        Teacher Admin Panel
      </h6>
    </Link>
    <button
      className="align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
      type="button"
      fdprocessedid="t8t7bo"
    >
      <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          aria-hidden="true"
          className="h-5 w-5 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </span>
    </button>
  </div>
  <div className="m-4" style={{overflowY:"scroll", paddingBottom:'20px'}}>
    <ul className="mb-4 flex flex-col gap-1">
      <li>
        <Link className="active" href="/" aria-current="page">
          <button
            className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] w-full flex items-center gap-4 px-4 capitalize"
            type="button"
            fdprocessedid="z8oerl"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-inherit"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
              dashboard
            </p>
          </button>
        </Link>
      </li>
      <li>
        <Link className="" href="/admin/profile">
          <button
            className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 w-full flex items-center gap-4 px-4 capitalize"
            type="button"
            fdprocessedid="i0znna"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-inherit"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
              profile
            </p>
          </button>
        </Link>
      </li>
      
      <li>
        <Link className="" href="/admin/exams">
          <button
            className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 w-full flex items-center gap-4 px-4 capitalize"
            type="button"
            fdprocessedid="cn956l"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-inherit"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
              exams
            </p>
          </button>
        </Link>
      </li>
    </ul>
    <ul className="mb-4 flex flex-col gap-1">
      <li className="mx-3.5 mt-4 mb-2">
        <Link href='/admin/checklist'>
      <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-black uppercase opacity-75">
          checklist
        </p>
        </Link>
      </li>
      <li>
        <Link className="" href="/admin/checklist/add">
          <button
            className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 w-full flex items-center gap-4 px-4 capitalize"
            type="button"
            fdprocessedid="3mrx69"
          >
              <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 00-1 1v6H3a1 1 0 100 2h6v6a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
              add
            </p>
          </button>
        </Link>
      </li>
      <li>
        <Link className="" href="/admin/checklist/print">
          <button
            className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 w-full flex items-center gap-4 px-4 capitalize"
            type="button"
            fdprocessedid="ie9hpg"
          >
            <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16M8 6V2h8V6M12 22V18"
      />
    </svg>
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
              print
            </p>
          </button>
        </Link>
      </li>
    </ul>
    <ul className="mb-4 flex flex-col gap-1">
      <li className="mx-3.5 mt-4 mb-2">
        <Link href='/admin/accounts'>
      <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-black uppercase opacity-75">
          accounts
        </p>
        </Link>
      </li>
      <li>
        <Link className="" href="/admin/accounts/teachers">
          <button
            className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 w-full flex items-center gap-4 px-4 capitalize"
            type="button"
            fdprocessedid="3mrx69"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-inherit"
            >
              <path d="M5.507 4.048A3 3 0 017.785 3h8.43a3 3 0 012.278 1.048l1.722 2.008A4.533 4.533 0 0019.5 6h-15c-.243 0-.482.02-.715.056l1.722-2.008z" />
              <path
                fillRule="evenodd"
                d="M1.5 10.5a3 3 0 013-3h15a3 3 0 110 6h-15a3 3 0 01-3-3zm15 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm2.25.75a.75.75 0 100-1.5.75.75 0 000 1.5zM4.5 15a3 3 0 100 6h15a3 3 0 100-6h-15zm11.25 3.75a.75.75 0 100-1.5.75.75 0 000 1.5zM19.5 18a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                clipRule="evenodd"
              />
            </svg>
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
              teachers
            </p>
          </button>
        </Link>
      </li>
      <li>
        <Link className="" href="/admin/accounts/students">
          <button
            className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-blue-gray-500 hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 w-full flex items-center gap-4 px-4 capitalize"
            type="button"
            fdprocessedid="ie9hpg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5 text-inherit"
            >
              <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
            </svg>
            <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
              students
            </p>
          </button>
        </Link>
      </li>
    </ul>
  </div>
</aside>

  </>
  )
}

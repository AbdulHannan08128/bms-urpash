import React from 'react'
import Title from './title/Title'
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

export default function page() {
  return (
  <>
     <Title title='Dashboard'/>
    
  <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
 
  
  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 shadow-sm">
    <div className="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-12 w-12 place-items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="w-6 h-6 text-white"
      >
        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
      </svg>
    </div>
    <div className="p-4 text-right">
      <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
        Total Students
      </p>
      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
        340
      </h4>
    </div>
    <div className="border-t border-blue-gray-50 p-4">
      <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
        <strong className="text-green-500">...</strong>
      </p>
    </div>
  </div>
  <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 shadow-sm">
    <div className="bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 absolute grid h-12 w-12 place-items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="w-6 h-6 text-white"
      >
        <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
      </svg>
    </div>
    <div className="p-4 text-right">
      <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
        Total Teachers
      </p>
      <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
       10
      </h4>
    </div>
    <div className="border-t border-blue-gray-50 p-4">
      <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
        <strong className="text-red-500">...</strong>
      </p>
    </div>
  </div>
 
 
</div>
  








  <div>
  <>
  {/* component */}
  <div className="overflow-scroll rounded-lg border border-gray-200 shadow-md m-5">
    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-4 font-medium text-gray-900">
            Name
          </th>
          <th scope="col" className="px-6 py-4 font-medium text-gray-900">
            State
          </th>
          <th scope="col" className="px-6 py-4 font-medium text-gray-900">
            Role
          </th>
          <th scope="col" className="px-6 py-4 font-medium text-gray-900">
            Team
          </th>
          <th scope="col" className="px-6 py-4 font-medium text-gray-900" />
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 border-t border-gray-100">
        <tr className="hover:bg-gray-50">
          <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
            <div className="relative h-10 w-10">
              <img
                className="h-full w-full rounded-full object-cover object-center"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">Steven Jobs</div>
              <div className="text-gray-400">jobs@sailboatui.com</div>
            </div>
          </th>
          <td className="px-6 py-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Active
            </span>
          </td>
          <td className="px-6 py-4">Product Designer</td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Design
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                Product
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                Develop
              </span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-4">
              <a x-data="{ tooltip: 'Delete' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </a>
              <a x-data="{ tooltip: 'Edite' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </a>
            </div>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
            <div className="relative h-10 w-10">
              <img
                className="h-full w-full rounded-full object-cover object-center"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">Steven Jobs</div>
              <div className="text-gray-400">jobs@sailboatui.com</div>
            </div>
          </th>
          <td className="px-6 py-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Active
            </span>
          </td>
          <td className="px-6 py-4">Product Designer</td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Design
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                Product
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                Develop
              </span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-4">
              <a x-data="{ tooltip: 'Delete' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </a>
              <a x-data="{ tooltip: 'Edite' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </a>
            </div>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
            <div className="relative h-10 w-10">
              <img
                className="h-full w-full rounded-full object-cover object-center"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">Steven Jobs</div>
              <div className="text-gray-400">jobs@sailboatui.com</div>
            </div>
          </th>
          <td className="px-6 py-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Active
            </span>
          </td>
          <td className="px-6 py-4">Product Designer</td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Design
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                Product
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                Develop
              </span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-4">
              <a x-data="{ tooltip: 'Delete' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </a>
              <a x-data="{ tooltip: 'Edite' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </a>
            </div>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
            <div className="relative h-10 w-10">
              <img
                className="h-full w-full rounded-full object-cover object-center"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">Steven Jobs</div>
              <div className="text-gray-400">jobs@sailboatui.com</div>
            </div>
          </th>
          <td className="px-6 py-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Active
            </span>
          </td>
          <td className="px-6 py-4">Product Designer</td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Design
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                Product
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                Develop
              </span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-4">
              <a x-data="{ tooltip: 'Delete' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </a>
              <a x-data="{ tooltip: 'Edite' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </a>
            </div>
          </td>
        </tr>
        <tr className="hover:bg-gray-50">
          <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
            <div className="relative h-10 w-10">
              <img
                className="h-full w-full rounded-full object-cover object-center"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-700">Steven Jobs</div>
              <div className="text-gray-400">jobs@sailboatui.com</div>
            </div>
          </th>
          <td className="px-6 py-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Active
            </span>
          </td>
          <td className="px-6 py-4">Product Designer</td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                Design
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                Product
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                Develop
              </span>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-4">
              <a x-data="{ tooltip: 'Delete' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </a>
              <a x-data="{ tooltip: 'Edite' }" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                  x-tooltip="tooltip"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</>


  </div>
</>

  )
}

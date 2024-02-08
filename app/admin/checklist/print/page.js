import React from 'react'
import Checklist from '../checklist'
export const dynamic = "force-dynamic";
export const dynamicParams = true;
import PBTN from './PBTN.jsx'
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;
export default function page() {
  return (
   <>
   <PBTN/>
   <Checklist URL={process.env.BULK_URL}/>
   </>
  )
}

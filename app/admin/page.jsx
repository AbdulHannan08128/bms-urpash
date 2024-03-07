import React from 'react'
import Title from './title/Title'
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;
import LIST from './checklist/checklist'
import NO from './NO'
export default async function page() {
 
  return (
  <>
     <Title title='Dashboard'/>
    <NO  URL={process.env.BULK_URL}/>
 






<LIST  URL={process.env.BULK_URL} deleteURL={process.env.deleteURL}/>
  
</>

  )
}

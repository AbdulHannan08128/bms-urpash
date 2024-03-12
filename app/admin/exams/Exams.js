'use client'
import {useEffect, useState} from 'react'
import Card from './ExamCard'
import {get} from '../../../functions/axios.get'
export default function Exams(props) {
  let [data, setData] = useState([]);
  let [loading, setLoading] = useState(true);

  async function getData(){
    setLoading(true)
   await get(props.url,async (DATA)=>{
      setData(DATA.data);
      setLoading(false)
      
   })
  }

  useEffect(()=>{
    getData();
  },[])


  return (
   <>
   <h3 className='bold italic' style={{fontSize:'2rem', paddingLeft:'20px'}}>EXAM LIST</h3>
   <div style={{display:'flex', flexWrap:'wrap', rowGap:'50px', marginTop:'60px'}}>
    
   {data && data.map((Exam, index) => (
    <>
        <Card key={index} examName={Exam.name} academicYear={Exam.year} maxMarks={Exam.marks} />
       
        </>
      ))}
       {loading ? (
            <div className="flex justify-center items-center backdrop-blur">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-900 m-2"></div>
            </div>
          ) : (
            ""
          )}
   
   </div>




   
   </>
  )
}

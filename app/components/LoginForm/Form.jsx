'use client'
import {useEffect, useState} from 'react'
import styles from './Form.module.css'
import {post} from '../../../functions/axios.post'
import {Redirect} from '../../../functions/Redirect'
import Error from '../Error/Error';
import Link from 'next/link'
export default function Form(props) {
  const [id, setId] = useState();
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState();
  const [Submit, setSubmit] = useState(false);
    function idC(e) {
      let Id = e.target.value;
      setId(Id);
     
    }
    function passwordC(e) {
      let Pass = e.target.value;
      setPassword(Pass);
     
      
    }
   async function submit(e){
    e.preventDefault();
    setSubmit(true)
    
   let data = {
    id:id,
    password:password
   }

   await post(props.URL,data,async (data)=>{
    
    if (data.data.redirect) {
      await Redirect('/admin');
      setSubmit(false);
    }
    else{
      
      const err = ['Invalid Username or Password'];
      let ERR;
      if (errors) {
         ERR = [...errors];
      } 
     else{
       ERR = [];
     }

      setErrors([...ERR, ...err])
      setSubmit(false);
    }
    
   },
   (err)=>{
    alert('.......Error......')
    console.log(err)
   })
    



   }
  return (
    <>
    <div className={styles.container}>
      <form className={styles.form} onSubmit={submit}>
        <h2>LOG IN</h2>
       <input type="text" placeholder='Your ID' name='id' onChange={idC} value={id}/>
       <input type="password" placeholder='Your Password' name='pass' onChange={passwordC} value={password}/>
       {Submit?<button type='submit' disabled>LOGGING IN</button>:<button type='submit'>LOG IN</button>}


      </form>
    </div>
    <div className='pab20l0'>
    {errors&&errors.map((error)=>{
       return <Error error={error}/>
    })}
    
    </div>
    </>
  )
}

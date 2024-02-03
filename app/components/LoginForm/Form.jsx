'use client'
import {useEffect, useState} from 'react'
import styles from './Form.module.css'
import {post} from '../../../functions/axios.post'
import {Redirect} from '../../../functions/Redirect'
export default function Form(props) {
  const [id, setId] = useState();
  const [password, setPassword] = useState('');

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
    
   let data = {
    id:id,
    password:password
   }

   await post(props.URL,data,async ()=>{
    alert('Submitted')
    await Redirect('/admin')
   },
   (err)=>{
    alert('Error')
    console.log(err)
   })
    



   }
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={submit}>
        <h2>LOG IN</h2>
       <input type="text" placeholder='Your ID' name='id' onChange={idC} value={id}/>
       <input type="password" placeholder='Your Password' name='pass' onChange={passwordC} value={password}/>
       <button type='submit'>LOG IN</button>


      </form>
    </div>
  )
}

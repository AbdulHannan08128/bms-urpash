'use client'
import {useEffect, useState} from 'react'
import styles from './Form.module.css'

export default function Form() {
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
   function submit(e){
    e.preventDefault();
    
   
    



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

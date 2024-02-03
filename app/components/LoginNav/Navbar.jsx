import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'
export default function Navbar() {
  return (
   <nav className={styles.nav}>
    <ul>
      <span>
      <li>
         <Link href='/'>
           <Image src='/LOGO-W.png' alt="LOGO" width={70} height={70} className={styles.logo}/>
           
         </Link>
      </li>
      <li className={styles.title}>
        <h3>Govt. Boys Middle School Urpash</h3>
      </li>
      <li className={styles.marquee}>
        <marquee behavior="" direction="" >
        <h3>Govt. Boys Middle School Urpash</h3>
      </marquee>
      </li>
      </span>
      
      
    </ul>
   </nav>
  )
}

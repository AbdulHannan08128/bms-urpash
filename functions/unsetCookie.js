'use server'
 
import { cookies } from 'next/headers'
 
export async function unsetCookie() {

  
    cookies().set('bms-auth', '', { expires: new Date(0)})
    console.log('Cookie unset Successfully');
  
   
}
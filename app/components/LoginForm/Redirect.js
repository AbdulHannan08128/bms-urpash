'use server'
 
import { redirect } from 'next/navigation'
 
export async function Redirect() {
    console.log('Redirecting Started');
   redirect('/admin');
  
}
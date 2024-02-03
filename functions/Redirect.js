'use server'
 
import { redirect } from 'next/navigation'
 
export async function Redirect(url) {
    console.log('Redirecting Started');
   redirect(url);
  
}
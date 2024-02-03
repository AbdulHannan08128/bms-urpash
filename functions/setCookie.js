'use server'
 
import { cookies } from 'next/headers'
 
export async function setCookie(name, value) {
  const oneYear = 24 * 60 * 60 * 1000 * 365
  if (name==undefined||value==undefined) {
    cookies().set('bms-auth', process.env.key, { expires: Date.now() + oneYear })
    console.log('Cookie Set Successfully');
  }
  else{
    console.log('Cookie Params Got');
  }
}
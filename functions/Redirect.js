
import {redirect} from 'next/navigation'
export default async function Redirect(url){
    console.log('redirected'); 
     redirect(url)
}
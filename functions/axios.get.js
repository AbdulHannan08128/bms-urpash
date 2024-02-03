import axios from "axios";
export async function get(url,success, fail){
   await axios
  .get(url)
  .then(res=> {
     if (typeof(success)=='function') {
        success(res);
     }
     else{
        console.log('Pass functions[success]!');
     }
    
  }).catch(err=>{
    if (typeof(fail)=='function') {
        fail(err);
     }
     else{
        console.log('Pass functions[failure]!');
     }
  });
}
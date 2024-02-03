import {NextResponse} from 'next/server';
import { setCookie } from '@/functions/setCookie';

export async function GET(){
    
    return NextResponse.json({success:'working'});

}

export async function POST(req){
    let data = await req.json();
    if (data.id == process.env.id && data.password == process.env.pass) {
        await setCookie();
        return NextResponse.json({redirect:true});
    }
    else{
        console.log('Invalid User');
        return NextResponse.json({success:'working'});
    }

  

}
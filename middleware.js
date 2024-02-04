import { NextResponse } from "next/server";
import { headers } from "next/headers";

let isLoggedIn = false;

export function middleware(request) {
  // const headersList = headers();
  // const domain = headersList.get("host");
  // const cookie = request.cookies.get("l");

  const auth = request.nextUrl.searchParams.get("key");
  const cookie = request.cookies.get("bms-auth");
  const url = request.url;
  const path = request.nextUrl.pathname;
  if (path=='/api') {
  if (auth == process.env.key) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }
}
else if (path=='/admin') {
  if (cookie) {
  if (cookie.value == process.env.key) {
    isLoggedIn = true;
    
  } else {
    isLoggedIn = false;
    console.log(cookie); 
  }
    
}
else{
  isLoggedIn=false;
}
}
else if (path=='/') {
  if (cookie) {
  if (cookie.value == process.env.key) {
    isLoggedIn = 'LoggedIn';
    
  } else {
    isLoggedIn = 'LogIn';
    console.log(cookie); 
  }
}
else{
  isLoggedIn='LogIn';
}
}

  if (isLoggedIn == true) { 
    isLoggedIn=false;
    return NextResponse.next();
  }
  else if(isLoggedIn=='LoggedIn'){
    isLoggedIn = false;
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  else if(isLoggedIn=='LogIn'){
    isLoggedIn = false;
  }
  else {
    
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [ "/","/api", "/admin"]

};

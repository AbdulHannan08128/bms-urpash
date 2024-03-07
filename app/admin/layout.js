import Sidenav from './Sidenav/Sidenav'

import './admin.css'
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

export default function AdminLayout({ children }) {
    return  (
      <>
      
    <main>
     
      <header>
      <Sidenav logout_URL={process.env.logout_URL}/>
      </header>

       <div className='content'>
        
       <div style={{ overflowY:"scroll"}}>
      {children}
      
      </div>
      </div>
      
    </main>
    </>
    )
  }
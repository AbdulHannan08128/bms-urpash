import Form from './form'
export default function Page({ params }) {
    return(
        <>
        <Form admission={params.admission} URL={process.env.BULK_URL} POST_URL={process.env.UPDATE_POST_URL}/>
        
        </>
    )
  }
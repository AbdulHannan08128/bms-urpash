import Form from './form'
export default function Page({ params }) {
    return(
        <>
        <Form admission={params.admission} URL={'URL'}/>
        <div>{params.admission}</div>
        </>
    )
  }
import Form from './form'
export default function Page({ params, searchParams }) {
    return(
        <>
        <Form
          admission={params.admission}
          id={searchParams?.id}
          grade={searchParams?.grade}
          URL={process.env.BULK_URL || '/api/addStudents'}
          POST_URL={process.env.UPDATE_POST_URL || '/api/updateStudent'}
        />
        </>
    )
  }

import Form from './components/LoginForm/Form';
import Navbar from './components/LoginNav/Navbar'
import styles from './page.module.css'
export default function page() {
  return (
    <div className={styles.page_wrapper}>
    <Navbar/>
    <Form/>
    
    </div>
  )
}

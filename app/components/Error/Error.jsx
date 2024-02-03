import React from 'react'
import Icon from './ErrorIcon'
import './Error.css';
export default function Error(props) {
  return (
    <span className='error'><Icon/>{props.error}</span>
  )
}

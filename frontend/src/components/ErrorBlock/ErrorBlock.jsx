import React, { useEffect } from 'react'
import './ErrorBlock.scss'
import { IoWarningOutline } from "react-icons/io5";

const ErrorBlock = ({errorMessage, setErrorMessage}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            // Clear the error message after 3 seconds
            setErrorMessage('')
        }, 5000);
        return () => clearTimeout(timer);
    })

  return (
    <section className='error'>
      <IoWarningOutline size={50} className='warning-icon'/>
      <span>{errorMessage}</span>
    </section>
  )
}

export default ErrorBlock
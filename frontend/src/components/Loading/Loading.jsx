import React, { useEffect } from 'react'
import './Loading.scss';
import { MdChangeCircle } from "react-icons/md";


const Loading = () => {

  return (
    <section className='loading'>
        <p>Loading Game Data ...</p>
        <MdChangeCircle className='loading-icon' fill='white' size={30}/>
    </section>
  )
}

export default Loading
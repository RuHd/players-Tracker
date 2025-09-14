import React from 'react'
import { IoTrashBinSharp } from "react-icons/io5";
import './ClearListUI.scss'

const ClearListUI = ({setgamesList}) => {
  return (
    <button onClick={()=> setgamesList([])} className='clear-list-btn'>
        <IoTrashBinSharp size={30} fill='white'/>
    </button>
  )
}

export default ClearListUI
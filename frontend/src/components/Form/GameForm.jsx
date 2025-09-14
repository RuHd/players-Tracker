import React, { useEffect, useState, useRef } from 'react'
import { CiSearch } from "react-icons/ci";
import { FaFilter } from "react-icons/fa";
import './GameForm.scss'
import ClearListUI from '../ClearListUI/ClearListUI';


const GameForm = ({postData, gamesList, setgamesList, mobileMode}) => {

    const [showFilter, setshowFilter] = useState(false)
    const [gameTitle, setGameTitle] = useState('')

    const inputRef = useRef(null)

    useEffect(() => {
      inputRef.current.focus()
    }, [])
    

  return (
    <form className={`${mobileMode && "game-form"}`}>
        <label className='inputSearch' >
            <input ref={inputRef} type="text" name="gameTitle" placeholder='Search for a game data' onChange={(e) => setGameTitle(e.target.value.trim())}/>
            <button type='submit' onClick={(e) => postData(e,gameTitle)}>
                <CiSearch size={30} className={"filter-icons"} />
            </button>
        </label>
        <section className='list-options'>

            <label>
                <ClearListUI size={30} setgamesList = {setgamesList} className={"filter-icons"}/>
            </label>

            <label>
                <button type='button' onClick={() => setshowFilter(!showFilter)}>
                    <FaFilter size={30} className={"filter-icons"}/>
                </button>
            
                {/* <ul className= {'filter-list'} style={{opacity: showFilter ? '1' : '0', pointerEvents: showFilter ? 'auto' : 'none'}}>
                    <li>Filter By</li>
                    <li>
                        <button onClick={(e) => filterGameList(e, gamesList, setgamesList)} onMouseOver = {(e) => e.stopPropagation()}type='button'>Players</button>
                    </li>
                    <li>
                        <button onClick={(e) => filterGameList(e, gamesList, setgamesList)} onMouseOver = {(e) => e.stopPropagation()}type='button'>A to Z</button>
                    </li>
                    <li>
                        <button onClick={(e) => filterGameList(e, gamesList, setgamesList)} onMouseOver = {(e) => e.stopPropagation()}type='button'>Z to A</button>
                    </li>
                </ul>  */}
            </label>
        </section>
    </form>
  )
}

export default GameForm
import Image from "next/image"
import { IoCloseCircle } from "react-icons/io5";
import { openModal, refreshPlayersCount, updateFavoriteList } from "@/utils/functions";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import "./GameCard.scss"
import { useEffect, useState } from "react";

const GameCard = ({game, img, id, deleteFunction, setgamesList, favoriteList, setfavoriteList, showFavorite, setmodalStats}) => {

  const [updatedNum, setUpdatedNum] = useState(false);
  const [wasClosed, setwasClosed] = useState(false)
  const [gameStats, setgameStats] = useState({
    appid: id,
    players: game.players,
    name: game.name,
    image: img
  })

  useEffect(() => {
    const interval = setInterval(() => {

      refreshPlayersCount(id, setgamesList, setUpdatedNum, setgameStats, gameStats.players)
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); 
  }, [gameStats]);

  return (
    <article onClick={(e) => openModal(e, gameStats, setmodalStats)} className = {`game-card popsup ${wasClosed ? "closed" : ""}`} style={{display: (showFavorite && favoriteList.every(game => game.appid !== gameStats.appid)) && "none"}}>
      <button onClick={(e) => deleteFunction(e,gameStats.appid, setwasClosed)} className="close-button">
        <IoCloseCircle className="close-icon" size={30}/>
      </button>
      <section className="game-card-info">
          <div className="img-container">
              <Image src={img} alt="game card image" width={100} height={100} unoptimized/> 
          </div>
          <div className="game-info">
              <p className={`playersCount ${updatedNum && "updateAnimation"}`}>
                <IoPersonSharp className="player-icon"/>
                <span>{gameStats.players}</span>
              </p>
          </div>
      </section> 
    </article>
  )
}

export default GameCard
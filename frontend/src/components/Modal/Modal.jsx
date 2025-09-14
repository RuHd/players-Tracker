import React, { useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import './Modal.scss'
import Image from 'next/image'
import { fetchGameData } from '../../utils/functions';

const Thumbnail = ({ src, alt }) => {
    
    return (
        
        <article className='thumbnail'>
            <Image src={src} alt={alt} width={100} height={100} unoptimized />
        </article>
       
    )
}

const Modal = ({gameStats, setErrorMessage}) => {


    const [modalLoaded, setmodalLoaded] = useState(true);
    const [carouselImg, setcarouselImg] = useState([])
    const [price, setprice] = useState("")
    const closeModal = () => {
        setmodalLoaded(false);
        gameStats.setmodalStats(null); // Assuming setmodalStats is passed as a prop or available in context
    }

    useEffect(() => {
        const getData = async () => {
            const {status, data} = await fetchGameData('getStats', 'POST', gameStats)

            if(status == 200) {
                const carouselArr = data['screenshots'].filter(img => img.id < 3 && img)

                setprice(data['price'])
                setcarouselImg(carouselArr);
            } else {
                setErrorMessage('Failed to fetch game data. Please try again later.');
            }
        }

        getData();
    }, [])
  return (
    <dialog className={`game-modal ${modalLoaded && 'modalAppear'} ${window.innerWidth <= 768 && "modal-mobile" }`}  open>
        <button className='close-btn' onClick={() => closeModal()}>
            <IoMdClose size={30} />
        </button>
        <article>
            <section className='logo-container'>
                <Image src={gameStats.logoImage} alt="game image" width={100} height={100} style={{backgroundColor: "transparent"}} className='logo' unoptimized/>
            </section>
            <section className='game-image-section'>
                <Image src={gameStats.mainImage} alt="game image" width={100} height={100} className='main-image' unoptimized />
            </section>
            {carouselImg.length>0 &&
                <>
                    <ul className={`carousel ${window.innerWidth <= 768 && "carousel-mobile"}`}>
                        {carouselImg.map((img, index) => (
                            <li key={index} className='carousel-item'>
                                <Thumbnail src={img.path_full} alt={`Screenshot ${index + 1}`} />
                            </li>
                        ))}
                    </ul>
                    
                </>
            }
            <main>
                <a className='price' rel='noopener noreferrer' target='_blank' href={`https://store.steampowered.com/app/${gameStats.appid}/`}>{price ? price : "Free"}</a>
            </main>

        </article>
    </dialog>
  )
}

export default Modal
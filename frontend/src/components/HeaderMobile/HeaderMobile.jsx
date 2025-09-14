import React, { Children } from 'react'
import logoImg from '../../assets/images/heroLogo.png'
import Image from 'next/image'
import './HeaderMobile.scss'

const HeaderMobile = (props) => {
  return (
    <header>
      <section className='logo-container-header'>
          <Image src={logoImg} width={100} height={100} alt='Logo' className='logo'/>
          <h1>Players Tracker</h1>
      </section>
      {props.children}
    </header>
  )
}

export default HeaderMobile
import React from 'react'
import mainImage from '../assets/main.jpg'
import MainTitle from './animations/MainTitle'
import './Search.scss';

const MainImage = () => {
  return (
    <>
        <div className="relative w-10/12 mx-auto main-sepia">

        <img src={mainImage} alt="memento time" className="mx-auto "/>
        <div className="w-screen z-10" style={{position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",}}>
              <div>

              <MainTitle />
              </div>

        </div>
        </div>
        </>
  )
}

export default MainImage

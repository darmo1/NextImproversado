import React from 'react'
import Button from './Button'
import ImagenImprovisar from '../Img/Rap.jpg'
const Home = () => {
    return (
        <div>
            <h1> Improvisando </h1>
            <img src={ImagenImprovisar} alt="Aprender a improvisar" />

            <div>
            <Button background={"bg-red-500"} colorText={"text-white"}> Improvisar  </Button>
            <Button background={"bg-blue-400"} colorText={"text-white"}> Información del proyecto  </Button>
            </div>
        </div>
    )
}

export default Home

import React from "react"


const CountDownLevel = ( tiempo = 3) => {

    const [ countDown , setCountDown ] = React.useState(tiempo)
    
    React.useEffect( () => {
        const timeID = setInterval( () => {
           setCountDown( prev => Math.min( prev -1 , 0) )
        }, [1000])
        return () => clearInterval(timeID)
    }, [])

    

    return(
        <div>hola { countDown }</div>
    )



}

export default CountDownLevel

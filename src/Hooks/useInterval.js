import React from 'react'

const useInterval = (callback) => {
   
    const savedCallback = React.useRef()

    React.useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    function exeFuncion(){
        savedCallback.current()
    }

    return {exeFuncion}
    



}

export default useInterval

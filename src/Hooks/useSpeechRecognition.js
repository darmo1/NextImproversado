import React from "react";


export const useSpeechRecognition = () => {

    const [ start , setStart ] = React.useState(false)
    const [flagTime, setFlagTime] = React.useState(false)
    const [ speechRecognition, setSpeechRecognition] = React.useState(undefined)

   React.useEffect( () => {
    const speechRecognition = new  webkitSpeechRecognition;
    setSpeechRecognition( speechRecognition )
    
   }, [] )

    const handleStartRecoding = () => {
        setTimeout( () => {
            setStart(true)
        }, [2000])   
    }

    const handleStopRecording = () => {
        console.log('stop it')
        speechRecognition.abort()
        setFlagTime(false)
    }
   

    return {

        speechRecognition,
        handleStartRecoding,
        handleStopRecording,
        start , 
        setStart,
        flagTime, setFlagTime
    }




}



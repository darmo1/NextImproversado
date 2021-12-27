import React from 'react'

import { useSpeechRecognition } from '../src/Hooks/useSpeechRecognition'
import distributeWords from '../src/utils/distributeWords'

import AssertWords from '../src/Components/AssertWords'

const App = () => {

  const { speechRecognition, handleStartRecoding, handleStopRecording, start, flagTime, setFlagTime } = useSpeechRecognition()
  

  React.useEffect( () => {
      if(speechRecognition){
        speechRecognition.lang = 'es-ES';
        speechRecognition.continuous = true;
        speechRecognition.interimResults = true;
      }
  })
  
  
  const [countDown, setCountDown] = React.useState(3)
  const [words, setWords] = React.useState([])
  const [wordPresentation, setWordPresentation] = React.useState([])
  const [sec, setSec] = React.useState(0)
  const [script, setScript] = React.useState('')
  const [improvise, setImprovise] = React.useState([])
  const [ error, setError ] = React.useState('')

  const audio = React.useRef()
  //Conteo 3,2,1
  const [timer, setTimer] = React.useState(0)
  React.useEffect(() => {
    audio.current.volume = 0.1
    let timeID
    if (start) {
      audio.current.play()
     
      timeID = setInterval(() => {
        setCountDown(prev => Math.max(prev - 1, 0))
      }, [1000])
    }
    return () => clearInterval(timeID)
  }, [start])

  //Llamado a la API
  React.useEffect( () => {

    async function fetchData(){
      try {
        const url = 'http://api.datamuse.com/words?sp=*on&v=es'
        const fetchData = await fetch(url)
  
        if (fetchData.status === 200) {
          const data = await fetchData.json()
          setWords(data)
  
        }
        else{
          setError('Hubo un error')
        }
      } catch (err) {
        return setError(err.message)
      }
    }
    fetchData()
    
  }, [])

  //Creación de las palabras de una ronda
  React.useEffect(() => {
    if (words.length > 0) {
      const wordsRound = distributeWords(words)
      setWordPresentation(wordsRound)
    }
  }, [words])

  //Cuando el reloj marque 3,2, 1. Empieza el juego
  React.useEffect(() => {
    
    if (countDown === 0) {
      setFlagTime(true)
      speechRecognition.start()
      speechRecognition.onresult = e => {
        setScript( e.results[0][0].transcript.toString().toLowerCase())
      }
      
    }
       // eslint-disable-line react-hooks/exhaustive-deps
  },[countDown])

  let i = 0
  //Acá la lógica para capturar los datos de recognitizion voice
  const initializeImprovise = () => {
    
    setImprovise(prev => [...prev, script])
    speechRecognition.onaudioend
    speechRecognition.onresult = ''
    setScript( () => '')
    
    setSec(prev => Math.min(13, prev + 1))
    console.log(speechRecognition)
    try{
        speechRecognition.onaudiostart
      }catch(err){
        console.log(err.message)
      }
    console.log('volvi a iniciar')
    speechRecognition.onresult = e => {
        
      setScript( e.results[0][0].transcript.toString().toLowerCase())
    }
  }

  
  //Empieza el reloj para contar los 120 segundo
  React.useEffect(() => {
    if (flagTime) {
      const timerId = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
      return () => {
        clearTimeout(timerId)
      }
    }
    else{
      audio.current.pause()
    }
  }, [flagTime])

  //Si es 120 segundo se para el flag y se para el reloj
  React.useEffect(() => {
    if (timer > 120) {
      audio.current.pause()
      setFlagTime(false)
      speechRecognition.abort()
    }
  })


 
  useInterval(initializeImprovise, 10000)

  function useInterval(callback, delay){
    const savedCallback = React.useRef()

    React.useEffect(() => {
        savedCallback.current = callback
    })

    function exeFuncion(){
        savedCallback.current()
    }

    React.useEffect(() => {
      if (flagTime) {
        let id = setInterval(exeFuncion, delay)
        return () => clearInterval(id)
      }
      // eslint-disable-line react-hooks/exhaustive-deps
    }, [flagTime])

}


  return (
    <div className='bg-blue_sc text-white relative'>
      <h1 className='font-semibold text-red-500 text-center'> Bienvenido(a) a la improvisación </h1>
        <audio ref={audio} controls className='mx-auto my-2' >
          <source src='../src/Components/Pista/freeStylePista.mp3' type="audio/mpeg" />
        </audio>

        { countDown === 0 ? <div className='text-center'>Empieza: 
          <div className='h-32 w-32 mx-auto rounded-full border border-white my-4 flex items-center justify-center text-5xl '>{timer}</div>
        </div>: <div className='text-center'>Se lo damos en: 
          <div className='h-32 w-32 mx-auto rounded-full border border-black bg-red-400 my-4 flex items-center justify-center text-5xl '>{countDown}</div>
        </div>
    }

      
      <div className='bg-black h-48 w-2/3 mx-auto rounded-2xl flex justify-center'>
        <p className='rounded-2xl w-11/12 m-2 border bg-white text-black p-4'>{script}</p>
      </div>
      <div id="countDown" className='absolute  inset-y-1/4 inset-x-1/2 bg-red-500 z-50' ></div>
      

      
      <div className='text-center font-semibold my-4'> Conjunto de palabras # {sec + 1}  </div>
      {wordPresentation.length > 0

        ? <div className='border text-white flex flex-col w-2/3 rounded-2xl mx-auto bg-blue_osc '>
          {wordPresentation[sec].map((item, index) => {
            return (
              <div className='text-center my-1  text-lg text-white' key={index}>
                {item.word}
              </div>
            )
          })}
        </div>

        : null}

        { error !== ""  ? <div>{error}</div> : null }

      

      <div className='p-4 text-black'>
        {
          improvise.map((phrase, index) => {
            return (<div key={index} className='flex my-4 '>

              <React.Fragment key={index}>
                <div className=' w-3/4  globe-msg'>
                  {phrase}
                </div>
              </React.Fragment>
              <div className='bg-white w-1/4 py-2 px-4  rounded-lg justify-center'>
                {wordPresentation[index].map((item, index) => <div className='min-w-fit text-sm'><AssertWords key={index} phrase={phrase} item={item} /></div>)}
              </div>

            </div>)

          }).reverse()}




      </div>




       
      <div className='flex justify-center my-4 text-white'>
        <button
          className='border py-1 px-4 mx-4 w-24 text-center rounded-lg text-lg font-semibold'
          onClick={handleStartRecoding}>
          Start
        </button>
        <button
          className='border py-1 px-4 mx-4 w-24 text-center rounded-lg text-lg font-semibold'
          onClick={handleStopRecording}>
          Finalizar
        </button>
      </div>


      <style jsx>{`
    .globe-msg{
      display: block;
      margin: auto;
      max-width: 40rem;
      height: 100%;
      border-radius: 12px;
      //clip-path: polygon( 0% 0%, 100% 0%, 100% 75%, 90% 75%, 90% 100%, 80% 75%, 0% 75%);
      background: #fff;
      padding: 1rem 2rem 3rem 2rem;
      margin-right:2rem;
    
    }
    `}</style>
    </div>
  )
}

export default App



const distributeWords = (arrayWords) => {

    const limit = Math.floor((arrayWords.length - 1) / 4)

    console.log(limit,' limite')
    const wordsOfRound = []
    
    for ( let k = 0 ; k <= limit; k++){
        const storedWords = []
        for (let i = 0; i < 4 ; i++) {
            let NUMBER_RANDOM = Math.random();  
            let currentWord = arrayWords[Math.ceil(NUMBER_RANDOM * arrayWords.length - 1)]
            storedWords.push(currentWord)
          }
          wordsOfRound.push( storedWords )
    }

    return wordsOfRound
}

export default distributeWords

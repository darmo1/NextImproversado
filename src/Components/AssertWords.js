import React from 'react'

const AssertWords = ({phrase, item}) => {

    return (
        <>
       { phrase.includes(item.word) 
        ? <div> {item.word}✔️  </div> 
        : <div> {item.word} ❌ </div>}
        </>
    )
}

export default AssertWords

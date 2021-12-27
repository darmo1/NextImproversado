

function Button(props){
    return(
      
        <button type="button" className={`${props.background || "bg-blue-500"} ${props.colorText} ${props.cName}`}>
            {props.children}
        </button>
 
    )
}

export default Button
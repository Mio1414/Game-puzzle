import React from "react";
import "./Gem.css"
type Gem ={
    num: number
    id: number
}
const Gem = (props: Gem) => {
    
return(
<div className="number">{props.num}</div>
)
}
export default Gem
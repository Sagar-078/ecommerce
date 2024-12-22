'use client'
import StarRatings from "react-star-ratings"
function Starrating({ratings,setRatings}:{ratings:number,setRatings:any}) {

  return (
    <div  className=" flex gap-2 items-center">

    <StarRatings
    rating={ratings}
    starRatedColor="orange"
    numberOfStars={5}
    changeRating={(newrating:any)=>{setRatings(newrating)}}
    
    name='rating'
    starDimension="30px"
  />
    <div className=" px-4 py-1 bg-green-600 text-white rounded-sm">{
        ratings===0?"RATE YOUR PRODUCT":ratings===1?"Poor":ratings===2?"Fair":ratings===3?"Good":ratings===4?"Very Good":"Excellent"
        }</div>
    </div>
  )
}

export default Starrating;
import React from "react";
// import * as sliderOne from '../../../../public/images/sliders/sliderOne.png'
// import * as sliderTwo from '../../../../public/images/sliders/sliderTwo.png'
// import * as sliderThree from '../../../../public/images/sliders/sliderThree.png'

const textStyle = {
    width: '10px',
    height: '10px',
}

function RatingSlider(props) {

    return(
        <div>
            <label>{props.label}</label>
            <input type="range" min="1" max="5" onChange={(e) => props.changeRatingSlider(e)}></input>
        </div>
    )
}

export default RatingSlider
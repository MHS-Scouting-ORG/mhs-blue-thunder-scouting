import React from "react";
import RatingSlider from "./RatingSlider";

export function makeRatingSlider(props, label, markerNames) {

    function ratingSliderChanged(sliderVal) {
        // console.log(sliderVal)
        // console.log(markerNames[parseInt(sliderVal)])
        props.changeState(markerNames[parseInt(sliderVal)])
    }

    return (
        <div>
            <RatingSlider
                label={label}
                state={props.ratingSliderVals}
                markerNames={markerNames}
                changeRatingSlider={ratingSliderChanged}
            />
        </div>
    )
}
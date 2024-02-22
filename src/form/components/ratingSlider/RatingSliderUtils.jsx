import React from "react";
import RatingSlider from "./RatingSlider";

export function makeRatingSlider(props, label, markerNames, i) {

    function ratingSliderChanged(sliderVal) {
        // console.log(sliderVal)
        // console.log(markerNames[parseInt(sliderVal)])
        props.changeState(markerNames[parseInt(sliderVal)])
    }

    return (
        <div>
            <RatingSlider
                label={label}
                index={i}
                state={props.ratingSliderVals}
                markerNames={markerNames}
                changeRatingSlider={ratingSliderChanged}
            />
        </div>
    )
}
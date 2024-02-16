import React from "react";
import RatingSlider from "./RatingSlider";

export function makeRatingSlider(props, label, markerNames, i) {

    function ratingSliderChanged(e) {
        props.changeState(i, markerNames[parseInt(e.target.value)])
    }

    return (
        <RatingSlider
            label = {label}
            index = {i}
            markerNames={markerNames}
            changeRatingSlider = {ratingSliderChanged}
        />
    )
}
import React from "react";
import RatingSlider from "./RatingSlider";

export function makeRatingSlider(props, label, i) {

    function ratingSliderChanged(e) {
        props.changeState(i, parseInt(e.target.value))
    }

    return (
        <RatingSlider
            label = {label}
            index = {i}
            changeRatingSlider = {ratingSliderChanged}
        />
    )
}
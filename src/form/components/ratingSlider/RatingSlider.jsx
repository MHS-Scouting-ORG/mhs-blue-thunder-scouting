import React from "react";
// import * as sliderOne from '../../../
import { PropTypes } from 'prop-types';

function RatingSlider(props) {

    function makeMarkers() {
        return props.markerNames.map((marker, i) => <option value={i} label={marker}></option>)
    }

    return(
        <div>
            <datalist id="markers">
                {makeMarkers()}
            </datalist>

            <label>{props.label}</label>
            <input type="range" min="0" max={props.markerNames.length - 1} defaultValue="0" list="markers" style={{
                width: '100px',
                margin: '0'
            }} onChange={(e) => props.changeRatingSlider(e)}></input>
        </div>
    )
}

RatingSlider.propTypes = {
    label: PropTypes.string,
    index: PropTypes.number,
    markerNames: PropTypes.array,
    changeRatingSlider: PropTypes.func,
}

export default RatingSlider
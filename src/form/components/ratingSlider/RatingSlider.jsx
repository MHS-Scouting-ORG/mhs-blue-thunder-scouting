import React from "react";
// import * as sliderOne from '../../../
import { PropTypes } from 'prop-types';
import slide from './Slider.module.css';

function RatingSlider(props) {

    function makeMarkers() {
        return props.markerNames.map((marker, i) => <option value={i} label={marker}></option>)
    }

    return (
        <div>
            <datalist id="markers">{makeMarkers()}</datalist>

            <label className={slide.Slider} >{props.label}</label>
            <input type="range" name="foo" min="0" max={props.markerNames.length - 1} defaultValue="0" list="markers" style={{
                textAlign: 'left',
                margin: '0'
            }} onChange={(e) => { props.changeRatingSlider(e.target.value) }}></input>
            <p>{props.state === '' ? props.markerNames[0] : props.state}</p>
        </div>
    )
}

RatingSlider.propTypes = {
    label: PropTypes.string,
    markerNames: PropTypes.array,
    changeRatingSlider: PropTypes.func,
}

export default RatingSlider
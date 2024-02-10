import React from "react";

class RatingSlider extends React.Component {
    constructor(props) {
        super(props)
        this.sliderChanged = this.sliderChanged.bind(this)
    }

    sliderChanged() {
        this.props.sliderChanged()
    }

    render() {
        return(

        )
    }
}

export default RatingSlider
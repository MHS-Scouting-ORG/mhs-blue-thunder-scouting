import React from 'react'
import PropTypes from 'prop-types'

function RadioButton({ label, options, changeState, selected }) {
    return (
        <div>
            {(() => {
                if (options) {
                    return options.map((option) => {
                        return (
                            <label key={option.value}>
                                <input type="radio" name={label + "-radioButton"} value={option.value} onChange={({ target: { value } }) => {
                                    changeState(value)
                                }} checked={selected === option.value} />
                                {option.label}
                            </label>
                        )
                    }
                    )
                }
            })()

            }
        </div>
    )
}

RadioButton.propTypes = {
    label: PropTypes.string,
    options: PropTypes.array,
    changeState: PropTypes.func,
    selected: PropTypes.string
}
export default RadioButton
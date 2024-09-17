import React from 'react'
import Slider from 'react-slider'
import './RangeSlider.css'

const RangeSlider = ({ disabled, value, onChange }) => {
  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <Slider
      className="range-slider"
      trackClassName='track'
      thumbClassName='thumb'
      disabled={disabled}
      value={value}
      onChange={handleChange}
      min={0}
      max={100}
      pearling
      step={1}
      withTracks
    />
  )
}

export default RangeSlider

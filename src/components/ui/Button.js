import React from 'react'
import './Button.css'

const Button = ({
  disabled = false,
  danger = false,
  onClick = () => {},
  children,
}) => {
  const buttonClass = danger ? 'button button-danger' : 'button'

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button

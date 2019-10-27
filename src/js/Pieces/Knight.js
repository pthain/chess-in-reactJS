import React from 'react'

import knight_w from '../../images/pieces/knight_w.png'
import knight_b from '../../images/pieces/knight_b.png'

function Knight(props) {
  if (props.isWhite) {
    return (
      <img src={knight_w} alt='Rw'/>
    )
  }
  else {
    return (
      <img src={knight_b} alt='Rb'/>
    )
  }
}

export default Knight

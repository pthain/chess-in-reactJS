import React from 'react'

import bishop_w from '../../images/pieces/bishop_w.png'
import bishop_b from '../../images/pieces/bishop_b.png'

function Bishop(props) {
  console.log(props.isWhite)
  if (props.isWhite) {
    return (
      <img src={bishop_w} alt='Rw'/>
    )
  }
  else {
    return (
      <img src={bishop_b} alt='Rb'/>
    )
  }
}

export default Bishop

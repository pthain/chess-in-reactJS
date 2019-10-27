import React from 'react'

import queen_w from '../../images/pieces/queen_w.png'
import queen_b from '../../images/pieces/queen_b.png'

function Queen(props) {
  console.log(props.isWhite)
  if (props.isWhite) {
    return (
      <img src={queen_w} alt='Rw'/>
    )
  }
  else {
    return (
      <img src={queen_b} alt='Rb'/>
    )
  }
}

export default Queen

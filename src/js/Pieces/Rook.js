import React from 'react'

import rook_w from '../../images/pieces/rook_w.png'
import rook_b from '../../images/pieces/rook_b.png'

function Rook(props) {
  if (props.isWhite) {
    return (
      <img src={rook_w} alt='Rw'/>
    )
  }
  else {
    return (
      <img src={rook_b} alt='Rb'/>
    )
  }
}

export default Rook

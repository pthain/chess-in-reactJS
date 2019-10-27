import React from 'react'

import pawn_w from '../../images/pieces/pawn_w.png'
import pawn_b from '../../images/pieces/pawn_b.png'

function Pawn(props) {
  if (props.isWhite) {
    return (
      <img src={pawn_w} alt='Pw'/>
    )
  }
  else {
    return (
      <img src={pawn_b} alt='Pb'/>
    )
  }
}

export default Pawn

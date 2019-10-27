import React from 'react'

import king_w from '../../images/pieces/king_w.png'
import king_b from '../../images/pieces/king_b.png'

function King(props) {
  if (props.isWhite) {
    return (
      <img src={king_w} alt='Rw'/>
    )
  }
  else {
    return (
      <img src={king_b} alt='Rb'/>
    )
  }
}

export default King

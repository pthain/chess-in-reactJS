import React from 'react'
import '../../css/Board.css'

import Pawn from '../Pieces/Pawn.js'

/*
  This class, when rendered, will return a React Component.
  The Component will contain HTML content for the newly rendered Board.
  In otherwords, everytime there is a state change in the board,
  The render() function will be called again.
  NOTE: https://stackoverflow.com/questions/22876978/loop-inside-react-jsx for sending a list into jsx
*/
class Piece extends React.Component {
  constructor(props){
    super(props)
    this.className = "game-piece"
    this.imgURL = null
    this.sqValue = this.props.sqValue
  }

  render () {
    /* Depending on state, display piece
    <img src={this.imgURL} alt={this.sqValue}/> */
    //Default
    return (
      <span className={this.className}>
        <Pawn isWhite ={true}/>
      </span>
    )
  }
}

export default Piece

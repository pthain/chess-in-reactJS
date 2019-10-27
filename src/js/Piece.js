import React from 'react'
import '../css/Board.css'
import pawn_w from '../images/pieces/pawn_w.png'
import pawn_b from '../images/pieces/pawn_b.png'
import Game from './Game.js'

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
  }

  render () {
    return (
      <p>{this.props.sqValue}</p>
    )
  }

  /*
  render() {
    if (this.props.isWhite) {
      return (
          <img className={this.className} src={pawn_w} alt="none"/>
      )
    }
    else {
      return (
          <img className={this.className} src={pawn_b} alt="none"/>
      )
    }
  }
  */
}

class pawn extends Piece {
  constructor(props) {
    super(props)
    this.isWhite = true //props.isWhite
    this.imgURL = pawn_w
  }
}

export default Piece

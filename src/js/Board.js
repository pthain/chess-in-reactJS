import React from 'react'
import '../css/Board.css';

/* Import Pieces */
//import Piece from './Pieces/Piece.js';
import Pawn from './Pieces/Pawn.js';
import Rook from './Pieces/Rook.js';
import Knight from './Pieces/Knight.js';
import Bishop from './Pieces/Bishop.js';
import Queen from './Pieces/Queen.js';
import King from './Pieces/King.js';

/*
  This class, when rendered, will return a React Component.
  The Component will contain HTML content for the newly rendered Board.
  In otherwords, everytime there is a state change in the board,
  The render() function will be called again.
*/
class Board extends React.Component {

  /*** Assign square as light or dark ***/
  renderBoard() {
    return(
      <div className="board">
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
        {this.renderRow(3)}
        {this.renderRow(4)}
        {this.renderRow(5)}
        {this.renderRow(6)}
        {this.renderRow(7)}
      </div>
    )
  }
  renderRow(i) {
    return(
      <div className="board-row" >
        {this.renderSquare(i, 0)}
        {this.renderSquare(i, 1)}
        {this.renderSquare(i, 2)}
        {this.renderSquare(i, 3)}
        {this.renderSquare(i, 4)}
        {this.renderSquare(i, 5)}
        {this.renderSquare(i, 6)}
        {this.renderSquare(i, 7)}
      </div>
    )
  }
  renderSquare(i, j) {
    return (
      <div onClick={()=>this.props.onClick(i, j)} className={this.getLightOrDark(i, j)}>
        <div className="square-content">
          {this.renderSquareContent(i, j, this.props.board[i][j])}
        </div>
      </div>
    )
  }
  getLightOrDark(i, j) {
    if ((i+j)%2 === 0) {
      return("board-square light")
    }
    else {
      return("board-square dark")
    }
  }
  /* Use State to determine if a piece is on this square */
  renderSquareContent(i, j, sqValue) {
    if(sqValue === undefined) {
      return "?"
    }
    var piece = sqValue.charAt(0)
    var color = "no color"
    if (sqValue.length > 1) {
      color = sqValue.charAt(1)
    }

    return (
      <div className='game-piece'>
        {this.pieceDispatcher(piece, color)}
      </div>
    )
  }
  pieceDispatcher(piece, color) {
    if (color === "no color") {
      return ""
    }
    if (piece === 'P') {
      if (color === 'w') {
        return(<Pawn isWhite = {true}/>)
      }
      else {
        return(<Pawn isWhite = {false}/>)
      }
    }
    if (piece === 'R') {
      if (color === 'w') {
        return(<Rook isWhite = {true}/>)
      }
      else {
        return(<Rook isWhite = {false}/>)
      }
    }
    if (piece === 'N') {
      if (color === 'w') {
        return(<Knight isWhite = {true}/>)
      }
      else {
        return(<Knight isWhite = {false}/>)
      }
    }
    if (piece === 'B') {
      if (color === 'w') {
        return(<Bishop isWhite = {true}/>)
      }
      else {
        return(<Bishop isWhite = {false}/>)
      }
    }
    if (piece === 'Q') {
      if (color === 'w') {
        return(<Queen isWhite = {true}/>)
      }
      else {
        return(<Queen isWhite = {false}/>)
      }
    }
    if (piece === 'K') {
      if (color === 'w') {
        return(<King isWhite = {true}/>)
      }
      else {
        return(<King isWhite = {false}/>)
      }
    }
  }
  /* Update the board if the state changes */
  render() {
    return (
        <div className = "board-container">
          {this.renderBoard()}
        </div>

    )
  }
}

export default Board

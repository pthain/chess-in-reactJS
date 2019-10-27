import React from 'react'
import '../css/Board.css';

/* Import Pieces */
//import Piece from './Pieces/Piece.js';
import Pawn from './Pieces/Pawn.js';
import Rook from './Pieces/Rook.js';

/*
  This class, when rendered, will return a React Component.
  The Component will contain HTML content for the newly rendered Board.
  In otherwords, everytime there is a state change in the board,
  The render() function will be called again.
  NOTE: https://stackoverflow.com/questions/22876978/loop-inside-react-jsx for sending a list into jsx
*/
class Board extends React.Component {

  /* Use State to determine if there is a piece on this square */
  renderSquareContent(i, j, sqValue) {
    console.log(sqValue)
    var piece = sqValue.charAt(0)
    if (sqValue.charAt(0) === '*') {
      return ""
    }
    var color = sqValue.charAt(1)

    return (
      <div className='game-piece'>
        {this.pieceDispatcher(piece, color)}
      </div>
    )
  }

  pieceDispatcher(piece, color) {
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
  }

  /*** Assign square as light or dark ***/
  getClassName(i, j) {
    if ((i+j)%2 === 0) {
      return("board-square light")
    }
    else {
      return("board-square dark")
    }
  }

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
      <div className={this.getClassName(i, j)}>
        <div className="square-content">
          {this.renderSquareContent(i, j, this.props.board[i][j])}
        </div>
      </div>
    )
  }

  render() {
    return (
        <div className = "board-container">
          {this.renderBoard()}
        </div>

    )
  }
}

export default Board

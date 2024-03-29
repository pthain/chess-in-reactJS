import React from 'react'
import '../css/Board.css';

/* Import Pieces */
import Pawn from './PieceComponents/Pawn.js';
import Rook from './PieceComponents/Rook.js';
import Knight from './PieceComponents/Knight.js';
import Bishop from './PieceComponents/Bishop.js';
import Queen from './PieceComponents/Queen.js';
import King from './PieceComponents/King.js';

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
      <div onClick={()=>this.props.onClick(i, j)} className={this.getSquareClassName(i, j)}>
        <div className="square-content">
          {this.renderSquareContent(this.props.board[i][j])}
        </div>
      </div>
    )
  }
  getSquareClassName(i, j) {
    let retCN = "board-square "
    if ((i+j)%2 === 0) {
      retCN = retCN.concat("light ")
    }
    else {
      retCN = retCN.concat("dark ")
    }
    //If a piece is selected, highlight the square
    let selectedPiece = this.props.ssPiece
    if  ((selectedPiece !== null) &&
        (selectedPiece.getRow() === i ) &&
        (selectedPiece.getCol() === j ))
    {
        retCN = retCN.concat("selected ")
    }
    return retCN
  }
  /* Use State to determine if a piece is on this square */
  renderSquareContent(sqValue) {
    var piece = '*'
    var isWhite = "no color"
    if(sqValue === undefined) {
      return "?"
    }
    else if (sqValue !== '*') {
      piece = sqValue.getPieceType()
      isWhite = sqValue.getIsWhite()
    }

    return (
      <div className='game-piece'>
        {this.pieceDispatcher(piece, isWhite)}
      </div>
    )
  }
  pieceDispatcher(piece, isWhite) {
    if (isWhite === "no color") {
      return ""
    }
    if (piece === 'P') {
      return(<Pawn isWhite = {isWhite}/>)
    }
    if (piece === 'R') {
      return(<Rook isWhite = {isWhite}/>)
    }
    if (piece === 'N') {
      return(<Knight isWhite = {isWhite}/>)
    }
    if (piece === 'B') {
      return(<Bishop isWhite = {isWhite}/>)
    }
    if (piece === 'Q') {
      return(<Queen isWhite = {isWhite}/>)
    }
    if (piece === 'K') {
      return(<King isWhite = {isWhite}/>)
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

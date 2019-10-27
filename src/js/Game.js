import React from 'react'
import Board from './Board.js'

class Game extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      board: this.setBoardNewGame(this.initBoard()),
      whiteToMove: true
    }
  }

  getTurnID() {
    return (this.state.whiteToMove ? 'White' : 'Black')
  }


  getSquare(i, j) {
    return this.state.board[i][j]
  }
/******
  When the user clicks on the board, decide what to do
******/
  handleClick(i, j) {
    var tmpBoard = this.state.board.slice()
    console.log(i, j)
    console.log(this.getSquare(i, j))

    /* Move piece forward */
    var piece = this.getSquare(i, j)
    if (piece === "*") {
      return
    }
    tmpBoard[i][j] = "*"
    tmpBoard[i + 1][j] = piece
    /*
    tmpBoard[1][3] = '*'
    tmpBoard[2][3] = 'Pb'
    */
    this.setState({
      board: tmpBoard
    })
  }

  /*********
    Creates an 8x8 matrix to represent the board
  **********/
  initBoard() {
    var boardState = []
    var boardSize = 8
    for (var i = 0; i < boardSize; i++) {
      boardState[i] = []
      for (var j = 0; j < boardSize; j++) {
        boardState[i][j] = '*'
      }
    }
    return boardState
  }

  /*********
    When a user starts a new game, invoke this function to setup the board.
    Board Legend:
      P = Pawn, R = Rook, N = Knight, B = Bishop
      Q = Queen, K = King, * = Empty
      _b = black, _w = white
  **********/
  setBoardNewGame(boardState) {
    var boardSize = boardState.length
    for (var i = 0; i < boardSize; i++) {
      for (var j = 0; j < boardSize; j++) {
        /* Place pieces */
        //Black Pawns
        if (i === 1) {
            boardState[i][j] = 'Pb'
        }
        //Black homerow
        if (i === 0) {
          if (j === 0 || j === 7) {
            boardState[i][j] = 'Rb'
          }
          if (j === 1 || j === 6) {
            boardState[i][j] = 'Nb'
          }
          if (j === 2 || j === 5) {
            boardState[i][j] = 'Bb'
          }
          if (j === 3) {
            boardState[i][j] = 'Qb'
          }
          if (j === 4) {
            boardState[i][j] = 'Kb'
          }
        }

        //White pawns
        if (i === 6) {
            boardState[i][j] = 'Pw'
        }
        //White homerow
        if (i === 7) {
          if (j === 0 || j === 7) {
            boardState[i][j] = 'Rw'
          }
          if (j === 1 || j === 6) {
            boardState[i][j] = 'Nw'
          }
          if (j === 2 || j === 5) {
            boardState[i][j] = 'Bw'
          }
          if (j === 3) {
            boardState[i][j] = 'Qw'
          }
          if (j === 4) {
            boardState[i][j] = 'Kw'
          }
        }
      }
    }
    return boardState
  }
  render() {

    return (
      <div>
        <div>Whose turn is it: {this.getTurnID()} </div>
        <Board onClick={(i, j) => this.handleClick(i, j)} board={this.state.board}/>
      </div>
    );
  }
}

export default Game //Make this class public

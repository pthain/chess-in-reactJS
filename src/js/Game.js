import React from 'react'
import Board from './Board.js'

class Game extends React.Component{
  constructor(props) {
    super(props)

    /*
      What do I want?
      To make an 8 by 8 grid, and display an item (pref coordinates) in each.
      Flow:
        Game -> Board : props=boardState -> Each square
    */

    this.state = {
      board: this.setBoardNewGame(this.initBoard()),
      whiteToMove: true
    }
  }

  getTurnID() {
    return (this.state.whiteToMove ? 'White' : 'Black')
  }

  /***
    Board Legend:
      P = Pawn, R = Rook, N = Knight, B = Bishop
      Q = Queen, K = King, * = Empty
      _b = black, _w = white
  ***/
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
        <Board board={this.state.board}/>
      </div>
    );
  }
}

export default Game //Make this class public

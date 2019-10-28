import React from 'react'
import Board from './Board.js'

class Game extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      board: this.setBoardNewGame(this.initBoard()),
      whiteToMove: true,
      ssPiece: null,
      ssPieceType: null,
      ssIsWhite: null,
      ssRow: -1,
      ssCol: -1,
    }
  }
  /********************************************
  *********** Piece Movement Rules ************
  *********************************************/
  pawnMoves(){return [] }
  rookMoves(){return []}
  knightMoves(){return []}
  bishopMoves(){return []}
  queenMoves(){return []}
  kingMoves(){return []}

  getTurnID() {
    return (this.state.whiteToMove ? 'White' : 'Black')
  }


  getSquare(i, j) {
    return this.state.board[i][j]
  }
/******
  When the user clicks on the board, decide what to do
  TODO: Get a Piece, decide where it can move to, including colision w/ others
******/
    /*
      What should happen when a square is clicked?
        -Check: if a piece is selected
          - Check: Is this new (i, j) a different piece?
            - break
          - Check: Is this new (i, j) in the selected piece's possible moves?
            - then place this piece on that sq.
        -Check: if color matches whose turn it is
        -Square is highlighted (un-highlight old sq.)
        -set state: this piece @ i,j is selected
        -Determine possible moves
        -Display grey dots
    */

  handleClick(i, j) {
    //Get piece @ i, j
    var sqValue = this.getSquare(i, j)

    //If sqValue is a piece and its that color's move, select it
    if (sqValue !== '*' && (this.state.whiteToMove === this.isWhite(sqValue))) {
      this.selectSquare(i, j, sqValue)
    }

    //Move the previously selected piece to (i, j) if possible.
    else if (this.state.ssPiece !== null) {
      this.moveDispatcher(i, j)
    }
    //Otherwise, do nothing
  }

  selectSquare(i, j, piece) {
    this.setState({
      ssPiece: piece,
      ssPieceType: this.getPieceType(piece),
      ssIsWhite: this.isWhite(piece),
      ssRow: i,
      ssCol: j
    })
  }

  getPieceType(piece) {
    if(piece !== null && piece.length > 0) {
      return piece.charAt(0)
    }
  }

  isWhite(piece) {
    if(piece !== null && piece.length > 1){
      if(piece.charAt(1) === 'w') {
        return true
      }
      else {
        return false
      }
    }
  }

  deselectSquare() {
    this.setState({
      ssPiece: null,
      ssPieceType: null,
      ssIsWhite: null,
      ssRow: -1,
      ssCol: -1
    })
  }

  moveDispatcher(i, j) {
    //Depending on the type of piece, call a function
    var ssPieceType = this.state.ssPieceType
    var possibleMoves = []
    if (ssPieceType === 'P') {possibleMoves = this.pawnMoves()}
    else if (ssPieceType === 'R') {possibleMoves = this.rookMoves()}
    else if (ssPieceType === 'N') {possibleMoves = this.knightMoves()}
    else if (ssPieceType === 'B') {possibleMoves = this.bishopMoves()}
    else if (ssPieceType === 'Q') {possibleMoves = this.queenMoves()}
    else if (ssPieceType === 'K') {possibleMoves = this.kingMoves()}
    //else no possible moves
    var coordinate = [i, j]
    possibleMoves.push([i, j])
    console.log(possibleMoves)
    /* For all possible moves, if the dest is a poss move, do it.*/
    if (coordinate[0] === i && coordinate[1] === j) {
      this.moveSelectedPiece(i, j)
    }
    /*
    for () {
      console.log(move, i)
      if (move[0] === i && move[1] === j) {
        this.moveSelectedPiece(i, j)
      }
    }
    */
  }

  /** Given a state and a destination, update state by moving piece if poss.**/
  moveSelectedPiece(i, j) {
    /* Move this.ssPiece to (i, j)*/
    var tmpBoard = this.state.board.slice()
    var ssPiece = this.state.ssPiece
    var ssRow = this.state.ssRow
    var ssCol = this.state.ssCol

    tmpBoard[ssRow][ssCol] = "*"  //Empty old space
    tmpBoard[i][j] = ssPiece  //move piece to new space
    this.setState({
      board: tmpBoard,
      whiteToMove: this.toggleTurnID()
    })
    this.deselectSquare()
  }

  toggleTurnID() {
    if(this.state.whiteToMove) {
      return false
    }
    else {
      return true
    }
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

  /********
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

    console.log(this.state)
    return (
      <div>
        <div>Whose turn is it: {this.getTurnID()} </div>
        <Board onClick={(i, j) => this.handleClick(i, j)} board={this.state.board}/>
      </div>
    );
  }
}

export default Game //Make this class public

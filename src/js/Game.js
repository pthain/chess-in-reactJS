import React from 'react'
import Board from './Board.js'

const CAPTURE = 'x'
const AVAILABLE = '+'

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
  pawnMoves() {
    //Backrow -> promotion
    //Startrow -> move two
    //Capture -> move row+1 && col-1 or col+1
    //En passant:
      //5th rank w: (row === 3) b: (row === 4)
      //&& last move was enemy pawn move two on col j+1 or j-1
    //Otherwise -> move one
    var isWhite = this.state.ssIsWhite
    var srcRow = this.state.ssRow
    var srcCol = this.state.ssCol
    var moveMatrix = this.initBoard()

    let dir = 0
    let startrow = -1
    let dstRow = -1
    let dstCol = -1

    //White
    if (isWhite) {
      startrow = 6
      dir = -1
    }
    else {
      startrow = 1
      dir = 1
    }
    //Mark space one ahead
    dstRow = srcRow + dir
    if (this.sqIsEmpty(dstRow, srcCol)) {
      moveMatrix[dstRow][srcCol] = AVAILABLE
    }
    //Mark a move-two if possible
    dstRow = srcRow + (2 * dir)
    if (srcRow === startrow && this.sqIsEmpty(dstRow, srcCol)) {
      moveMatrix[dstRow][srcCol] = AVAILABLE
    }
    //Mark a capture if possible
    dstRow = srcRow + dir
    dstCol = srcCol - 1 //Left
    if (dstCol >= 0) {
      if (!this.sqIsEmpty(dstRow, dstCol) && this.isCapturable(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    dstCol = srcCol + 1
    if (dstCol <= 7) {
      if (!this.sqIsEmpty(dstRow, dstCol) && this.isCapturable(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    return moveMatrix
  }
  rookMoves(){
    var srcRow = this.state.ssRow
    var srcCol = this.state.ssCol
    var moveMatrix = this.initBoard()
    moveMatrix = this.columnsAndRows(srcRow, srcCol, moveMatrix, 7)
    return moveMatrix
  }
  knightMoves(){
    var isWhite = this.state.ssIsWhite
    var srcRow = this.state.ssRow
    var srcCol = this.state.ssCol
    var moveMatrix = this.initBoard()

    let dstRow = -1
    let dstCol = -1
    let isCapturablePiece = null

    let moveModifiers = []

    //Enumerate moves
    for(let r = -2; r <= 2; r++) {
      for(let c = -2; c <= 2; c++) {
        if (!(Math.abs(r) === Math.abs(c) || r === 0 || c === 0)) {
          let moveMod = [r, c]
          moveModifiers.push(moveMod)
        }
      }
    }
    for (let m = 0; m < moveModifiers.length; m++) {
      dstRow = srcRow + moveModifiers[m][0]
      dstCol = srcCol + moveModifiers[m][1]
      if (dstRow < 0 || dstCol < 0 || dstRow > 7 || dstCol > 7) {
        continue
      }
      else if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      isCapturablePiece = this.isCapturable(dstRow, dstCol)
      if (isCapturablePiece) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    return moveMatrix
  }
  bishopMoves(){
    var srcRow = this.state.ssRow
    var srcCol = this.state.ssCol
    var moveMatrix = this.initBoard()
    moveMatrix = this.diagonals(srcRow, srcCol, moveMatrix, 7)
    return moveMatrix
  }
  queenMoves(){
    var srcRow = this.state.ssRow
    var srcCol = this.state.ssCol
    var moveMatrix = this.initBoard()
    moveMatrix = this.columnsAndRows(srcRow, srcCol, moveMatrix, 7)
    moveMatrix = this.diagonals(srcRow, srcCol, moveMatrix, 7)
    return moveMatrix
  }
  kingMoves(){
    var srcRow = this.state.ssRow
    var srcCol = this.state.ssCol
    var moveMatrix = this.initBoard()
    moveMatrix = this.columnsAndRows(srcRow, srcCol, moveMatrix, 1)
    moveMatrix = this.diagonals(srcRow, srcCol, moveMatrix, 1)
    return moveMatrix
  }

  columnsAndRows(srcRow, srcCol, moveMatrix, maxDist) {
    let dstRow = -1
    let dstCol = -1
    //North
    dstCol = srcCol
    for (let i = 1; (srcRow - i >= 0) && (i <= maxDist); i++) {
      dstRow = (srcRow - i)
      if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(dstRow, dstCol)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: rook can't move past a piece
        break
      }
    }
    //South
    for (let i = 1; (srcRow + i <= 7) && (i <= maxDist); i++) {
      dstRow = srcRow + i
      if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      else {
        if (this.isCapturable(dstRow, dstCol)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: rook can't move past a piece
        break
      }
    }
    //West
    dstRow = srcRow
    for (let i = 1; (srcCol - i >= 0) && (i <= maxDist); i++) {
      dstCol = srcCol - i
      if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(dstRow, dstCol)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: rook can't move past a piece
        break
      }
    }
    //East
    for (let i = 1; (srcCol + i <= 7) && (i <= maxDist); i++) {
      dstCol = srcCol + i
      if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(dstRow, dstCol)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: rook can't move past a piece
        break
      }
    }
    return moveMatrix
  }
  diagonals(srcRow, srcCol, moveMatrix, maxDist) {
    let dstRow = -1
    let dstCol = -1

    //NE
    for (let i = 1; (((srcCol + i) <= 7 || (srcRow - i) >= 0) && i <= maxDist); i++) {
      dstRow = srcRow - i
      dstCol = srcCol + i
      if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(dstRow, dstCol)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: bishop can't move past a piece
        break
      }
    }
    //NW
    for (let i = 1; (((srcCol - i) >= 0 || (srcRow - i) >= 0) && i <= maxDist); i++) {
      dstRow = srcRow - i
      dstCol = srcCol - i
      if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(dstRow, dstCol)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: bishop can't move past a piece
        break
      }
    }
    //SW
    for (let i = 1; (((srcCol - i) >= 0 || (srcRow + i) <= 7) && i <= maxDist); i++) {
      dstRow = srcRow + i
      dstCol = srcCol - i
      if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(dstRow, dstCol)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: bishop can't move past a piece
        break
      }
    }
    //SE
    for (let i = 1; (((srcCol + i) <= 7 || (srcRow + i) <= 7) && i <= maxDist); i++) {
      dstRow = srcRow + i
      dstCol = srcCol + i
      if (this.sqIsEmpty(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(dstRow, dstCol)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: bishop can't move past a piece
        break
      }
    }
    return moveMatrix

  }
  isCapturable(dstRow, dstCol) {
    let whiteToMove = this.state.whiteToMove
    console.log(dstRow, dstCol)
    if(this.sqIsEmpty(dstRow, dstCol) || !this.sqInBounds(dstRow, dstCol)) {
      return false
    }
    let victimSquare = this.state.board[dstRow][dstCol]
    return (whiteToMove ? !this.isWhite(victimSquare) : this.isWhite(victimSquare))
  }
  sqIsEmpty(i, j) {
    if (!this.sqInBounds(i, j)) {
      return null
    }
    return (this.state.board[i][j] === '*')
  }
  getTurnID() {
    return (this.state.whiteToMove ? 'White' : 'Black')
  }
  getSquare(i, j) {
    return this.state.board[i][j]
  }
  sqInBounds(i, j) {
    return !(i < 0 || j < 0 || i > 7 || j > 7)
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
    let moveMatrix = this.getMoves(ssPieceType)
    if (moveMatrix[i][j] === AVAILABLE || moveMatrix[i][j] === CAPTURE) {
      //Todo: Does this move place this player's king in check?
      this.moveSelectedPiece(i, j)
    }
    /* For all possible moves, if the dest is a poss move, do it.*/
  }

  getMoves(pieceType) {
    let moveMatrix = []
    if (pieceType === 'P') {moveMatrix = this.pawnMoves()}
    else if (pieceType === 'R') {moveMatrix = this.rookMoves()}
    else if (pieceType === 'N') {moveMatrix = this.knightMoves()}
    else if (pieceType === 'B') {moveMatrix = this.bishopMoves()}
    else if (pieceType === 'Q') {moveMatrix = this.queenMoves()}
    else if (pieceType === 'K') {moveMatrix = this.kingMoves()}
    //else no possible moves
    console.log(moveMatrix)
    return moveMatrix
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

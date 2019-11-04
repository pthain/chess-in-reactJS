import React from 'react'
import Board from './Board.js'
import Piece from './Piece.js'

const CAPTURE = 'x'
const AVAILABLE = '+'
const ENPASSANT = 'e'
const CASTLE = 'c'
const PROMOTE = 'p'

class Game extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      board: this.setBoardNewGame(this.initBoard()),
      history: [this.setBoardNewGame(this.initBoard())],
      whiteToMove: true,
      turnCount: 1,
      halfTurnCount: 0,
      ssPiece: null,
    }
  }
  /********************************************
  *********** Piece Movement Rules ************
  *********************************************/
  pawnMoves() {
    var thisPawn = this.state.ssPiece
    var isWhite = thisPawn.getIsWhite()
    var srcRow = thisPawn.getRow()
    var srcCol = thisPawn.getCol()
    var moveMatrix = this.initBoard()

    let dir = 0
    let dstRow = -1
    let dstCol = -1

    //Set direction the pawn should move
    dir = (isWhite ? -1 : 1)

    //Mark space one ahead
    dstRow = srcRow + dir
    if (this.sqIsEmpty(dstRow, srcCol)) {
      moveMatrix[dstRow][srcCol] = AVAILABLE
      //Mark a move-two if possible
      dstRow = dstRow + dir
      if ((!(thisPawn.getHasMoved())) && this.sqIsEmpty(dstRow, srcCol)) {
        moveMatrix[dstRow][srcCol] = AVAILABLE
      }
    }
    //Mark a capture if possible
    dstRow = srcRow + dir
    dstCol = srcCol - 1 //Left
    if (dstCol >= 0) {
      if (!this.sqIsEmpty(dstRow, dstCol) && this.isCapturable(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    dstCol = srcCol + 1 //Right
    if (dstCol <= 7) {
      if (!this.sqIsEmpty(dstRow, dstCol) && this.isCapturable(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    //Check for checkEnPassant
    //Left
    let leftCol = srcCol - 1
    if (leftCol >= 0) {
      let leftNeighbor = this.getValueAtSquare(srcRow, leftCol)
      //If space to the left has an enemy pawn
      if ((leftNeighbor !== '*') && (leftNeighbor.getPieceType() === 'P') && (this.state.whiteToMove !== leftNeighbor.getIsWhite())) {
        //If enemy moved two spaces forward on its last move and it was LAST turn
        if (
          leftNeighbor.getCol() === leftNeighbor.getPrevCol() &&
          leftNeighbor.getRow() === (leftNeighbor.getPrevRow() + (2 * -dir)) &&
          leftNeighbor.getFirstMoveTS() === (this.state.halfTurnCount - 1)
        ) {
          dstRow = srcRow + dir
          dstCol = leftCol
          moveMatrix[dstRow][dstCol] = ENPASSANT
        }
      }
    }
    //Right
    let rightCol = srcCol + 1
    if (rightCol <= 7) {
      let rightNeighbor = this.getValueAtSquare(srcRow, rightCol)
      if ((rightNeighbor !== '*') && (rightNeighbor.getPieceType() === 'P') && (this.state.whiteToMove !== rightNeighbor.getIsWhite())) {
        //If enemy moved two spaces forward on its last move and it was LAST turn
        if (
          rightNeighbor.getCol() === rightNeighbor.getPrevCol() &&
          rightNeighbor.getRow() === (rightNeighbor.getPrevRow() + (2 * -dir)) &&
          rightNeighbor.getFirstMoveTS() === (this.state.halfTurnCount - 1)
        ) {
          dstRow = srcRow + dir
          dstCol = rightCol
          moveMatrix[dstRow][dstCol] = ENPASSANT
        }
      }
    }
    //Check for pawn promotion
    if (isWhite) {
      dstRow = 0
    }
    else {
      dstRow = 7
    }
    for (let dstCol = 0; dstCol <= 7; dstCol++) {
      let dstSquare = moveMatrix[dstRow][dstCol]
      if (dstSquare === AVAILABLE || dstSquare === CAPTURE) {
        moveMatrix[dstRow][dstCol] = PROMOTE
      }
    }
    //Look for checks i.e. update dangerBoard... Maybe not here -> revealed attack

    return moveMatrix
  }
  knightMoves(){
    var thisKnight = this.state.ssPiece
    var srcRow = thisKnight.getRow()
    var srcCol = thisKnight.getCol()
    var moveMatrix = this.initBoard()

    let dstRow = -1
    let dstCol = -1

    let moveModifiers = []

    //Enumerate move modifiers from srcRow, srcCol
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
      if (this.isCapturable(dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    return moveMatrix
  }
  rookMoves(){
    var thisRook = this.state.ssPiece
    var srcRow = thisRook.getRow()
    var srcCol = thisRook.getCol()
    var moveMatrix = this.initBoard()
    var maxDist = 7
    moveMatrix = this.columnsAndRows(srcRow, srcCol, moveMatrix, maxDist)
    return moveMatrix
  }
  bishopMoves(){
    var thisBishop = this.state.ssPiece
    var srcRow = thisBishop.getRow()
    var srcCol = thisBishop.getCol()
    var moveMatrix = this.initBoard()
    var maxDist = 7
    moveMatrix = this.diagonals(srcRow, srcCol, moveMatrix, maxDist)
    return moveMatrix
  }
  queenMoves(){
    var thisQueen = this.state.ssPiece
    var srcRow = thisQueen.getRow()
    var srcCol = thisQueen.getCol()
    var moveMatrix = this.initBoard()
    var maxDist = 7
    moveMatrix = this.columnsAndRows(srcRow, srcCol, moveMatrix, maxDist)
    moveMatrix = this.diagonals(srcRow, srcCol, moveMatrix, maxDist)
    return moveMatrix
  }
  kingMoves(){
    var thisKing = this.state.ssPiece
    var srcRow = thisKing.getRow()
    var srcCol = thisKing.getCol()
    var moveMatrix = this.initBoard()
    var maxDist = 1
    moveMatrix = this.columnsAndRows(srcRow, srcCol, moveMatrix, maxDist)
    moveMatrix = this.diagonals(srcRow, srcCol, moveMatrix, maxDist)
    if (!thisKing.getHasMoved()) {
      //Kingside Castle
      if (
        this.sqIsEmpty(srcRow, (srcCol+1)) &&
        this.sqIsEmpty(srcRow, (srcCol+2)))
      {
        let ksRook = this.getValueAtSquare(srcRow, (srcCol+3))
        if ((ksRook !== null) && (ksRook !== '*') && (!ksRook.getHasMoved())) {
          moveMatrix[srcRow][srcCol + 2] = CASTLE
        }
      }
      else if(
        this.sqIsEmpty(srcRow, (srcCol-1)) &&
        this.sqIsEmpty(srcRow, (srcCol-2)) &&
        this.sqIsEmpty(srcRow, (srcCol-3)))
      {
        let qsRook = this.getValueAtSquare(srcRow, (srcCol-4))
        if ((qsRook !== null) && (qsRook !== '*') && (!qsRook.getHasMoved())) {
          moveMatrix[srcRow][srcCol - 2] = CASTLE
        }
      }

    }
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

  /********************************************
  ******* Piece & Movement Helpers ************
  *********************************************/
  isCapturable(dstRow, dstCol) {
    let whiteToMove = this.state.whiteToMove
    if(this.sqIsEmpty(dstRow, dstCol) || !this.sqInBounds(dstRow, dstCol)) {
      return false
    }
    let victim = this.getValueAtSquare(dstRow, dstCol)
    if ((whiteToMove && !(victim.getIsWhite())) || (!whiteToMove && victim.getIsWhite())) {
      return true
    }
    else {
      return false
    }
  }
  sqIsEmpty(i, j) {
    if (!this.sqInBounds(i, j)) {
      return null
    }
    return (this.getValueAtSquare(i,j) === '*')
  }
  getValueAtSquare(i, j) {
    if (!this.sqInBounds(i, j)) {
      return null
    }
    return this.state.board[i][j]
  }
  sqInBounds(i, j) {
    return !(i < 0 || j < 0 || i > 7 || j > 7)
  }
  /*
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
  */

  /********************************************
  ************** Click Handlers ***************
  *********************************************/
  /****
  Square Click Handler etc.
  ****/
  /**
    When the user clicks on the board, decide what to do

    What should happen when a square is clicked?
      +Check: if a piece is selected
        - +Check: Is this new (i, j) a different piece?
          + break
        + Check: Is this new (i, j) in the selected piece's possible moves?
          + then place this piece on that sq.
      +Check: if color matches whose turn it is
      +set state: this piece @ i,j is selected
      +Determine possible moves
      -Square is highlighted (un-highlight old sq.)
      -Display grey dots
  **/
  handleSquareClick(i, j) {
    //Get piece @ i, j
    let sqValue = this.getValueAtSquare(i, j)
    if (sqValue === null) {
      console.log("clicked sq is null (should not occur)")
    }
    //If sqValue is a piece and its that color's move, select it
    if(sqValue !== '*' && sqValue.getIsWhite() === this.state.whiteToMove) {
      this.selectSquare(sqValue)
    }
    else if (this.state.ssPiece !== null) {
      this.moveDispatcher(i, j)
      this.deselectSquare()
    }
  }
    /*
    //If not a * then a piece exists
      //If a piece exists, is it a piece for this player
        //If yes, store the piece
    //Otherwise, if a piece is already seleceted
      //whether empty or enemy piece, try to move
      //de-select the square
    //If sqValue is a piece and its that color's move, select it
    else if (sqValue !== '*' && (this.state.whiteToMove === this.isWhite(sqValue))) {
      this.selectSquare(i, j, sqValue)
    }

    //Move the previously selected piece to (i, j) if possible.
    else if (this.state.ssPiece !== null) {
      this.moveDispatcher(i, j)
      this.deselectSquare()
    }
    //Always de-select the current square
  }
    */
  selectSquare(piece) {
    this.setState({
      ssPiece: piece
    })
  }
    /*
    this.setState({
      ssPiece: piece,
      ssPieceType: this.getPieceType(piece),
      ssIsWhite: this.isWhite(piece),
      ssRow: i,
      ssCol: j
    })
    */
  deselectSquare() {
    this.setState({
      ssPiece: null,
    })
  }
  /*
      ssPieceType: null,
      ssIsWhite: null,
      ssRow: -1,
      ssCol: -1
    })
  }
  */
  moveDispatcher(i, j) {
    //Get the possible moves for this piece, and see if (i, j) is possible
    let moveMatrix = this.getMoves(this.state.ssPiece)
    if (moveMatrix[i][j] !== '*') {
      this.moveSelectedPiece(i, j, moveMatrix[i][j])
    }
  }
  getMoves(ssPiece) {
    let moveMatrix = []
    let pieceType = ssPiece.getPieceType()
    if (pieceType === 'P') {moveMatrix = this.pawnMoves()}
    else if (pieceType === 'R') {moveMatrix = this.rookMoves()}
    else if (pieceType === 'N') {moveMatrix = this.knightMoves()}
    else if (pieceType === 'B') {moveMatrix = this.bishopMoves()}
    else if (pieceType === 'Q') {moveMatrix = this.queenMoves()}
    else if (pieceType === 'K') {moveMatrix = this.kingMoves()}
    //else no possible moves
    //console.log(moveMatrix)
    return moveMatrix
  }
  /**
    Given a state and a destination, update state by moving piece if poss.
  **/
  moveSelectedPiece(i, j, type) {
    /* Move this.ssPiece to (i, j)*/
    var tmpBoard = this.state.board.slice()
    var ssPiece = this.state.ssPiece
    var ssRow = ssPiece.row
    var ssCol = ssPiece.col
    var ts = this.state.halfTurnCount  //Timestamp of this move

    if (type === ENPASSANT) {
      if (ssPiece.getIsWhite()) {
        //Remove piece Row + 1g
        tmpBoard[i + 1][j] = '*'
      }
      else {
        tmpBoard[i - 1][j] = '*'
      }
    }
    else if (type === CASTLE) {
      if (j === 6) {
        //Swap rook to i, 5
        let tmpRook = tmpBoard[i][7]
        tmpBoard[i][7] = '*'
        tmpBoard[i][5] = tmpRook
        tmpRook.movePiece(i, 5, ts)
      }
      else {
        //Swap rook to i, 4
        let tmpRook = tmpBoard[i][0]
        tmpBoard[i][0] = '*'
        tmpBoard[i][3] = tmpRook
        tmpRook.movePiece(i, 3, ts)
      }
    }
    else if (type === PROMOTE) {
      ssPiece.promotePiece()
    }

    tmpBoard[ssRow][ssCol] = "*"  //Empty old space
    tmpBoard[i][j] = ssPiece  //move piece to new space
    console.log("Move piece: ", i, j, ts)
    ssPiece.movePiece(i,j,ts)
    //console.log(this.state.turnCount)
    let newHalfCount = this.state.halfTurnCount + 1
    if (!this.state.whiteToMove) {
      let newCount = this.state.turnCount + 1
      this.setState({
        turnCount: newCount
      })
    }
    this.setState({
      board: tmpBoard,
      whiteToMove: this.toggleTurnID(),
      halfTurnCount: newHalfCount
    })
    this.updateHistory(newHalfCount)
  }

  handleNewGameClick() {
    this.resetGame()
  }

  /****
  Revert State Click Handler etc.
  ****/
  handleStateClick(direction) {
    if (direction === -1) {
      console.log("Attempting to revert to last board state")
      this.getHistory(this.state.halfTurnCount - 1)
    }
    else {
      console.log("Attempting to move to the next board state")
      this.getHistory(this.state.halfTurnCount + 1)
    }
  }


  /**********************************
   ********* Meta Game Info *********
   **********************************/
  toggleTurnID() {
    if(this.state.whiteToMove) {
      return false
    }
    else {
      return true
    }
  }
  getTurnID() {
    return (this.state.whiteToMove ? 'White' : 'Black')
  }
  getTurnCount() {
    return this.state.turnCount
  }
  /**
  reates an 8x8 matrix to represent the board
  **/
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
  /**
    When a user starts a new game, invoke this function to setup the board.
    Board Legend:
      P = Pawn, R = Rook, N = Knight, B = Bishop
      Q = Queen, K = King, * = Empty
      _b = black, _w = white
 **/
  setBoardNewGame(boardState) {
    var boardSize = boardState.length
    for (var i = 0; i < boardSize; i++) {
      for (var j = 0; j < boardSize; j++) {
        /* Place pieces */
        //Black Pawns
        if (i === 1) {
            //boardState[i][j] = 'Pb'
            boardState[i][j] = new Piece('Pb', i, j)
        }
        //Black homerow
        if (i === 0) {
          if (j === 0 || j === 7) {
            //boardState[i][j] = 'Rb'
            boardState[i][j] = new Piece('Rb', i, j)
          }
          if (j === 1 || j === 6) {
            //boardState[i][j] = 'Nb'
            boardState[i][j] = new Piece('Nb', i, j)
          }
          if (j === 2 || j === 5) {
            //boardState[i][j] = 'Bb'
            boardState[i][j] = new Piece('Bb', i, j)
          }
          if (j === 3) {
            //boardState[i][j] = 'Qb'
            boardState[i][j] = new Piece('Qb', i, j)
          }
          if (j === 4) {
            //boardState[i][j] = 'Kb'
            boardState[i][j] = new Piece('Kb', i, j)
          }
        }

        //White pawns
        if (i === 6) {
            //boardState[i][j] = 'Pw'
            boardState[i][j] = new Piece('Pw', i, j)
        }
        //White homerow
        if (i === 7) {
          if (j === 0 || j === 7) {
            //boardState[i][j] = 'Rw'
            boardState[i][j] = new Piece('Rw', i, j)
          }
          if (j === 1 || j === 6) {
            //boardState[i][j] = 'Nw'
            boardState[i][j] = new Piece('Nw', i, j)
          }
          if (j === 2 || j === 5) {
            //boardState[i][j] = 'Bw'
            boardState[i][j] = new Piece('Bw', i, j)
          }
          if (j === 3) {
            //boardState[i][j] = 'Qw'
            boardState[i][j] = new Piece('Qw', i, j)
          }
          if (j === 4) {
            //boardState[i][j] = 'Kw'
            boardState[i][j] = new Piece('Kw', i, j)
          }
        }
      }
    }
    return boardState
  }
  copyBoard(boardState) {
    let deepCopy = this.initBoard()
    for (let i = 0; i < deepCopy.length; i++) {
      for (let j = 0; j < deepCopy.length; j++) {
          deepCopy[i][j] = this.copySquare(boardState[i][j])
      }
    }
    return deepCopy
  }
  copySquare(sqValue) {
    if (sqValue !== '*') {
      return sqValue.deepCopy()
    }
    else {
      return sqValue
    }
  }
  updateHistory(newHalfCount) {
    var current = this.copyBoard(this.state.board)
    var newHistory = []
    //Re-Write history if we go backwards, and make a different move
    if (newHalfCount < this.state.history.length) {
      newHistory = this.state.history.slice(0, newHalfCount)
    }
    else {
      newHistory = this.state.history
    }
    newHistory.push(current)
    this.setState({
      history: newHistory
    })
  }
  getHistory(index) {
    if (index >= 0 && index < this.state.history.length) {
      this.setState({
        board: this.copyBoard(this.state.history[index]),
        turnCount: (Math.floor(index/2) + 1),
        halfTurnCount: index,
      })
      console.log(this.state.history[index])
      if ((index % 2) === 0) {
        console.log("It is now white's turn")
        this.setState({
          whiteToMove: true
        })
      }
      else {
        console.log("It is now black's turn")
        this.setState({
          whiteToMove: false
        })
      }
    }
    else {
      console.log("No history")
    }
  }
  resetGame() {
    this.setState({
      board: this.setBoardNewGame(this.initBoard()),
      history: [this.setBoardNewGame(this.initBoard())],
      whiteToMove: true,
      turnCount: 0,
      halfTurnCount: 0,
      ssPiece: null,
      ssPieceType: null,
      ssIsWhite: null,
      ssRow: -1,
      ssCol: -1,
    })
  }

  /********************************************
  ************ Render the Board ***************
  *********************************************/
  render() {
    console.log(this.state.board)
    return (
      <div className="game-container">
        <div className="game-header">
          <div id="turn-id">
            Whose turn is it: {this.getTurnID()} | Turn: {this.getTurnCount()}
          </div>
          <div>
            <button id="prev-state-btn" onClick={() => this.handleStateClick(-1)} className="state-arrow-button">{"<-"}</button>
            <button id="next-state-btn" onClick={() => this.handleStateClick(1)} className="state-arrow-button">{"->"}</button>
          </div>
          <div>
            <button id="new-game-btn" onClick={() => this.handleNewGameClick()} className="new-game-button">New Game</button>
          </div>
        </div>

        <Board onClick={(i, j) => this.handleSquareClick(i, j)} board={this.state.board}/>
      </div>
    );
  }
}

export default Game //Make this class public

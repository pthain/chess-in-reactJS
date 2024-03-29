import React from 'react'
import Board from './Board.js'
import Piece from './Piece.js'
import Move from './Move.js'
import GameHeader from './GameHeader.js'

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
      legalMoves: [],
      history: [this.setBoardNewGame(this.initBoard())],
      whiteToMove: true,
      turnCount: 1,
      halfTurnCount: 0,
      ssPiece: null,
      isInCheckmate: false
    }
  }

  componentDidMount() {
    this.setLegalMoves()
  }

  componentDidUpdate() {
      if (this.state.legalMoves.length === 0) {
        let ret = this.setLegalMoves()

        if (ret === -1) {
          let king = this.getKing(this.state.board)
          if (this.isKingInCheck(this.state.board, king)) {
            if (this.state.isInCheckmate === false) {
              console.log("You are in checkmate!")
              this.setStalemate(false)
              this.setCheckmate(true)
            }
          }
          else {
            if (this.state.isInStalemate === false) {
              console.log("You are out of moves!")
              this.setCheckmate(false)
              this.setStalemate(true)
            }
          }
        }
        else {
          //console.log("We got some moves!")
          this.setCheckmate(false)
          this.setStalemate(false)
        }
      }
  }

  /********************************************
  *********** Piece Movement Rules ************
  *********************************************/
  pawnMoves(board, thisPawn, isWhiteToMove, ts) {
    //var thisPawn = this.state.ssPiece
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
    if (this.sqIsEmpty(board, dstRow, srcCol)) {
      moveMatrix[dstRow][srcCol] = AVAILABLE
      //Mark a move-two if possible
      dstRow = dstRow + dir
      if ((!(thisPawn.getHasMoved())) && this.sqIsEmpty(board, dstRow, srcCol)) {
        moveMatrix[dstRow][srcCol] = AVAILABLE
      }
    }
    //Mark a capture if possible
    dstRow = srcRow + dir
    dstCol = srcCol - 1 //Left
    if (dstCol >= 0) {
      if (!this.sqIsEmpty(board, dstRow, dstCol) && this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    dstCol = srcCol + 1 //Right
    if (dstCol <= 7) {
      if (!this.sqIsEmpty(board, dstRow, dstCol) && this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    //Check for checkEnPassant
    //Left
    let leftCol = srcCol - 1
    if (leftCol >= 0) {
      let leftNeighbor = this.getValueAtSquare(board, srcRow, leftCol)
      //If space to the left has an enemy pawn
      if ((leftNeighbor !== '*') && (leftNeighbor.getPieceType() === 'P') && (isWhiteToMove !== leftNeighbor.getIsWhite())) {
        //If enemy moved two spaces forward on its last move and it was LAST turn
        if (
          leftNeighbor.getCol() === leftNeighbor.getPrevCol() &&
          leftNeighbor.getRow() === (leftNeighbor.getPrevRow() + (2 * -dir)) &&
          leftNeighbor.getFirstMoveTS() === (ts - 1)
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
      let rightNeighbor = this.getValueAtSquare(board, srcRow, rightCol)
      if ((rightNeighbor !== '*') && (rightNeighbor.getPieceType() === 'P') && (isWhiteToMove !== rightNeighbor.getIsWhite())) {
        //If enemy moved two spaces forward on its last move and it was LAST turn
        if (
          rightNeighbor.getCol() === rightNeighbor.getPrevCol() &&
          rightNeighbor.getRow() === (rightNeighbor.getPrevRow() + (2 * -dir)) &&
          rightNeighbor.getFirstMoveTS() === (ts - 1)
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
    return moveMatrix
  }
  knightMoves(board, thisKnight, isWhiteToMove){
    //var thisKnight = this.state.ssPiece
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
      else if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
        moveMatrix[dstRow][dstCol] = CAPTURE
      }
    }
    return moveMatrix
  }
  rookMoves(board, thisRook, isWhiteToMove){
    //var thisRook = this.state.ssPiece
    var srcRow = thisRook.getRow()
    var srcCol = thisRook.getCol()
    var moveMatrix = this.initBoard()
    var maxDist = 7
    moveMatrix = this.columnsAndRows(board, srcRow, srcCol, moveMatrix, maxDist, isWhiteToMove)
    return moveMatrix
  }
  bishopMoves(board, thisBishop, isWhiteToMove){
    //var thisBishop = this.state.ssPiece
    var srcRow = thisBishop.getRow()
    var srcCol = thisBishop.getCol()
    var moveMatrix = this.initBoard()
    var maxDist = 7
    moveMatrix = this.diagonals(board, srcRow, srcCol, moveMatrix, maxDist, isWhiteToMove)
    return moveMatrix
  }
  queenMoves(board, thisQueen, isWhiteToMove){
    //var thisQueen = this.state.ssPiece
    var srcRow = thisQueen.getRow()
    var srcCol = thisQueen.getCol()
    var moveMatrix = this.initBoard()
    var maxDist = 7
    moveMatrix = this.columnsAndRows(board, srcRow, srcCol, moveMatrix, maxDist, isWhiteToMove)
    moveMatrix = this.diagonals(board, srcRow, srcCol, moveMatrix, maxDist, isWhiteToMove)
    return moveMatrix
  }
  kingMoves(board, thisKing, isWhiteToMove){
    //var thisKing = this.state.ssPiece
    var srcRow = thisKing.getRow()
    var srcCol = thisKing.getCol()
    var moveMatrix = this.initBoard()
    var maxDist = 1
    moveMatrix = this.columnsAndRows(board, srcRow, srcCol, moveMatrix, maxDist, isWhiteToMove)
    moveMatrix = this.diagonals(board, srcRow, srcCol, moveMatrix, maxDist, isWhiteToMove)
    if (!thisKing.getHasMoved()) {
      //Kingside Castle
      if (
        this.sqIsEmpty(board, srcRow, (srcCol+1)) &&
        this.sqIsEmpty(board, srcRow, (srcCol+2)))
      {
        let ksRook = this.getValueAtSquare(board, srcRow, (srcCol+3))
        if ((ksRook !== null) && (ksRook !== '*') && (!ksRook.getHasMoved())) {
          //Check that the moves are legal
          let moves =[
            (new Move(thisKing, srcRow, (srcCol), AVAILABLE)),
            (new Move(thisKing, srcRow, (srcCol+1), AVAILABLE)),
            (new Move(thisKing, srcRow, (srcCol+2), AVAILABLE))
          ]
          let expectedLength = moves.length
          moves = this.pruneMovesThatCauseCheck(moves)
          if (moves.length === expectedLength) {
            moveMatrix[srcRow][srcCol + 2] = CASTLE
          }
        }
      }
      else if(
        this.sqIsEmpty(board, srcRow, (srcCol-1)) &&
        this.sqIsEmpty(board, srcRow, (srcCol-2)) &&
        this.sqIsEmpty(board, srcRow, (srcCol-3)))
      {
        let qsRook = this.getValueAtSquare(board, srcRow, (srcCol-4))
        if ((qsRook !== null) && (qsRook !== '*') && (!qsRook.getHasMoved())) {
          //Check that the moves are legal
          let moves =[
            (new Move(thisKing, srcRow, (srcCol), AVAILABLE)),
            (new Move(thisKing, srcRow, (srcCol-1), AVAILABLE)),
            (new Move(thisKing, srcRow, (srcCol-2), AVAILABLE)),
            (new Move(thisKing, srcRow, (srcCol-3), AVAILABLE))]
          let expectedLength = moves.length
          moves = this.pruneMovesThatCauseCheck(moves)
          if (moves.length === expectedLength) {
            moveMatrix[srcRow][srcCol - 2] = CASTLE
          }
        }
      }

    }
    return moveMatrix
  }
  columnsAndRows(board, srcRow, srcCol, moveMatrix, maxDist, isWhiteToMove) {
    let dstRow = -1
    let dstCol = -1
    //North
    dstCol = srcCol
    for (let i = 1; (srcRow - i >= 0) && (i <= maxDist); i++) {
      dstRow = (srcRow - i)
      if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: rook can't move past a piece
        break
      }
    }
    //South
    for (let i = 1; (srcRow + i <= 7) && (i <= maxDist); i++) {
      dstRow = srcRow + i
      if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      else {
        if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
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
      if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: rook can't move past a piece
        break
      }
    }
    //East
    for (let i = 1; (srcCol + i <= 7) && (i <= maxDist); i++) {
      dstCol = srcCol + i
      if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
          moveMatrix[dstRow][dstCol] = CAPTURE
        }
        //Stop: rook can't move past a piece
        break
      }
    }
    return moveMatrix
  }
  diagonals(board, srcRow, srcCol, moveMatrix, maxDist, isWhiteToMove) {
    let dstRow = -1
    let dstCol = -1

    //NE
    for (let i = 1; (((srcCol + i) <= 7 || (srcRow - i) >= 0) && i <= maxDist); i++) {
      dstRow = srcRow - i
      dstCol = srcCol + i
      if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
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
      if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
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
      if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
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
      if (this.sqIsEmpty(board, dstRow, dstCol)) {
        moveMatrix[dstRow][dstCol] = AVAILABLE
      }
      //If not empty, then there is a piece.
      else {
        if (this.isCapturable(board, dstRow, dstCol, isWhiteToMove)) {
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
  isCapturable(board, dstRow, dstCol, isWhiteToMove) {
    //let whiteToMove = this.state.whiteToMove
    if(this.sqIsEmpty(board, dstRow, dstCol) || !this.sqInBounds(dstRow, dstCol)) {
      return false
    }
    let victim = this.getValueAtSquare(board, dstRow, dstCol)
    if ((isWhiteToMove && !(victim.getIsWhite())) || (!isWhiteToMove && victim.getIsWhite())) {
      return true
    }
    else {
      return false
    }
  }
  sqIsEmpty(board, i, j) {
    if (!this.sqInBounds(i, j)) {
      return null
    }
    return (this.getValueAtSquare(board,i,j) === '*')
  }
  getValueAtSquare(board, i, j) {
    if (!this.sqInBounds(i, j)) {
      return null
    }
    return board[i][j]
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
    let legalMoves = this.state.legalMoves
    let sqValue = this.getValueAtSquare(this.state.board, i, j)
    var isWhiteToMove = this.state.whiteToMove

    if (sqValue === null) {
      console.log("clicked sq is null (should not occur)")
    }
    //If sqValue is a piece and its that color's move, select it
    if(sqValue !== '*' && sqValue.getIsWhite() === isWhiteToMove) {
      this.selectSquare(sqValue)
    }

    //if (there exists a legal move from sqValue to i, j in legalMoves)
    else if (this.state.ssPiece !== null) {
      if (this.moveIsValid(this.state.ssPiece, i, j, legalMoves)) {
        let srcPiece = this.state.ssPiece
        let ts = this.state.halfTurnCount
        let updatedBoard = this.moveDispatcher(this.state.board, i, j, srcPiece, isWhiteToMove, ts)
        if (updatedBoard !== null) {
          this.setBoardState(updatedBoard) //The move to i, j was valid, reflect on board
          this.clearLegalMoves()
        }
      }
      this.deselectSquare()
    }
  }

  moveIsValid(piece, dstRow, dstCol, legalMoves) {
    for (let i = 0; i < legalMoves.length; i++) {
      var m = legalMoves[i]
      if (
        piece.getPieceId() && m.getPiece().getPieceId() &&
        piece.getRow() === m.getPiece().getRow() &&
        piece.getCol() === m.getPiece().getCol() &&
        dstRow === m.getDstRow() &&
        dstCol === m.getDstCol()
      )
      {
        return true //The piece trying to move to dstRow, dstCol is a legal move
      }
    }
    return false //Went through the whole list, this move did not match a legal move
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
  moveDispatcher(board, i, j, srcPiece, isWhiteToMove, ts) {
    //Get the possible moves for this piece, and see if (i, j) is possible
    let moveMatrix = this.getMoves(board, srcPiece, isWhiteToMove, ts)
    if (moveMatrix[i][j] !== '*') {
      var updatedBoard = this.movePieceOnBoard(board, srcPiece, i, j, moveMatrix[i][j], ts)
      return updatedBoard
    }
    return null
  }
  getMoves(board, ssPiece, isWhiteToMove, ts) {
    let moveMatrix = []
    let pieceType = ssPiece.getPieceType()
    if (pieceType === 'P') {moveMatrix = this.pawnMoves(board, ssPiece, isWhiteToMove, ts)}
    else if (pieceType === 'R') {moveMatrix = this.rookMoves(board, ssPiece, isWhiteToMove)}
    else if (pieceType === 'N') {moveMatrix = this.knightMoves(board, ssPiece, isWhiteToMove)}
    else if (pieceType === 'B') {moveMatrix = this.bishopMoves(board, ssPiece, isWhiteToMove)}
    else if (pieceType === 'Q') {moveMatrix = this.queenMoves(board, ssPiece, isWhiteToMove)}
    else if (pieceType === 'K') {moveMatrix = this.kingMoves(board, ssPiece, isWhiteToMove)}
    //else no possible moves
    //console.log(moveMatrix)
    return moveMatrix

  }
  /**
    Given a state and a destination, update state by moving piece if poss.
  **/
  movePieceOnBoard(board, srcPiece, i, j, type, ts) {
    //Move this.ssPiece to (i, j)
    var tmpBoard = this.copyBoard(board)
    var ssPiece = srcPiece
    var ssRow = srcPiece.getRow()
    var ssCol = ssPiece.getCol()

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
    //console.log("Move piece: ", ssPiece.getPieceType(), i, j, ts)
    ssPiece.movePiece(i,j,ts)
    return tmpBoard
  }

  setBoardState(updatedBoard) {
    let newHalfCount = this.state.halfTurnCount + 1
    if (!this.state.whiteToMove) {
      let newCount = this.state.turnCount + 1
      this.setState({
        turnCount: newCount
      })
    }
    this.setState({
      board: updatedBoard,
      whiteToMove: this.toggleTurnID(),
      halfTurnCount: newHalfCount
    })
    this.updateHistory(updatedBoard, newHalfCount)
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
  setCheckmate(isInCheckmate) {
    this.setState({
      isInCheckmate: isInCheckmate
    })
  }
  setStalemate(isInStalemate) {
    this.setState({
      isInStalemate: isInStalemate
    })
  }
  clearLegalMoves() {
    this.setState ({
      legalMoves: []
    })
  }
  setLegalMoves() {
    var lglMoves = this.state.legalMoves
  //  var isWhiteToMove = this.state.whiteToMove
  //  console.log(isWhiteToMove)
    //A move is a piece, dstRow, dstCol
    //for every space
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        //If this space is a piece, getItsmoves
        if (!this.sqIsEmpty(this.state.board, i, j)) {
          let pieceToMove = this.getValueAtSquare(this.state.board, i, j)
          if (pieceToMove.getIsWhite() === this.state.whiteToMove) {
            //console.log("Get moves for ", pieceToMove.getPieceId()," at", i, j)
            //lglMoves.push(new Move(pieceToMove, -1, -1))
            let moveMatrix = this.getMoves(this.state.board, pieceToMove, this.state.whiteToMove , this.state.halfTurnCount)
            let movesForThisPiece = this.parseMovesFromMatrix(pieceToMove, moveMatrix)
            //lglMoves.concat(movesForThisPiece)
            if (movesForThisPiece.length !== 0) {
              Array.prototype.push.apply(lglMoves, movesForThisPiece)
            }
          }
        }
      }
    }
    lglMoves = this.pruneMovesThatCauseCheck(lglMoves)
    /*
    for (let i = 0; i < lglMoves.length; i++) {
      let m = lglMoves[i]
      console.log(m.getPiece().getPieceId(), m.getDstRow(), m.getDstCol(), m.getType())
    }
    */
    //console.log(lglMoves)
    if (lglMoves.length === 0) {
      //console.log("You have no legal moves!")
      return -1
    }
    else {
      this.setState({
        legalMoves: lglMoves
      })
      return 0
    }
  }
  parseMovesFromMatrix(piece, moveMatrix) {
    var lglMovesPartial = []
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        //console.log(moveMatrix)
        let type = moveMatrix[i][j]
        if (type !== '*') {
          lglMovesPartial.push(new Move(piece, i, j, type))
        }
      }
    }
    return lglMovesPartial
  }
  pruneMovesThatCauseCheck(moves) {
    const initialBoard = this.state.board
    var originalLength = moves.length
    for (let i = originalLength -1; i >= 0; i--) {
      let m = moves[i]
      //Make the move
      var tmpBoard = this.movePieceOnBoard(initialBoard, m.getPiece().deepCopy(), m.getDstRow(), m.getDstCol(), m.getType(), this.state.halfTurnCount)
      var king = this.getKing(tmpBoard)
      if (this.isKingInCheck(tmpBoard, king)) {
        moves.splice(i, 1) //Remove Item
      }
    }
    return moves
  }
  isKingInCheck(board, king) {
    if (king === null) {
      return false
    }
    //Try to move every other piece of the enemy.
    var enemyIsWhite = !(king.getIsWhite())
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        if (!this.sqIsEmpty(board, i, j)) {                       //If this space is not empty, get the piece
          let potentialThreat = this.getValueAtSquare(board, i, j)
          if (potentialThreat.getIsWhite() === enemyIsWhite) {      //If the piece is an enemy to the king, get its moves
            let moveMatrix = this.getMoves(board, potentialThreat, enemyIsWhite, this.state.halfTurnCount + 1)
            let movesForThisPiece = this.parseMovesFromMatrix(potentialThreat, moveMatrix)
            for (let i = 0; i < movesForThisPiece.length; i++) {
              let enemyMove = movesForThisPiece[i]
              if (
                ((enemyMove.getType() === CAPTURE) || (enemyMove.getType() === PROMOTE)) &&
                (enemyMove.getDstRow() === king.getRow()) &&
                (enemyMove.getDstCol() === king.getCol())
              ) {
                return true //If atleast one move can capture the king, then the king is check
              }
            }
          }
        }
      }
    }
    return false //Went through every move, and no enemy piece could take the king. No check.
  }
  getKing(board) {
    //Board is a slice of the original with a hypothetical move
    //Get King
    var isWhiteToMove = this.state.whiteToMove
    var king = null
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        //console.log(board[i][j])
        if ((board[i][j] !== '*') &&
            (board[i][j].getPieceType() === 'K') &&
            (board[i][j].getIsWhite() === isWhiteToMove))
        {
          king = board[i][j]
        }
      }
    }
    if (king === null) {
      console.log("King can't be found!")
      return false
    }
    return king
  }
  findCheck() {
    /*

    //Run findCheck for EVERY move in the moveList
    function findCheck(board, whiteToMove) {

    }

    When does it matter if a king is in check?
    White's turn:
      - At the beginning of white's turn, figure out if a king is in check.
      - if white's king is in check, must make a move out of check
      - black king will NOT be in check during white's turn (Otherwise the game would be over)
      -

    an idea:
      from king:
        check rows, cols, diagonals, and surrounding knight spaces
        if an enemy of the right type is there, king is in check




      1. You can never put your own king in check
      2. You can never end a turn with your own king in check
      3. You can never select a piece that has no moves


      Ideas

      RADICAL:
        a) Calculate all legal moves at the start of every turn
        b) When handling a click, if the selected piece makes a legal move, execute it
        c) if no legal moves, and king is in check, checkmate
        d) When Calculating legal moves list, only accepts moves that do not result in a king in check

      OUT OF MOVES -- one team cannot make any legal plays
      CHECK -- one team's king is in danger of being attacked by another player

      After you attempt to make a move, but before you excute, ask:
        Is my king in CHECK? If yes, CANCEL the move, deselect, do nothing else
      After a successful move, ask:
        Is my opponent OUT OF MOVES?
          if OUT OF MOVES and king is in *CHECK*, then *CHECKMATE*
          else *STALEMATE*

      Questions:
        How can you determine if there are no possible moves? (stalemate, king for checkmate)
    */
  }
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
  getEnemyID() {
    return (!this.state.whiteToMove ? 'White' : 'Black')
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
  updateHistory(current, newHalfCount) {
    current = this.copyBoard(current)
    //var newHistory = []
    //Re-Write history if we go backwards, and make a different move
    if (newHalfCount < this.state.history.length) {
      //newHistory = this.state.history.slice(0, newHalfCount)
      //console.log("Time to rewrite history...")
      this.setState(prevState => ({
        history: [...prevState.history.slice(0, newHalfCount), current]
      }))
    }
    else {
      this.setState(prevState => ({
        history: [...prevState.history, current]
      }))
    }
    /*
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
    */
  }
  getHistory(index) {
    this.clearLegalMoves()
    if (index >= 0 && index < this.state.history.length) {
      this.setState({
        board: this.copyBoard(this.state.history[index]),
        turnCount: (Math.floor(index/2) + 1),
        halfTurnCount: index,
      })
      //console.log(this.state.history[index])
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
      turnCount: 1,
      halfTurnCount: 0,
      ssPiece: null,
      isInCheckmate: false,
      isInStalemate: false
    })
    this.clearLegalMoves()
  }

  /********************************************
  ************ Render the Board ***************
  *********************************************/
  getTurnIndicatorClass() {
    let retCN = "turn-id-indicator "
    if (this.state.whiteToMove) {
      retCN = retCN.concat("white ")
    }
    else {
      retCN = retCN.concat("black ")
    }
    return retCN
  }
  render() {
    //console.log(this.state.history, this.state.halfTurnCount)
    return (
      <div className="game-container">
        <GameHeader
          inCheckmate={this.state.isInCheckmate}
          inStalemate={this.state.isInStalemate}
          turnIndicatorClassName = {this.getTurnIndicatorClass()}
          turnId={this.getTurnID()}
          enemyId={this.getEnemyID()}
          turnCount={this.getTurnCount()}
          prevOnClick={() => this.handleStateClick(-1)}
          nextOnClick={() => this.handleStateClick(1)}
          newGameOnClick={() => this.handleNewGameClick()}
          />
        <Board onClick={(i, j) => this.handleSquareClick(i, j)} ssPiece={this.state.ssPiece} board={this.state.board}/>
      </div>
    );
  }
}

export default Game //Make this class public

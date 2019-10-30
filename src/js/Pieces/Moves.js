const CAPTURE = 'x'
const AVAILABLE = '+'

class Moves {
  constructor(srcRow, srcCol, isWhite) {
    var this.srcRow = srcRow
    var this.srcCol = srcCol
    var this.isWhite = isWhite
  }
  pawnMoves() {
    //Backrow -> promotion
    //Startrow -> move two
    //Capture -> move row+1 && col-1 or col+1
    //En passant:
      //5th rank w: (row === 3) b: (row === 4)
      //&& last move was enemy pawn move two on col j+1 or j-1
    //Otherwise -> move one
    //var isWhite = this.state.ssIsWhite
    //var srcRow = this.state.ssRow
    //var srcCol = this.state.ssCol
    var isWhite = this.isWhite
    var srcRow = this.srcRow
    var srcCol = this.srcCol
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
    //Look for checks

    return moveMatrix
  }
}

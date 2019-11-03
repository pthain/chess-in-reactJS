class Piece {
  constructor(pieceId, row, col) {
    this.pieceId = pieceId
    this.row = row
    this.col = col
    this.hasMoved = false
    this.prevRow = null
    this.prevCol = null
  }

  getPieceId() {
    return this.pieceId
  }
  getPrevRow() {
    return this.prevRow
  }
  getPrevCol() {
    return this.prevRow
  }
  hasMoved() {
    return this.hasMoved
  }
  movePiece(dstRow, dstCol) {
    if (!this.hasMoved) {
      this.hasMoved = true
    }
    this.prevRow = this.row
    this.prevCol = this.col
    this.row = dstRow
    this.col = dstCol
  }

}

export default Piece

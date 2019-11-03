class Piece {
  constructor(pieceId, row, col, ) {
    this.pieceId = pieceId
    this.hasMoved = false
    this.row = row
    this.col = col
    this.prevRow = null
    this.prevCol = null
  }
}
export default Piece

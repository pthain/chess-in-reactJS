class Piece {
  constructor(pieceId, row, col) {
    this.pieceId = pieceId
    this.pieceType = parsePieceType(pieceId)
    this.isWhite = parseIsWhite(pieceId)
    this.row = row
    this.col = col
    this.hasMoved = false
    this.prevRow = null
    this.prevCol = null
  }

  /*initLocation(startRow, startCol) {
    this.row = startRow
    this.col = startCol
  }*/
  getPieceId() {
    return this.pieceId
  }
  getPieceType() {
    return this.pieceType
  }
  getIsWhite() {
    return this.isWhite
  }
  getRow(){
    return this.row
  }
  getCol(){
    return this.col
  }
  getPrevRow() {
    return this.prevRow
  }
  getPrevCol() {
    return this.prevCol
  }
  getFirstMoveTS() {
    return this.firstMoveTimestamp
  }
  getHasMoved() {
    return this.hasMoved
  }
  movePiece(dstRow, dstCol, ts) {
    if (!this.hasMoved) {
      this.hasMoved = true
      this.firstMoveTimestamp = ts
    }
    this.prevRow = this.row
    this.prevCol = this.col
    this.row = dstRow
    this.col = dstCol
  }

}

function parseIsWhite(pieceId) {
  if (pieceId !== null && pieceId.length > 1) {
    if (pieceId.charAt(1) === 'w') {
      return true
    }
    else {
      return false
    }
  }
}

function parsePieceType(pieceId) {
    if(pieceId !== null && pieceId.length > 0) {
      return pieceId.charAt(0)
    }
  }

export default Piece

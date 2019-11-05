class Move {
  constructor(piece, dstRow, dstCol, type) {
    this.piece = piece
    this.dstRow = dstRow
    this.dstCol = dstCol
    this.type = type
  }
  getPiece() {
    return this.piece
  }
  getDstRow(){
    return this.dstRow
  }
  getDstCol(){
    return this.dstCol
  }
  getType() {
    return this.type
  }
}

export default Move

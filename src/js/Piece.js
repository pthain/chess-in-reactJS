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
    this.firstMoveTimestamp = -1
    /*if (this.pieceType === 'K') {
      this.updateKingThreats()
    }*/
  }
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
/*    if (this.pieceType === 'K') {
      this.updateKingThreats()
    }
    */
  }
  deepCopy() {
    var pieceCopy = new Piece(this.pieceId, this.row, this.col)
    pieceCopy.hasMoved = this.hasMoved
    pieceCopy.prevRow = this.prevRow
    pieceCopy.prevCol = this.prevCol
    pieceCopy.firstMoveTimestamp = this.firstMoveTimestamp
    return pieceCopy
  }
  promotePiece() {
    if (this.getIsWhite()) {
      this.pieceId = 'Qw'
      this.pieceType = 'Q'
    }
    else {
      this.pieceId = 'Qb'
      this.pieceType = 'Q'
    }
  }
  /*
  updateKingThreats() {
    //pawn
    this.setPawnThreats()
    //rook
    this.setRookThreats()
    //knight
    this.setKnightThreats()
    //bishop
    this.setBishopThreats()
    //queen
    this.setQueenThreats()
    //king
    this.setKingThreats()
  }

  setPawnThreats() {
    let kRow = this.getRow()
    let kCol = this.getCol()
    let dir = 1
    if (this.getIsWhite() === true) {
      dir = -1
    }
    const pawnThreats = [
      [(kRow + dir), (kCol - 1)],
      [(kRow + dir), (kCol + 1)]
    ]
    this.pThreats = pawnThreats
  }
  setRookThreats() {
    let kRow = this.getRow()
    let kCol = this.getCol()
    var rookThreats = []
    //All sqs on King row
    let tRow = kRow
    for (let i = 0; i < 7; i++) {
      if (i !== kCol) {
        let tCol = i
        rookThreats.push([tRow, tCol])
      }
    }
    let tCol = kCol
    for (let i = 0; i < 7; i++) {
      if (i !== kRow) {
        let tRow = i
        rookThreats.push([tRow, tCol])
      }
    }
    this.rThreats = rookThreats
  }
  setKnightThreats() {
    let kRow = this.getRow()
    let kCol = this.getCol()
    const nThreats = []

    this.nThreats = nThreats
  }
  setBishopThreats() {
    let kRow = this.getRow()
    let kCol = this.getCol()
    let maxDist = 7
    const bThreats = []

    //All sqs on increasing diagonal
    for (let i = 1; (((kCol + i) <= 7 || (kRow - i) >= 0) && i <= maxDist); i++) {
      var dstRow = kRow - i
      var dstCol = kCol + i
    }
    //NW
    for (let i = 1; (((kCol - i) >= 0 || (kRow - i) >= 0) && i <= maxDist); i++) {
      dstRow = kRow - i
      dstCol = kCol - i
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
    for (let i = 1; (((kCol - i) >= 0 || (kRow + i) <= 7) && i <= maxDist); i++) {
      dstRow = kRow + i
      dstCol = kCol - i
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
    for (let i = 1; (((kCol + i) <= 7 || (kRow + i) <= 7) && i <= maxDist); i++) {
      dstRow = kRow + i
      dstCol = kCol + i
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

    this.bThreats = bThreats
  }
  setQueenThreats() {
    let kRow = this.getRow()
    let kCol = this.getCol()
    const qThreats = []

    this.qThreats = qThreats
  }
  setKingThreats() {
    let kRow = this.getRow()
    let kCol = this.getCol()
    const kThreats = []

    this.kThreats = kThreats
  }
  */
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

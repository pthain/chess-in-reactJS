import React from 'react'
import Game from './Game.js'

/*
  This class, when rendered, will return a React Component.
  The Component will contain HTML content for the newly rendered Board.
  In otherwords, everytime there is a state change in the board,
  The render() function will be called again.
*/
class Board extends React.Component {
/*
  createBoard() {
  }
*/
  renderSquare(x, y) {
    //var x = 'x'
    //var y = 'y'
    return (
      <div className='square'>({x}, {y})</div>
    )
  }

  render() {
    let squares = [1,2,3,4,5,6,7,8]
    return (
      <div className="board">
        TestBoard
        {/*this.createBoard()*/}
        {/*Naive approach: Make 8 divs and 8 divs per -> 64 squares */}
        {console.log(squares)}
        {squares.map(item => (
          <div key={item}>{item}</div>
        ))}
      </div>
    )
  }
}

export default Board

import React from 'react'
import '../css/Board.css';

//import Game from './Game.js'

/*
  This class, when rendered, will return a React Component.
  The Component will contain HTML content for the newly rendered Board.
  In otherwords, everytime there is a state change in the board,
  The render() function will be called again.
  NOTE: https://stackoverflow.com/questions/22876978/loop-inside-react-jsx for sending a list into jsx
*/
class Board extends React.Component {
  renderContent(i, j) {
    if(j === 0 || j === 1 || j === 6 || j === 7) {
      return (
          <img className="piece-placeholder" src="./images/green-board.png" alt="Broken!"/>
      )
    }
    else {
      return ""
    }
  }

  getClassName(i, j) {
    if ((i+j)%2 === 0) {
      return("board-square light")
    }
    else {
      return("board-square dark")
    }
  }

  renderBoard() {
    return(
      <div className="board">
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
        {this.renderRow(3)}
        {this.renderRow(4)}
        {this.renderRow(5)}
        {this.renderRow(6)}
        {this.renderRow(7)}
      </div>
    )
  }
  renderRow(i) {
    return(
      <div className="board-row" >
        {this.renderSquare(i, 0)}
        {this.renderSquare(i, 1)}
        {this.renderSquare(i, 2)}
        {this.renderSquare(i, 3)}
        {this.renderSquare(i, 4)}
        {this.renderSquare(i, 5)}
        {this.renderSquare(i, 6)}
        {this.renderSquare(i, 7)}
      </div>
    )
  }
  renderSquare(i, j) {
    return (
      <div className={this.getClassName(i, j)}>
        <div className="square-content">
          {/*May be empty OR contain a piece*/}
          {this.renderContent(i, j)}
        </div>
      </div>
    )
  }

  render() {
    return (
        <div>
          {this.renderBoard()}
        </div>
    )
  }
}

export default Board

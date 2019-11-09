import React from 'react'
import '../css/Board.css';

/*
  This class, when rendered, will return a React Component.
  The Component will contain HTML content for the newly rendered GameHeader.
  In otherwords, everytime there is a state change in the header,
  The render() function will be called again.
*/
class GameHeader extends React.Component {

  /* Update the board if the state changes */
  renderGameStatus(inCheckmate, inStalemate) {
    if (inCheckmate) {
      return (
        <div className="game-status game-over">
          Checkmate | {this.props.enemyId} wins!
        </div>
      )
    }
    else if (inStalemate) {
      return (
        <div className="game-status game-over">
          Stalemate
        </div>
      )
    }
    else {
      return (
        <div className="game-status">
          Whose turn is it: {this.props.turnId} | Turn: {this.props.turnCount}
        </div>
      )
    }
  }


  render() {
    return (
      <div className="game-header">
        <div className={this.props.turnIndicatorClassName}/>
        {/*Place a div saying whose turn it is OR who the victor is*/}
        {this.renderGameStatus(this.props.inCheckmate, this.props.inStalemate)}
        <div>
          <button id="prev-state-btn" onClick={this.props.prevOnClick} className="state-arrow-button">{"<-"}</button>
          <button id="next-state-btn" onClick={this.props.nextOnClick} className="state-arrow-button">{"->"}</button>
        </div>
        <div>
          <button id="new-game-btn" onClick={this.props.newGameOnClick} className="new-game-button">New Game</button>
        </div>
      </div>
    )
  }
}

export default GameHeader

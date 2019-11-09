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
  render() {
    return (
      <div className="game-header">
        <div className={this.props.turnIndicatorClassName}/>
        <div className="turn-id">
          Whose turn is it: {this.props.turnId} | Turn: {this.props.turnCount}
        </div>
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

import React from 'react'
import Board from './Board.js'

/*import '../css/Game.css';*/


class Game extends React.Component{
  constructor(props) {
    super(props)

    /*
      What do I want?
      To make an 8 by 8 grid, and display an item (pref coordinates) in each.
      Flow:
        Game -> Board : props=desiredBoardState -> Each square
    */

    this.state = {
      squares: Array(8).fill(2),
      whiteToMove: true
    }
  }

  getTurnID() {
    return (this.state.whiteToMove ? 'White' : 'Black')
    /*
    if (this.state.whiteToMove === true){
      return "White"
    }
    else{
      return "Black"
    }
    */
  }

  render() {
    return (
      <div>
        <div>Whose turn is it: {this.getTurnID()} </div>
      <Board squares={this.state.squares}/>
      </div>
    );
  }
}

export default Game //Make this class public

import React from 'react';
/*import '../css/Game.css';*/

class Game extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      whiteToMove: true
    }
  }

  getTurnID() {
    console.log(this.props)
    console.log(this.state)
    if (this.state.whiteToMove === true){
      return "White"
    }
    else{
      return "Black"
    }
  }

  render() {

    return (
      <div>
        <div>Whose turn is it: {this.getTurnID()} </div>
      </div>
    );
  }
}

export default Game //Make this class public

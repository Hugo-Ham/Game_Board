import React, { useState, useEffect } from 'react';
import './App.css';
import { useInput } from './useInput';
import Board from './Board';


// Function that is called in index.tsx
function App(props: any) {

  // Get and save Nickname of player 
  const [playerName, updateName] = useState('')
  function GetNick() {
    const { value, bind, reset } = useInput('');

    const handleSubmit = (evt: { preventDefault: () => void; }) => {
      evt.preventDefault();
      props.socket.emit('Nickname', value)
      updateName(value)
      reset();
    }

    return (
      <div>
        <p>Tic Tac Toe Menu</p>
        <form onSubmit={handleSubmit}>
          <label>
            Nickname:
        <input type="text" {...bind} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }


  // Get and save the choice of the player : Online or Offline
  const [gamechoice, gameupdate] = useState('');
  function UserChoice() {
    return (
      <div>
        <button onClick={() => { gameupdate('Online') }}>
          Online game
             </button>
        <button onClick={() => gameupdate('Offline')}>
          Offline game
             </button>
      </div>
    );
  }

  // Communicate game choice to server
  useEffect(() => {
    if (gamechoice != '') {
      props.socket.emit('gameChoice', gamechoice)
    }
  }, [gamechoice])


  // Return board if a game choice was made otherwise keep initial menu
  if (gamechoice != '') {
    return (
      <div className="App">
        <header className="App-header">
          <Board gamechoice={gamechoice} socket={props.socket} name={playerName} />
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <GetNick />
        <UserChoice />
      </header>
    </div>
  )

}

export default App;
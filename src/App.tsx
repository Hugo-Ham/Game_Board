import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useInput } from './useInput';
import Board from './Board';


function App(props: any) {

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

  useEffect(() => {
    if (gamechoice != '') {
      props.socket.emit('gameChoice', gamechoice)
    }
  }, [gamechoice])

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
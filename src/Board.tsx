import React, { useEffect, useState } from 'react';


// Function that is called in App.tsx
function Board(props: any) {

    // Defining hooks and properties 

    let [board, updateBoard] = useState({
        squares: Array(9).fill(null),
        xIsNext: true,
        status: null
    })

    // Boolean that updates when a room is full and ready to start in 'Online' mode
    const [started, updateStart] = useState(false)

    // Boolean that indicates the player is X in 'Online' mode
    const [xPlayer, updatePlayersym] = useState(false)

    // Receive the inital board from the server
    props.socket.once('gameSetup', (initialState: any) => {
        updateBoard({
            squares: initialState.squares,
            xIsNext: initialState.turn,
            status: initialState.status
        })
    })

    // Receive the board and who is the X player in 'Online' mode
    props.socket.once('gameStart', (online: any) => {

        // update de the 'started' boolean and the board
        updateStart(true)
        updateBoard(online.board)

        if (props.name == online.xPlayer) {
            updatePlayersym(true)
        }

    })

    // defining the lobby constant and waiting for lobby information from the server in 'Online' mode
    const [lobbyInfo, setLobby] = useState({})
    props.socket.on('lobbySetup', (info: any) => {
        setLobby({
            name: info.name,
            opponent: info.opponent
        })
    })

    // updates the board when the server sends a 'update' message
    props.socket.on('update', (board: any) => {
        updateBoard(board)
    })

    // function that is specific to the 'Online' mode, returns room when waiting and the board when room is full
    function Room(props: any) {

        if (started) {
            return (
                <div>
                    <div className="status">{board.status}</div>
                    <div className="board-row">
                        {renderSquare(props, 0)}
                        {renderSquare(props, 1)}
                        {renderSquare(props, 2)}
                    </div>
                    <div className="board-row">
                        {renderSquare(props, 3)}
                        {renderSquare(props, 4)}
                        {renderSquare(props, 5)}
                    </div>
                    <div className="board-row">
                        {renderSquare(props, 6)}
                        {renderSquare(props, 7)}
                        {renderSquare(props, 8)}
                    </div>
                </div>
            );
        }
        return (
            <div>
                <header>
                    You are in {props.lobbyInfo.name}
                </header>
                <h1>
                    Waiting for opponent
            </h1>
            </div >
        )
    }

    // to render the room
    function renderRoom(props: any, lobbyInfo: any) {
        return (
            <Room lobbyInfo={lobbyInfo} socket={props.socket} gamechoice={props.gamechoice} />
        )
    }

    function Square(props: { onClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined; value: React.ReactNode; }) {
        return (
            <button className="square" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }

    // render the sqaures of the board
    function renderSquare(props: any, i: number) {
        return (<Square
            value={board.squares[i]}
            onClick={() => handleClick(props, i)}
        />
        );
    }

    // Function used to when user clicks on square
    function handleClick(props: any, i: number) {
        if (board.squares) {
            // For the 'Online' mode
            if (props.gamechoice == 'Online') {
                if (board.xIsNext) {
                    if (xPlayer) {
                        // in this case 'X' is next and you are the 'X' player
                        let data = {board: board, index: i}
                        props.socket.emit('turn', data)
                    }
                }
                else {
                    if (!xPlayer) {
                        // in this case 'O' is next and you are the 'O' player
                        let data = {board: board, index: i}
                        props.socket.emit('turn', data)
                    }
                }
            }

            // For the 'Offline' mode
            else {
                console.log('Value of square i:', board.squares[i], 'i:', i)
                props.socket.emit('turn', i)
            }
        }
    }

    // Return of Board.tsx, depends on the game mode choice made by player
    if (props.gamechoice == 'Offline') {
        return (
            <div>
                <div className="status">{board.status}</div>
                <div className="board-row">
                    {renderSquare(props, 0)}
                    {renderSquare(props, 1)}
                    {renderSquare(props, 2)}
                </div>
                <div className="board-row">
                    {renderSquare(props, 3)}
                    {renderSquare(props, 4)}
                    {renderSquare(props, 5)}
                </div>
                <div className="board-row">
                    {renderSquare(props, 6)}
                    {renderSquare(props, 7)}
                    {renderSquare(props, 8)}
                </div>
            </div>
        );
    }

    return (
        <div className='status'>
            {renderRoom(props, lobbyInfo)}
        </div>
    )

}

export default Board;
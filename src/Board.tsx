import React, { useEffect, useState } from 'react';

function Board(props: any) {

    let [board, updateBoard] = useState({
        squares: Array(9).fill(null),
        xIsNext: true,
        status: null
    })

    const [started, updateStart] = useState(false)

    const [xPlayer, updatePlayersym] = useState(false)

    props.socket.once('gameSetup', (initialState: any) => {
        updateBoard({
            squares: initialState.squares,
            xIsNext: initialState.turn,
            status: initialState.status
        })
    })

    props.socket.once('gameStart', (online: any) => {
        updateStart(true)
        console.log(online.xPlayer)
        updateBoard(online.board)
        if (props.name == online.xPlayer) {
            console.log('I am x player')
            updatePlayersym(true)
        }
        else {
            console.log('I am not x player')
        }
    })

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

    function renderSquare(props: any, i: number) {
        return (<Square
            value={board.squares[i]}
            onClick={() => handleClick(props, i)}
        />
        );
    }

    function handleClick(props: any, i: number) {
        // Online allow clicks when its your turn
        console.log(props.gamechoice)
        if (board.squares) {
            if (props.gamechoice == 'Online') {
                if (board.xIsNext) {
                    if (xPlayer) {
                        let data = {board: board, index: i}
                        console.log(data)
                        props.socket.emit('turn', data)
                    }
                }
                else {
                    if (!xPlayer) {
                        let data = {board: board, index: i}
                        console.log(data)
                        props.socket.emit('turn', data)
                    }
                }
            }
            else {
                console.log('Value of square i:', board.squares[i], 'i:', i)
                props.socket.emit('turn', i)
            }
        }
    }

    const [lobbyInfo, setLobby] = useState({})

    props.socket.on('lobbySetup', (info: any) => {
        console.log(info)
        setLobby({
            name: info.name,
            opponent: info.opponent
        })
    })

    props.socket.on('update', (board: any) => {
        console.log('board updated')
        updateBoard(board)
    })

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
    console.log('gamechoice', props.gamechoice)
    return (
        <div className='status'>
            {renderRoom(props, lobbyInfo)}
        </div>
    )

}

export default Board;
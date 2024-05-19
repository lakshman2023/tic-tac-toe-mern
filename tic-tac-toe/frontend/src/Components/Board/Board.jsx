import { useEffect, useState } from "react";
import axios from 'axios';
import './Board.css';
import clickSound from '../../sounds/click.wav';
import winSound from '../../sounds/win.wav';
function Board(){
    const [game, setGame] = useState(null);
    const [message, setMessage] = useState('');
    const [winningCells, setWinningCells] = useState([]);
    //create a new game using post api on load
    useEffect(() => {
        const createGame = async() => {
            const res = await axios.post('http://localhost:5000/api/games/');
            setGame(res.data);
        };
        createGame();
    }, []);

    const playSound = (sound) => {
        const audio = new Audio(sound);
        audio.play();
    };

    //handles the user clicks on a cell
    const handleClick = async(row,col) => {
        //if cell is already filled or there's a winner already, return
        console.log("click triggered");
        if(game.board[row][col] !== '' || game.winner) return;
        const newBoard = game.board.map((rowArr, rowIdx) => (
            rowArr.map((cell, colIdx) => {
                if(rowIdx === row && colIdx === col){
                   return game.currentPlayer;
                }
                return cell;
            }))
        );
        const newPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        const winnerInfo = checkWinner(newBoard);
        const res = await axios.put(`http://localhost:5000/api/games/${game._id}`, {
            board: newBoard,
            currentPlayer: newPlayer,
            winner: winnerInfo.winner
        });
        setGame(res.data);
        playSound(clickSound);
        if(winnerInfo.winner){
            playSound(winSound);
            setMessage(`Player ${res.data.winner} won!`);
            setWinningCells(winnerInfo.line);
        } else {
            setMessage('');
            setWinningCells([]);
        }
    };

    const checkWinner = (board) => {
        const winningCombinations = [
            //row combination
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],

            //column combination
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],

            //diagonal combination
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]]

        ];
        for(let combination of winningCombinations){
            const [a,b,c] = combination;
            if(board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]){
                return { winner : board[a[0]][a[1]], line : combination};
            }
        }
        return {winner : '', line : []};
    };
    if(!game){
        return (
            <div> Loading ... </div>
        )
    } else {
        return (
            <div className="board">
            {game.board.map((rowArr, rowIdx) => (
                <div key={rowIdx} className="row"> 
                {rowArr.map((cell, colIdx) => (
                    <div key={colIdx} className={`cell ${winningCells.some(([r,c]) => r === rowIdx && c === colIdx) ? 'winning-cell' : ''}`} onClick={() => handleClick(rowIdx, colIdx)}>
                        {cell}
                    </div>
                ))}
                </div>
            ))}
            <h2>{message}</h2>
            </div>
        );
    }

}

export default Board;
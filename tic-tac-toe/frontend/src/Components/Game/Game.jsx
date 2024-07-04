// import { useEffect, useState } from "react";
// import Board from "../Board";
// import ScoreBoard from "../ScoreBoard/Scoreboard";
// import Logout from "../Logout";
// import { useParams } from "react-router-dom";
// import axios from "../../axiosConfig";
// import './Game.css';

// const Game = () => {
//     const {matchId} = useParams();
//     const [error, setError] = useState('');
//     const [match, setMatch] = useState({});
//     const [game, setGame] = useState({});
//     const [board, setBoard] = useState([]);
//     const [winner, setWinner] = useState(null);
//     const [currentPlayer, setCurrentPlayer] = useState('X');
//     const [userSymbol, setUserSymbol] = useState(null);//to make sure players are playing on their turn only

//     //get match and latest game details on rendering
//     useEffect(()=>{
//         const fetchMatch = async () => {
//             try {
//                 const res = await axios.get(`/api/matches/${matchId}`, {
//                     headers : {'Authorization' : `Bearer ${localStorage.getItem('token')}`}
//                 });
//                 //match = res.data;
//                 setMatch(match);
                
//                 console.log("response data = " + JSON.stringify(res.data));
//                 console.log("match data = " + JSON.stringify(match));

//                 const lastGameId = match.games[match.games.length - 1];
//                 if(lastGameId){
//                     const lastGameResponse = await axios.get(`/api/games/${lastGameId}`, {
//                         headers: {'Authorization' : `Bearer ${localStorage.getItem('token')}`}
//                     });
//                     setGame(lastGameResponse.data);
//                     setBoard(lastGameResponse.data.board);
//                     setCurrentPlayer(lastGameResponse.data.currentPlayer);
//                     setWinner(lastGameResponse.data.winner);
//                 }
//                 // const lastGame = match.games[match.games.length - 1];
//                 // setGame(lastGame);
//                 // setBoard(lastGame.board);
//                 // setCurrentPlayer(lastGame.currentPlayer);
//                 // setWinner(lastGame.winner);
//                 console.log("game data = " + JSON.stringify(game));
//                 console.log("board data = " + JSON.stringify(board));
//                 console.log("currentPlayer data = " + JSON.stringify(currentPlayer));
//                 console.log("winner data = " + JSON.stringify(winner));
//                 const userId = localStorage.getItem('userId');
                
//                 if(match.player1 === userId) {
//                     setUserSymbol('X');
//                 } else if(match.player2 === userId){
//                     setUserSymbol('Y');
//                 }
//             } catch (error) {
//                 console.error(error);
//                 setError(`Error occurred while fetching match details: ${error}`);
//             }
//         }

//         fetchMatch();
//     },[matchId]);

//     const handleCellClick = async (row, col) => {
//         //cell already filled or game over or player trying to play on opponent's turn
//         if(board[row][col] || winner || currentPlayer !== userSymbol) return;
//         const newBoard = board.map((r,i) => (i === row ? r.map((cell,j) => (j === col ? currentPlayer : cell)) : r));
//         const newCurrentPlayer = currentPlayer === 'X' ? 'O' : 'X';

//         const checkWinner = () => {
//             const size =  newBoard.length;
//             const lines = [];

//             //horizontal and vertical lines
//             for(let i=0;i<size;i++){
//                 for(let j=0;j<= size - match.winningLength;j++){
//                     lines.push(newBoard[i].slice(j, j + match.winningLength));
//                     lines.push(newBoard.slice(j, j + match.winningLength).map(row => row[i]));
//                 }
//             }

//             //diagonal lines
//             for(let i=0;i<= size - match.winningLength; i++){
//                 for(let j=0;j<= size - match.winningLength; j++){
//                     let diag1 = [], diag2 = [];
//                     for(let k=0;k<match.winningLength;k++){
//                         diag1.push(newBoard[i+k][j+k]);
//                         diag2.push(newBoard[i+k][j+match.winningLength-1-k]);
//                     }
//                     lines.push(diag1, diag2);
//                 }
//             }

//             for(const line of lines){
//                 if(line.every(cell => cell === 'X')) return 'X';
//                 if(line.every(cell => cell === 'O')) return 'O';
//             }
//             return null;
//         };

//         setBoard(newBoard);
//         setCurrentPlayer(newCurrentPlayer);
//         setWinner(checkWinner());

//         const checkTie = () => {
//             return newBoard.every(row => row.every(cell => cell));
//         };

//         const tie = checkTie() && !winner;

//         try {
//             //update game status to backend
//             await axios.put(`/api/games/${game._id}`,{
//                 board : newBoard,
//                 currentPlayer : newCurrentPlayer,
//                 winner
//             }, {
//                 headers : {'Authorization' : `Bearer ${localStorage.getItem('token')}`}
//             });
//             //update match in case we have a winner or tie and reset UI for next game in 2 sec
//             if(winner || tie){
//                 await axios.put(`/api/matches/${matchId}`, {winner : winner || (tie ? 'Tie' : null)}, {
//                     headers : {'Authorization' : `Bearer ${localStorage.getItem('token')}`}
//                 });
//                 setTimeout(()=>{
//                     setBoard(Array(newBoard.length).fill(Array(newBoard.length).fill(null)));
//                     setCurrentPlayer('X');
//                     setWinner(null);
//                 }, 2000);
//             }

//         } catch (error) {
//             setError('Error updating game');
//             console.error(`Error updating game : ${error}`);
//         }

//     };
    

//     return (
//         <div className="game-container">
//             <h1>Tic-Tac-Toe</h1>
//             {error && <p className="error-message">{error}</p>}
//             {match && match.games && <Board board={board} onClick={handleCellClick}/>}
//             <div className="game-info">
//                 {winner ? `Winner: ${winner}` : `Next Player: ${currentPlayer}`}
//             </div>
//             {/* <div className="scoreboard">
//                 <ScoreBoard playerScores={[{name : match.player1.username, score : match.scorePlayer1},{name : match.player2.username, score : match.scorePlayer2}]}/>
//             </div> */}
//             {/* <Logout/> */}
//         </div>
//     )
    
// };

// export default Game;

import { useEffect, useReducer, useRef, useState } from "react";
import Board from "../Board";
import ScoreBoard from "../ScoreBoard/Scoreboard";
import Logout from "../Logout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axiosConfig";
import './Game.css';
import reducer from "../../Reducers/MatchReducer/MatchReducer";
import {io} from 'socket.io-client';

const initialState = {
    error: '',
    match: null,
    userSymbol: null
};

const Game = () => {
    const { matchId } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [userSymbol, setUserSymbol] = useState(null);
    const [globalScores, setGlobalScores] = useState([]);
    const socketRef = useRef(null);// = io(process.env.REACT_APP_API_URL);//creating socket to subscribe to game updates
    const navigate = useNavigate();

    const populateUserSymbol = (matchData) => {
        const userId = localStorage.getItem('userId');
        console.log("matchData in populateSymbol = ", matchData);
        console.log("userId = " + userId);
        console.log("userSymbol before setting = " + userSymbol);
        if (matchData.player1._id === userId) {
            setUserSymbol('X');
            //dispatch({ type: 'SET_USER_SYMBOL', payload: 'X' });
        } else if (matchData.player2._id === userId) {
            setUserSymbol('O');
            //dispatch({ type: 'SET_USER_SYMBOL', payload: 'O' });
        }
        console.log("userSymbol after setting = " + userSymbol);
    };

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const res = await axios.get(`/api/matches/${matchId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                
                dispatch({ type: 'SET_MATCH', payload: res.data });

                // const lastGameId = res.data.games[res.data.games.length - 1]._id;
                // if (lastGameId) {
                //     const lastGameResponse = await axios.get(`/api/games/${lastGameId}`, {
                //         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                //     });
                //     dispatch({ type: 'SET_GAME', payload: lastGameResponse.data });
                // }

                // const userId = localStorage.getItem('userId');
                // console.log("userSymbol before setting = " + userSymbol);
                // if (res.data.player1 === userId) {
                //     setUserSymbol('X');
                //     //dispatch({ type: 'SET_USER_SYMBOL', payload: 'X' });
                // } else if (res.data.player2 === userId) {
                //     setUserSymbol('O');
                //     //dispatch({ type: 'SET_USER_SYMBOL', payload: 'O' });
                // }
                // console.log("userSymbol after setting = " + userSymbol);
                populateUserSymbol(res.data);
                if(!socketRef.current){
                    socketRef.current = io(process.env.REACT_APP_API_URL);
                    socketRef.current.emit('joinMatch', matchId);//join the match room
                    socketRef.current.on('gameUpdate', (updatedMatch) => {
                        dispatch({ type: 'SET_MATCH', payload: updatedMatch });//update board on receiving game updates
                    });
                }
                //console.log(socketRef.current);
            } catch (error) {
                console.error(error);
                dispatch({ type: 'SET_ERROR', payload: `Error occurred while fetching match details: ${error.message}` });
            }
        };

        fetchMatch();

        // Cleanup function to disconnect the socket when the component unmounts
        return ()=>{
            if(socketRef.current){
                console.log(`disconnecting user from socket`);
                socketRef.current.disconnect();
            }
        };
    }, [matchId, navigate]);

    useEffect(()=>{
        const fetchGlobalScores = async () => {
            try {
                const res = await axios.get('/api/matches/scoreboard/global', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setGlobalScores(res.data);
            } catch (error) {
                console.error(`Error fetching global scores: ${error.message}`);
            }
        };

        fetchGlobalScores();
    },[state.match]);

    const handleCellClick = async (row, col) => {
        try {
            console.log("handling click for cell[" + row + ", " + col + "]");
            const {error, match} = state;
            const lastGame = match.games[match.games.length - 1];
            const {board, currentPlayer, winner} = lastGame;
            populateUserSymbol(match);
            console.log("match data = " + JSON.stringify(match));
            //const isPlayerTurn = 
            //if cell is already filled or game ended by winner or player out of turn
            if (board[row][col] || winner || currentPlayer !== userSymbol) {
                console.log("returning here because of params board[row][col] = " + board[row][col] + ", winner=" + winner + ", currentPlayer=" + currentPlayer + ", userSymbol=" + userSymbol);
                return;
            }

            const newBoard = board.map((r, i) => (i === row ? r.map((cell, j) => (j === col ? currentPlayer : cell)) : r));
            const newCurrentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            
            //setUserSymbol(newCurrentPlayer);
            //dispatch({type: 'SET_USER_SYMBOL', payload: newCurrentPlayer});

            const checkWinner = () => {
                const size = newBoard.length;
                const lines = [];

                // horizontal and vertical lines
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j <= size - match.winningLength; j++) {
                        lines.push(newBoard[i].slice(j, j + match.winningLength));
                        lines.push(newBoard.slice(j, j + match.winningLength).map(row => row[i]));
                    }
                }

                // diagonal lines
                for (let i = 0; i <= size - match.winningLength; i++) {
                    for (let j = 0; j <= size - match.winningLength; j++) {
                        let diag1 = [], diag2 = [];
                        for (let k = 0; k < match.winningLength; k++) {
                            diag1.push(newBoard[i + k][j + k]);
                            diag2.push(newBoard[i + k][j + match.winningLength - 1 - k]);
                        }
                        lines.push(diag1, diag2);
                    }
                }

                for (const line of lines) {
                    if (line.every(cell => cell === 'X')) return 'X';
                    if (line.every(cell => cell === 'O')) return 'O';
                }
                return null;
            };

            const newWinner = checkWinner();
            const isTie = newBoard.every(row => row.every(cell => cell)) && !newWinner;

            const updatedGame = {
                ...lastGame,
                board: newBoard,
                currentPlayer: newCurrentPlayer,
                winner: newWinner || (isTie ? 'Tie' : null)
            };

            console.log("updated game = " + JSON.stringify(updatedGame));

            await axios.put(`/api/games/${lastGame._id}`, updatedGame, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            console.log("updated game in db");

            let updatedMatch = {
                ...match,
                games: match.games.map(game => game._id === lastGame._id ? updatedGame : game)            
            }

            console.log("updated match = " + JSON.stringify(updatedMatch));

            if (newWinner || isTie) {
                const updatedMatchResponse = await axios.put(`/api/matches/${matchId}/update-score`, { winner: newWinner || (isTie ? 'Tie' : null) }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                updatedMatch = updatedMatchResponse.data;
                //setTimeout(() => {
                    dispatch({ type: 'SET_MATCH', payload: updatedMatch});
                //}, 2000);
            } else {
                dispatch({ type: 'SET_MATCH', payload: updatedMatch });
            };
            console.log("sending move to update match" + JSON.stringify(updatedMatch));

            socketRef.current.emit('moveMade', matchId, updatedMatch);

            console.log("sent move to update match"+ JSON.stringify(updatedMatch));

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: `Error updating game: ${error}` });
            console.error(`Error updating game: ${error}`);
        }
    };

    const { match, error } = state;
    const lastGame = match?.games && match.games.length > 0 ? match.games[match.games.length - 1] : {};
    console.log("match data = " + JSON.stringify(match));

    return (
        <div className="game-container">
            <div className="scoreboard-left">
                <ScoreBoard title="Global Scoreboard" playerScores={globalScores} />
            </div>
            <div className="game-content">
                <h1>Tic-Tac-Toe</h1>
                {error && <p className="error-message">{error}</p>}
                {match && lastGame.board && <Board board={lastGame.board} onClick={handleCellClick}/>}
                <div className="game-info">
                {lastGame.winner ? `Winner: ${lastGame.winner}` : lastGame.currentPlayer ? `Next Player: ${lastGame.currentPlayer}` : ''}
                </div>
            </div>
            <div className="scoreboard-right">
                {
                    match && (
                        <ScoreBoard title="Match Scoreboard"
                        playerScores={[{ username: match.player1?.username, rating: match.player1?.rating, score: match.scorePlayer1 }, { username: match.player2?.username, rating: match.player2?.rating, score: match?.scorePlayer2 }]} />
                    )
                }              
            </div>
            {/* <Logout /> */}
        </div>
    );
};

export default Game;
